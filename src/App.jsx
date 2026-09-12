import { useEffect, useMemo, useState } from "react";
import { fetchNeos } from "./api.js";
import SummaryCards from "./components/SummaryCards.jsx";
import AsteroidChart from "./components/AsteroidChart.jsx";
import AsteroidTable from "./components/AsteroidTable.jsx";

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function defaultRange() {
  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + 6); // 7-day window including today
  return { start: isoDate(start), end: isoDate(end) };
}

/**
 * Root dashboard component.
 * Owns loading/error/data state and passes props into child components.
 */
export default function App() {
  const initial = useMemo(() => defaultRange(), []);
  const [startDate, setStartDate] = useState(initial.start);
  const [endDate, setEndDate] = useState(initial.end);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(start = startDate, end = endDate) {
    setLoading(true);
    setError("");
    try {
      const payload = await fetchNeos(start, end);
      setData(payload);
    } catch (err) {
      setData(null);
      setError(err.message || "Failed to load NASA data.");
    } finally {
      setLoading(false);
    }
  }

  // Load once on first render.
  useEffect(() => {
    load(initial.start, initial.end);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(event) {
    event.preventDefault();
    load(startDate, endDate);
  }

  const dateLabel = data
    ? `${data.start_date} → ${data.end_date}`
    : `${startDate} → ${endDate}`;

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">NASA Space Apps training</p>
        <h1>Near-Earth Object Dashboard</h1>
        <p className="lede">
          Live asteroid close-approach data from NASA NeoWs, proxied through a
          small FastAPI backend.
        </p>
      </header>

      <form className="filters" onSubmit={onSubmit}>
        <label>
          Start
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
        <label>
          End
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Loading…" : "Update"}
        </button>
        <p className="hint">NeoWs allows at most 7 days between start and end.</p>
      </form>

      {error && (
        <div className="banner error" role="alert">
          {error}
        </div>
      )}

      {loading && !data && <p className="muted">Fetching data from NASA…</p>}

      {data && (
        <>
          <SummaryCards
            count={data.count}
            hazardousCount={data.hazardous_count}
            dateLabel={dateLabel}
          />

          <section className="panel">
            <h2>Largest estimated diameters</h2>
            <AsteroidChart asteroids={data.asteroids} />
          </section>

          <section className="panel">
            <h2>Close approaches</h2>
            <AsteroidTable asteroids={data.asteroids} />
          </section>
        </>
      )}

      <footer className="footer">
        Data source:{" "}
        <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer">
          NASA Open APIs — NeoWs
        </a>
      </footer>
    </div>
  );
}
