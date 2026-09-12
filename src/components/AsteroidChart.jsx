import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Bar chart of the largest asteroids (by estimated diameter).
 * We only show the top 10 so the chart stays readable.
 */
export default function AsteroidChart({ asteroids }) {
  const data = [...asteroids]
    .filter((a) => a.diameter_km != null)
    .sort((a, b) => b.diameter_km - a.diameter_km)
    .slice(0, 10)
    .map((a) => ({
      name: a.name.length > 18 ? `${a.name.slice(0, 16)}…` : a.name,
      diameter_km: a.diameter_km,
      hazardous: a.hazardous,
    }));

  if (data.length === 0) {
    return <p className="muted">No diameter data available for this range.</p>;
  }

  return (
    <div className="chart-wrap" role="img" aria-label="Top asteroids by diameter">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d7e0ea" />
          <XAxis
            dataKey="name"
            interval={0}
            angle={-35}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 11, fill: "#445566" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#445566" }}
            label={{ value: "km", angle: -90, position: "insideLeft", fill: "#445566" }}
          />
          <Tooltip
            formatter={(value) => [`${value} km`, "Est. diameter"]}
            contentStyle={{ borderRadius: 8, borderColor: "#c9d6e3" }}
          />
          <Bar dataKey="diameter_km" fill="#1f6feb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
