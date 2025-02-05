import { CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type MetricKey = 'views' | 'starts' | 'submissions';
export type TimePeriod = 'weekly' | 'monthly' | 'yearly';

export const METRICS = {
  views: { label: 'Views', color: '#0ea5e9' },
  starts: { label: 'Starts', color: '#22c55e' },
  submissions: { label: 'Submissions', color: '#f97316' },
} as const;

interface TrendHeaderProps {
  selectedMetric: MetricKey;
  setSelectedMetric: (value: MetricKey) => void;
  timePeriod: TimePeriod;
  setTimePeriod: (value: TimePeriod) => void;
}

export function TrendHeader({ 
  selectedMetric, 
  setSelectedMetric, 
  timePeriod, 
  setTimePeriod 
}: TrendHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1.5">
        <CardTitle className="text-lg font-semibold text-gray-900">Trends Analysis</CardTitle>
        <p className="text-sm text-gray-500">Survey performance over time</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-1.5 mt-6 sm:mt-0">
        <Select
          value={selectedMetric}
          onValueChange={(value: MetricKey) => setSelectedMetric(value)}
        >
          <SelectTrigger className="w-full sm:w-[100px] h-8 text-sm">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(METRICS).map(([key, { label }]) => (
              <SelectItem key={key} value={key as MetricKey}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={timePeriod} 
          onValueChange={(value: TimePeriod) => setTimePeriod(value)}
        >
          <SelectTrigger className="w-full sm:w-[100px] h-8 text-sm">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}