'use client';

import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

const WEEKLY_DATA = [
  { day: 'Sun', value: 18 },
  { day: 'Mon', value: 24 },
  { day: 'Tue', value: 20 },
  { day: 'Wed', value: 32 },
  { day: 'Thu', value: 22 },
  { day: 'Fri', value: 28 },
  { day: 'Sat', value: 26 },
];

export function WeeklyReportChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="reportFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#059669" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
        <Tooltip
          contentStyle={{ borderRadius: 8, borderColor: '#e5e7eb', fontSize: 12 }}
          formatter={(value) => [`${value}k`, 'Revenue']}
        />
        <Area type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} fill="url(#reportFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
