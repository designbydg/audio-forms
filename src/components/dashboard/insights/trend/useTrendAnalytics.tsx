import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, subMonths, subYears, addDays, addMonths, addYears, startOfDay, endOfDay, parseISO } from 'date-fns';
import { TimePeriod } from "./TrendHeader";

export function useTrendAnalytics(surveyId: string, timePeriod: TimePeriod) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('survey_analytics_events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'survey_analytics_events',
          filter: `survey_id=eq.${surveyId}`
        },
        () => {
          void queryClient.invalidateQueries({
            queryKey: ['survey-analytics-trend', surveyId, timePeriod]
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [surveyId, timePeriod, queryClient]);

  return useQuery({
    queryKey: ['survey-analytics-trend', surveyId, timePeriod],
    queryFn: async () => {
      const endDate = new Date();
      let startDate: Date;
      let dateFormat: string;

      switch (timePeriod) {
        case 'monthly':
          startDate = subMonths(endDate, 11);
          dateFormat = 'MMM yyyy';
          break;
        case 'yearly':
          startDate = subYears(endDate, 4);
          dateFormat = 'yyyy';
          break;
        default:
          startDate = subDays(endDate, 6);
          dateFormat = 'MMM dd';
      }

      const { data: events, error } = await supabase
        .from('survey_analytics_events')
        .select('*')
        .eq('survey_id', surveyId)
        .gte('created_at', startOfDay(startDate).toISOString())
        .lte('created_at', endOfDay(endDate).toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('Raw analytics events:', events);

      const dateMetricsMap = new Map();

      let currentDate = startDate;
      while (currentDate <= endDate) {
        const dateKey = format(currentDate, dateFormat);
        dateMetricsMap.set(dateKey, {
          date: dateKey,
          views: 0,
          starts: 0,
          submissions: 0
        });
        
        currentDate = timePeriod === 'weekly' 
          ? addDays(currentDate, 1)
          : timePeriod === 'monthly'
          ? addMonths(currentDate, 1)
          : addYears(currentDate, 1);
      }

      if (events) {
        events.forEach(event => {
          const eventDate = parseISO(event.created_at);
          const dateKey = format(eventDate, dateFormat);
          
          if (dateMetricsMap.has(dateKey)) {
            const currentMetrics = dateMetricsMap.get(dateKey);
            
            switch (event.event_type) {
              case 'view':
                currentMetrics.views += 1;
                break;
              case 'start':
                currentMetrics.starts += 1;
                break;
              case 'submission':
                currentMetrics.submissions += 1;
                break;
            }
            
            dateMetricsMap.set(dateKey, currentMetrics);
          }
        });
      }

      return Array.from(dateMetricsMap.values());
    },
    enabled: !!surveyId,
    refetchInterval: 5000,
  });
}