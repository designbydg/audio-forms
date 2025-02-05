import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { surveyId } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all text responses and transcriptions for the survey
    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select(`
        response_data,
        transcriptions (
          transcription
        )
      `)
      .eq('survey_id', surveyId);

    if (responsesError) throw responsesError;

    // Extract all text responses and transcriptions
    const allText: string[] = [];

    // Add response data text
    responses?.forEach(response => {
      const data = response.response_data as Record<string, any>;
      Object.values(data).forEach(value => {
        if (typeof value === 'string' && !value.startsWith('data:audio')) {
          allText.push(value);
        }
      });
    });

    // Add transcriptions
    responses?.forEach(response => {
      if (response.transcriptions && Array.isArray(response.transcriptions)) {
        response.transcriptions.forEach((trans: any) => {
          if (trans.transcription) {
            allText.push(trans.transcription);
          }
        });
      }
    });

    // Simple keyword extraction function
    const extractKeywords = (text: string) => {
      // Remove common stop words and split into words
      const stopWords = new Set([
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 
        'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
        'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 
        'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there',
        'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get',
        'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no',
        'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your',
        'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
        'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
        'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first',
        'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
        'give', 'day', 'most', 'us', 'is', 'was', 'are', 'were', 'been',
        'has', 'had', 'very', 'much', 'many', 'such', 'those', 'yeah',
        'maybe', 'kind', 'lot', 'really', 'thing', 'things', 'bit'
      ]);

      return text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => !stopWords.has(word) && word.length > 2);
    };

    // Analyze all text
    const allKeywords = allText.flatMap(extractKeywords);
    
    // Count keyword frequencies
    const keywordFrequency = allKeywords.reduce((acc, keyword) => {
      acc[keyword] = (acc[keyword] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort keywords by frequency
    const sortedKeywords = Object.entries(keywordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10) // Get top 10 keywords
      .map(([keyword, count]) => ({ keyword, count }));

    return new Response(JSON.stringify(sortedKeywords), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-keywords function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});