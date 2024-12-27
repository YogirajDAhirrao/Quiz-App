function Progress({ index, numQuestions, points, maxPossiblePoints }) {
  return (
    <header className="progress">
      <progress max={numQuestions} value={index}></progress>
      <p>
        {" "}
        Question <strong>{index + 1}</strong>/{numQuestions}
      </p>
      <p>
        Points <strong>{points}</strong>/{maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
