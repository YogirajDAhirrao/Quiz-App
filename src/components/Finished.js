function Finished({ points, maxPossiblePoints }) {
  return (
    <p className="result">
      You have scored{points} out of {maxPossiblePoints}
    </p>
  );
}

export default Finished;
