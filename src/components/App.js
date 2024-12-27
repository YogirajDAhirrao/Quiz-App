import { useEffect, useReducer } from "react";
import "../App.css";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen.js";
import Questions from "./Questions";
import NextButton from "./NextButton.js";
import Progress from "./Progress.js";
import Finished from "./Finished.js";
import Footer from "./Footer.js";
import Timer from "./Timer.js";
const initialState = {
  questions: [],
  // loading ,error,ready,active,finished
  status: "loading",
  index: 0, // use this index to take the certain question out of questions array. use to dispaly the next questions.we will render the questions one by one. index needs to be the state be it we want to rerender the screen once it is updated, i.e. when we move to the next question
  answer: null, // index of the option
  points: 0,
  secondsRemaining: 60,
}; //Add piece of state here in the initialState Object
const reducer = (state, action) => {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      const question = state.questions.at(state.index); // here we are using the current state to compute the next state
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finished":
      return { ...state, status: "finished" };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("NA");
  }
};
export default function App() {
  const [
    { questions, status, index, answer, points, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState); // Destructured state on the go as {questions, status}
  let Noquestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, curr) => prev + curr.points,
    0
  );
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={Noquestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={Noquestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
            />
            <Questions
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
            </Footer>
            <NextButton
              dispatch={dispatch}
              answer={answer}
              index={index}
              numQuestions={Noquestions}
            />
          </>
        )}
        {status === "finished" && (
          <>
            <Finished points={points} maxPossiblePoints={maxPossiblePoints} />
            <button
              className="btn btn-ui "
              onClick={() => dispatch({ type: "restart" })}
            >
              Restart Quiz
            </button>
          </>
        )}
      </Main>
    </div>
  );
}
