function formatNumber(value) {
  if (value == null || Number.isNaN(value)) return "—";
  return Number(value).toLocaleString();
}

/**
 * Simple HTML table of asteroid close approaches.
 */
export default function AsteroidTable({ asteroids }) {
  if (!asteroids.length) {
    return <p className="muted">No asteroids found for this date range.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Approach date</th>
            <th>Diameter (km)</th>
            <th>Miss distance (km)</th>
            <th>Velocity (km/h)</th>
            <th>Hazardous</th>
          </tr>
        </thead>
        <tbody>
          {asteroids.map((a) => (
            <tr key={a.id || `${a.name}-${a.approach_date}`}>
              <td>{a.name}</td>
              <td>{a.approach_date || "—"}</td>
              <td>{formatNumber(a.diameter_km)}</td>
              <td>{formatNumber(a.miss_distance_km)}</td>
              <td>{formatNumber(a.velocity_kph)}</td>
              <td>
                <span className={a.hazardous ? "badge danger" : "badge ok"}>
                  {a.hazardous ? "Yes" : "No"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
