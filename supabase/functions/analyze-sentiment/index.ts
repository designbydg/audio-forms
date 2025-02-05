import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { surveyId } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all text responses for the survey
    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select('response_data')
      .eq('survey_id', surveyId);

    if (responsesError) throw responsesError;

    // Extract all text responses
    const textResponses = responses.flatMap(response => {
      const data = response.response_data as Record<string, any>;
      return Object.values(data).filter(value => 
        typeof value === 'string' && 
        !value.startsWith('data:audio') // Exclude audio responses
      );
    });

    // Simple sentiment analysis function
    const analyzeSentiment = (text: string) => {
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'happy', 'satisfied', 'love', 'best'];
      const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'horrible', 'disappointed', 'hate', 'worst', 'unhappy', 'dissatisfied'];

      const words = text.toLowerCase().split(/\W+/);
      let positiveCount = 0;
      let negativeCount = 0;

      words.forEach(word => {
        if (positiveWords.includes(word)) positiveCount++;
        if (negativeWords.includes(word)) negativeCount++;
      });

      const total = positiveCount + negativeCount;
      if (total === 0) return 'neutral';
      const score = (positiveCount - negativeCount) / total;

      if (score > 0.3) return 'positive';
      if (score < -0.3) return 'negative';
      return 'neutral';
    };

    // Analyze all responses
    const sentiments = textResponses.map(analyzeSentiment);
    
    // Calculate sentiment distribution
    const distribution = sentiments.reduce((acc, sentiment) => {
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = sentiments.length;
    const analysis = {
      positive: Math.round((distribution.positive || 0) / total * 100),
      negative: Math.round((distribution.negative || 0) / total * 100),
      neutral: Math.round((distribution.neutral || 0) / total * 100),
    };

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-sentiment function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});