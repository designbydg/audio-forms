import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { METRICS, MetricKey } from './TrendHeader';

interface TrendChartProps {
  data: any[];
  selectedMetric: MetricKey;
}

export function TrendChart({ data, selectedMetric }: TrendChartProps) {
  return (
    <div className="h-[300px]">
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={METRICS[selectedMetric].color} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={METRICS[selectedMetric].color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={METRICS[selectedMetric].color}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMetric)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No analytics data available
        </div>
      )}
    </div>
  );
}