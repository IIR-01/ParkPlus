function RideCard({ ride }) {
  const getWaitLevel = (waitTime) => {
    if (waitTime <= 15) {
      return {
        label: "Short wait",
        className: "wait-low",
      };
    }

    if (waitTime <= 30) {
      return {
        label: "Moderate wait",
        className: "wait-medium",
      };
    }

    return {
      label: "Long wait",
      className: "wait-high",
    };
  };

  const waitLevel = getWaitLevel(ride.waitTime);

  return (
    <article className="ride-card">
      <div className="ride-card__icon">🎢</div>

      <div className="ride-card__content">
        <h2>{ride.name}</h2>
        <p className={`wait-badge ${waitLevel.className}`}>
          {waitLevel.label}
        </p>
      </div>

      <div className="ride-card__time">
        <strong>{ride.waitTime}</strong>
        <span>minutes</span>
      </div>
    </article>
  );
}

export default RideCard;