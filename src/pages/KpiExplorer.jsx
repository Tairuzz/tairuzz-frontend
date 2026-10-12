import { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import sampleData from "../data/sample_kpis.json";

// Native page: data loads once, then every click filters in the browser.
// Currently runs on SAMPLE data. Hidden from clients unless their Cosmos
// tabs map has "KPI Explorer": true. Replace sampleData with a fetch() to a
// real endpoint before any paying client sees it.

const METRICS = [
  { key: "goals", label: "Goals" },
  { key: "assists", label: "Assists" },
  { key: "xG", label: "xG" },
  { key: "passesCompleted", label: "Passes completed" }
];

export default function KpiExplorer() {
  const [data, setData] = useState([]);
  const [metric, setMetric] = useState("goals");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(sampleData);
    setLoaded(true);
  }, []);

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => b[metric] - a[metric]).slice(0, 8);
  }, [data, metric]);

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: 500, margin: "0 0 8px" }}>KPI explorer</h2>
      <p style={{ fontSize: "12px", color: "#b45309", margin: "0 0 20px" }}>
        Sample data - not real statistics yet.
      </p>
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            style={{
              padding: "8px 16px", borderRadius: "8px", cursor: "pointer",
              border: metric === m.key ? "1px solid #1F3864" : "1px solid #ccc",
              background: metric === m.key ? "#1F3864" : "#fff",
              color: metric === m.key ? "#fff" : "#333",
              fontSize: "13px"
            }}
          >
            {m.label}
          </button>
        ))}
      </div>
      {!loaded ? (
        <div style={{ color: "#888", fontSize: "14px" }}>Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={sorted} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis type="category" dataKey="player" width={140} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey={metric} fill="#2ED9A8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
