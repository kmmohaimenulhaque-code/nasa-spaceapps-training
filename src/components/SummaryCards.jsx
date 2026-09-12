function formatNumber(value) {
  if (value == null || Number.isNaN(value)) return "—";
  return Number(value).toLocaleString();
}

/**
 * Three simple summary numbers for the top of the dashboard.
 */
export default function SummaryCards({ count, hazardousCount, dateLabel }) {
  return (
    <section className="cards" aria-label="Summary">
      <article className="card">
        <p className="card-label">Near-Earth Objects</p>
        <p className="card-value">{formatNumber(count)}</p>
        <p className="card-note">{dateLabel}</p>
      </article>
      <article className="card">
        <p className="card-label">Potentially hazardous</p>
        <p className="card-value accent">{formatNumber(hazardousCount)}</p>
        <p className="card-note">NASA PHA flag</p>
      </article>
      <article className="card">
        <p className="card-label">Non-hazardous</p>
        <p className="card-value">{formatNumber(Math.max(0, count - hazardousCount))}</p>
        <p className="card-note">Remaining objects</p>
      </article>
    </section>
  );
}
