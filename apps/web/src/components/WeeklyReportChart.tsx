'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  useXAxisScale,
  useYAxisScale,
} from 'recharts';

const WEEKLY_DATA = [
  { day: 'Sun', value: 16 },
  { day: 'Mon', value: 27 },
  { day: 'Tue', value: 27 },
  { day: 'Wed', value: 14 },
  { day: 'Thu', value: 35 },
  { day: 'Fri', value: 35 },
  { day: 'Sat', value: 30 },
];

const PRIMARY = '#4ea674';
const CORNER_RADIUS = 10;

function Callout({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx == null || cy == null) return null;
  return (
    <g>
      <line x1={cx} y1={cy} x2={cx} y2={cy + 55} stroke={PRIMARY} strokeWidth={1} strokeDasharray="3 3" />
      <circle cx={cx} cy={cy} r={5} fill="white" stroke={PRIMARY} strokeWidth={2} />
      <foreignObject x={cx - 44} y={cy - 58} width={88} height={44}>
        <div
          style={{
            background: '#eaf8e7',
            border: `1px solid ${PRIMARY}`,
            borderRadius: 8,
            padding: '4px 8px',
            fontSize: 11,
            fontWeight: 600,
            color: '#023337',
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          Thursday
          <br />
          14k
        </div>
      </foreignObject>
    </g>
  );
}

// Builds a path that connects points with straight segments, but rounds each
// interior corner to `radius` px instead of meeting at a sharp point.
function roundedPath(points: { x: number; y: number }[], radius: number) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y} `;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const distPrev = Math.hypot(curr.x - prev.x, curr.y - prev.y);
    const distNext = Math.hypot(next.x - curr.x, next.y - curr.y);
    const r = Math.min(radius, distPrev / 2, distNext / 2);

    const startX = curr.x - ((curr.x - prev.x) / distPrev) * r;
    const startY = curr.y - ((curr.y - prev.y) / distPrev) * r;
    const endX = curr.x + ((next.x - curr.x) / distNext) * r;
    const endY = curr.y + ((next.y - curr.y) / distNext) * r;

    d += `L ${startX} ${startY} Q ${curr.x} ${curr.y} ${endX} ${endY} `;
  }

  const last = points[points.length - 1];
  d += `L ${last.x} ${last.y}`;
  return d;
}

function RoundedLine() {
  const xScale = useXAxisScale();
  const yScale = useYAxisScale();
  if (!xScale || !yScale) return null;

  const points = WEEKLY_DATA.map((d) => ({ x: xScale(d.day), y: yScale(d.value) })).filter(
    (p): p is { x: number; y: number } => p.x != null && p.y != null,
  );
  if (points.length < 2) return null;

  return <path d={roundedPath(points, CORNER_RADIUS)} fill="none" stroke={PRIMARY} strokeWidth={2} strokeLinecap="round" />;
}

export function WeeklyReportChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={WEEKLY_DATA} margin={{ top: 50, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="reportFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.3} />
            <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb' }}
          padding={{ left: 3, right: 3 }}
          tick={(props) => {
            const { x, y, payload } = props;
            const isActive = payload.value === 'Wed';
            return (
              <text
                x={x}
                y={y + 12}
                textAnchor="middle"
                fontSize={12}
                fontWeight={isActive ? 700 : 400}
                fill={isActive ? '#111827' : '#9ca3af'}
              >
                {payload.value}
              </text>
            );
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}k`}
          domain={[0, 58.5]}
          ticks={[0, 10, 20, 30, 40, 50]}
          tick={{ fontSize: 12, fill: '#9ca3af' }}
          width={36}
        />
        <Area type="linear" dataKey="value" stroke="none" fill="url(#reportFill)" />
        <RoundedLine />
        <ReferenceLine x="Sun" stroke="#e5e7eb" />
        <ReferenceLine x="Sat" stroke="#e5e7eb" />
        <ReferenceDot x="Wed" y={14} r={0} shape={Callout} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
