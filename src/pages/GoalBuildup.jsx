import { useId } from "react";

// Native goal build-up page. Draws ONE goal's build-up as an SVG pitch.
// Replaces the Python visual (Python visuals do not work in app-owns-data embedding).
// Pass events = the rows for one goal. With no props it shows SAMPLE data.
// Coordinates use the 0-100 scale in the data (x along the pitch, y across it).

const KX = 1.05; // metres per data unit along x (pitch is 105 m long)
const KY = 0.68; // metres per data unit along y (pitch is 68 m wide)
const X = (x) => x * KX;
const Y = (y) => (100 - y) * KY; // SVG y runs down, data y runs up

const BLUE = "#2a78d6";
const ORANGE = "#D85A30";

const num = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const isTrue = (v) => v === true || v === "True" || v === "true";
const surnameOf = (name) => String(name || "").trim().split(/\s+/).pop();

const SAMPLE_EVENTS = [
  { sequenceInBuildup: 1, eventType: "pass", fromX: 6, fromY: 50, toX: 24, toY: 36, isAssist: false, actionPlayerName: "Sam Keeper" },
  { sequenceInBuildup: 2, eventType: "pass", fromX: 24, fromY: 36, toX: 41, toY: 28, isAssist: false, actionPlayerName: "Jon Defender" },
  { sequenceInBuildup: 3, eventType: "pass", fromX: 41, fromY: 28, toX: 60, toY: 44, isAssist: false, actionPlayerName: "Max Midfield" },
  { sequenceInBuildup: 4, eventType: "pass", fromX: 60, fromY: 44, toX: 82, toY: 62, isAssist: false, actionPlayerName: "Leo Playmaker" },
  { sequenceInBuildup: 5, eventType: "pass", fromX: 82, fromY: 62, toX: 90, toY: 52, isAssist: true, actionPlayerName: "Ben Winger" },
  {
    sequenceInBuildup: 6, eventType: "goal", fromX: 89, fromY: 49, toX: null, toY: null, isAssist: false,
    actionPlayerName: "Dan Striker", shotX: 89, shotY: 49, xg: 0.34, bodyPart: "Right foot",
    goalMouthLocation: "Bottom left", goalMouthX: 35, goalMouthY: 15
  }
];

// End point pulled back from the target so the arrowhead is not hidden under the node
const pull = (x1, y1, x2, y2, r) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  return [x2 - (dx / len) * r, y2 - (dy / len) * r];
};

export default function GoalBuildup({ events }) {
  const uid = useId().replace(/:/g, "");
  const arrowId = `${uid}-arrow`;
  const usingSample = !events;
  const data = events || SAMPLE_EVENTS;

  const rows = [...data].sort((a, b) => num(a.sequenceInBuildup) - num(b.sequenceInBuildup));
  const buildup = rows.filter(
    (r) => r.eventType !== "goal" && num(r.fromX) !== null && num(r.fromY) !== null
  );
  const goal = rows.find((r) => r.eventType === "goal") || null;

  const steps = buildup.map((r, i) => ({
    fx: num(r.fromX),
    fy: num(r.fromY),
    tx: num(r.toX),
    ty: num(r.toY),
    assist: isTrue(r.isAssist),
    seq: num(r.sequenceInBuildup),
    surname: surnameOf(r.actionPlayerName),
    first: i === 0
  }));
  const last = steps[steps.length - 1];
  const lastPoint = last
    ? last.tx !== null && last.ty !== null ? [last.tx, last.ty] : [last.fx, last.fy]
    : null;

  let shot = null;
  if (goal) {
    const sx = num(goal.shotX) ?? num(goal.fromX);
    const sy = num(goal.shotY) ?? num(goal.fromY);
    if (sx !== null && sy !== null) shot = { x: sx, y: sy };
  }

  // Goal mouth strip and the point where the ball crossed the line
  const gmX = goal ? num(goal.goalMouthX) : null;
  const gmY = goal ? num(goal.goalMouthY) : null;
  const GOAL_LO = 44.65;
  const GOAL_HI = 55.35;
  const GOAL_DEPTH = 3.2;
  let goalBox = null;
  let finish = null;
  if (shot && gmX !== null && gmY !== null) {
    const nearLeft = shot.x < 50;
    const gx0 = nearLeft ? -GOAL_DEPTH : 100;
    const gx1 = nearLeft ? 0 : 100 + GOAL_DEPTH;
    goalBox = { x: gx0 };
    finish = {
      x: nearLeft ? gx0 + (1 - gmY / 100) * (gx1 - gx0) : gx0 + (gmY / 100) * (gx1 - gx0),
      y: GOAL_LO + (gmX / 100) * (GOAL_HI - GOAL_LO)
    };
  }

  // Zoom: fit the sequence, always show the goal being attacked
  const xs = [];
  rows.forEach((r) => {
    const a = num(r.fromX);
    const b = num(r.toX);
    if (a !== null) xs.push(a);
    if (b !== null) xs.push(b);
  });
  let xMin = xs.length ? Math.max(-6, Math.min(...xs) - 25) : 0;
  let xMax = xs.length ? Math.min(106, Math.max(...xs) + 25) : 100;
  if (xMax - xMin < 65) {
    const c = (xMax + xMin) / 2;
    xMin = c - 32.5;
    xMax = c + 32.5;
  }
  if (shot) {
    if (shot.x < 50) xMin = Math.min(xMin, -6);
    else xMax = Math.max(xMax, 106);
  }
  const vbX = X(xMin);
  const vbW = X(xMax) - X(xMin);
  const vbY = Y(104);
  const vbH = Y(-4) - Y(104);

  const seqParts = steps.map((s) => `${s.seq} ${s.surname}`);
  if (goal) seqParts.push(`${num(goal.sequenceInBuildup)} ${surnameOf(goal.actionPlayerName)} (shot)`);

  let caption = "";
  if (goal) {
    const detail = [goal.bodyPart, goal.goalMouthLocation].filter(Boolean).join(", ");
    const xg = num(goal.xg);
    caption = `${goal.actionPlayerName}${detail ? " \u2014 " + detail : ""}${xg !== null ? ` (xG ${xg.toFixed(2)})` : ""}`;
  }

  if (!steps.length && !goal) {
    return <div style={{ padding: "24px", color: "#555" }}>No build-up data for this goal.</div>;
  }

  return (
    <div style={{ padding: "16px 24px", maxWidth: "1100px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ fontSize: "20px", color: "#2c2c2a", marginBottom: "10px", minHeight: "26px" }}>{caption}</div>

      <svg
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px", fontFamily: "system-ui, sans-serif" }}
        role="img"
        aria-label="Goal build-up sequence"
      >
        <defs>
          <marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill={BLUE} />
          </marker>
        </defs>

        {/* grass and stripes */}
        <rect x={vbX - 5} y={vbY - 5} width={vbW + 10} height={vbH + 10} fill="#3f8a2e" />
        {Array.from({ length: 14 }, (_, k) => k - 2)
          .filter((i) => i % 2 === 0)
          .map((i) => (
            <rect key={i} x={X(i * 10)} y={vbY - 5} width={X(10)} height={vbH + 10} fill="#448f33" />
          ))}

        {/* pitch markings */}
        <g fill="none" stroke="#fff" strokeWidth="0.28">
          <rect x="0" y="0" width="105" height="68" />
          <line x1="52.5" y1="0" x2="52.5" y2="68" />
          <circle cx="52.5" cy="34" r="9.15" />
          <circle cx="52.5" cy="34" r="0.3" fill="#fff" />
          {[0, 1].map((side) => {
            const mx = (v) => (side === 0 ? v : 105 - v);
            const cx = mx(12.075);
            const dx = 17.85 - 12.075;
            const dy = Math.sqrt(9.15 * 9.15 - dx * dx);
            const edge = side === 0 ? cx + dx : cx - dx;
            const sweep = side === 0 ? 1 : 0;
            return (
              <g key={side}>
                <path d={`M ${mx(0)} ${Y(78.9)} L ${mx(17.85)} ${Y(78.9)} L ${mx(17.85)} ${Y(21.1)} L ${mx(0)} ${Y(21.1)}`} />
                <path d={`M ${mx(0)} ${Y(63.2)} L ${mx(6.09)} ${Y(63.2)} L ${mx(6.09)} ${Y(36.8)} L ${mx(0)} ${Y(36.8)}`} />
                <path d={`M ${edge} ${34 - dy} A 9.15 9.15 0 0 ${sweep} ${edge} ${34 + dy}`} />
                <circle cx={cx} cy="34" r="0.3" fill="#fff" />
              </g>
            );
          })}
        </g>

        {/* goal mouth strip */}
        {goalBox && (
          <rect
            x={X(goalBox.x)}
            y={Y(GOAL_HI)}
            width={X(GOAL_DEPTH)}
            height={(GOAL_HI - GOAL_LO) * KY}
            fill="#f1efe8"
            stroke="#000"
            strokeWidth="0.25"
          />
        )}

        {/* passes: solid arrows, dashed for the assist */}
        {steps.map(
          (s) =>
            s.tx !== null &&
            s.ty !== null && (
              <line
                key={`a${s.seq}`}
                x1={X(s.fx)} y1={Y(s.fy)} x2={pull(X(s.fx), Y(s.fy), X(s.tx), Y(s.ty), 2.4)[0]} y2={pull(X(s.fx), Y(s.fy), X(s.tx), Y(s.ty), 2.4)[1]}
                stroke={BLUE}
                strokeWidth="0.55"
                strokeDasharray={s.assist ? "1.6 1.1" : undefined}
                markerEnd={`url(#${arrowId})`}
              />
            )
        )}

        {/* last pass to the shot, then the shot to the finish */}
        {shot && lastPoint && (
          <line
            x1={X(lastPoint[0])} y1={Y(lastPoint[1])} x2={X(shot.x)} y2={Y(shot.y)}
            stroke="#fff" strokeWidth="0.3" strokeDasharray="0.4 0.9" strokeLinecap="round" opacity="0.85"
          />
        )}
        {shot && finish && (
          <>
            <line x1={X(shot.x)} y1={Y(shot.y)} x2={X(finish.x)} y2={Y(finish.y)} stroke={ORANGE} strokeWidth="0.4" />
            <circle cx={X(finish.x)} cy={Y(finish.y)} r="1.4" fill={ORANGE} stroke="#fff" strokeWidth="0.3" />
            <text x={X(finish.x)} y={Y(GOAL_LO) + 4.5} textAnchor="middle" fontSize="2.4" fill="#fff" stroke="#1a3d12" strokeWidth="0.6" paintOrder="stroke" strokeLinejoin="round">Finish</text>
          </>
        )}

        {/* numbered nodes */}
        {steps.map((s) => (
          <g key={`n${s.seq}`}>
            <circle cx={X(s.fx)} cy={Y(s.fy)} r="2.2" fill={BLUE} stroke="#fff" strokeWidth="0.3" />
            <text x={X(s.fx)} y={Y(s.fy)} textAnchor="middle" dominantBaseline="central" fontSize="2.6" fontWeight="700" fill="#fff">
              {s.seq}
            </text>
            {s.first && (
              <text x={X(s.fx)} y={Y(s.fy) + 5.4} textAnchor="middle" fontSize="2.4" fill="#fff" stroke="#1a3d12" strokeWidth="0.6" paintOrder="stroke" strokeLinejoin="round">{s.surname}</text>
            )}
          </g>
        ))}

        {/* the shot */}
        {goal && shot && (
          <g>
            <circle cx={X(shot.x)} cy={Y(shot.y)} r="2.8" fill={ORANGE} stroke="#fff" strokeWidth="0.3" />
            <text x={X(shot.x)} y={Y(shot.y)} textAnchor="middle" dominantBaseline="central" fontSize="2.8" fontWeight="700" fill="#fff">
              {num(goal.sequenceInBuildup)}
            </text>
            <text x={X(shot.x)} y={Y(shot.y) + 6.2} textAnchor="middle" fontSize="2.4" fill="#fff" stroke="#1a3d12" strokeWidth="0.6" paintOrder="stroke" strokeLinejoin="round">
              {surnameOf(goal.actionPlayerName)}
            </text>
          </g>
        )}
      </svg>

      <div style={{ fontSize: "14px", color: "#52514e", marginTop: "10px" }}>{seqParts.join("  \u2192  ")}</div>
      {usingSample && (
        <div style={{ fontSize: "12px", color: "#b45309", marginTop: "8px" }}>
          Sample data - not a real goal.
        </div>
      )}
    </div>
  );
}
