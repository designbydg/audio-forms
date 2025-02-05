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
    console.log('Analyzing all response types for survey:', surveyId);

    // Initialize Supabase client with auth context from the request
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
      }
    );

    // First, fetch questions to understand their types
    const { data: questions, error: questionsError } = await supabaseClient
      .from('questions')
      .select('id, question_type, options')
      .eq('survey_id', surveyId);

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      throw questionsError;
    }

    // Fetch all responses for the survey
    const { data: responses, error: responsesError } = await supabaseClient
      .from('responses')
      .select(`
        response_data,
        transcriptions (
          transcription
        )
      `)
      .eq('survey_id', surveyId);

    if (responsesError) {
      console.error('Error fetching responses:', responsesError);
      throw responsesError;
    }

    console.log('Found responses:', responses?.length);

    if (!responses || responses.length === 0) {
      console.log('No responses found for survey:', surveyId);
      return new Response(
        JSON.stringify({
          positive: 0,
          negative: 0,
          neutral: 0
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Extract all text responses and numerical ratings
    const textResponses: string[] = [];
    const numericalRatings: number[] = [];
    
    responses.forEach(response => {
      if (response.response_data) {
        Object.entries(response.response_data).forEach(([questionId, value]) => {
          const question = questions.find(q => q.id === questionId);
          
          if (!question) return;

          // Handle different question types
          switch (question.question_type) {
            case 'nps':
              if (typeof value === 'string' && !isNaN(Number(value))) {
                const score = parseInt(value);
                if (score >= 0 && score <= 10) {
                  numericalRatings.push(score / 10); // Normalize to 0-1 range
                }
              }
              break;

            case 'rating':
              if (typeof value === 'string' && !isNaN(Number(value))) {
                const maxRating = question.options?.[0] ? JSON.parse(question.options[0]).max : 5;
                const score = parseInt(value);
                if (score >= 1 && score <= maxRating) {
                  numericalRatings.push(score / maxRating); // Normalize to 0-1 range
                }
              }
              break;

            case 'linear_scale':
              if (typeof value === 'string' && !isNaN(Number(value))) {
                const options = question.options?.[0] ? JSON.parse(question.options[0]) : { min: 1, max: 5 };
                const score = parseInt(value);
                const range = options.max - options.min;
                if (score >= options.min && score <= options.max) {
                  numericalRatings.push((score - options.min) / range); // Normalize to 0-1 range
                }
              }
              break;

            case 'short_answer':
            case 'paragraph':
              if (typeof value === 'string' && value.trim() !== '') {
                textResponses.push(value.trim());
              }
              break;
          }
        });
      }
      
      // Add transcriptions if they exist
      if (response.transcriptions?.length > 0) {
        response.transcriptions.forEach(t => {
          if (t.transcription) {
            textResponses.push(t.transcription.trim());
          }
        });
      }
    });

    console.log('Extracted text responses:', textResponses.length);
    console.log('Extracted numerical ratings:', numericalRatings.length);

    // Simple sentiment analysis function for text
    const analyzeSentiment = (text: string) => {
      const positiveWords = [
        'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 
        'happy', 'satisfied', 'love', 'best', 'helpful', 'positive', 'awesome',
        'perfect', 'outstanding', 'exceptional', 'brilliant', 'superb', 'enjoy',
        'enjoyed', 'clear', 'clearly', 'easy', 'useful', 'thank', 'thanks'
      ];
      const negativeWords = [
        'bad', 'poor', 'terrible', 'awful', 'horrible', 'disappointed', 
        'hate', 'worst', 'unhappy', 'dissatisfied', 'difficult', 'hard',
        'confusing', 'confused', 'unclear', 'not helpful', 'negative',
        'frustrating', 'frustrated', 'annoying', 'annoyed', 'issue', 'problem'
      ];

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

    // Analyze text responses
    const textSentiments = textResponses.map(analyzeSentiment);
    
    // Analyze numerical ratings
    const ratingSentiments = numericalRatings.map(score => {
      if (score >= 0.8) return 'positive';      // Top 20% of the scale
      if (score <= 0.4) return 'negative';      // Bottom 40% of the scale
      return 'neutral';                         // Middle range
    });

    // Combine all sentiments
    const allSentiments = [...textSentiments, ...ratingSentiments];
    
    // Calculate final distribution
    const distribution = allSentiments.reduce((acc, sentiment) => {
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = allSentiments.length;
    const analysis = {
      positive: Math.round((distribution.positive || 0) / total * 100),
      negative: Math.round((distribution.negative || 0) / total * 100),
      neutral: Math.round((distribution.neutral || 0) / total * 100),
    };

    console.log('Final analysis:', analysis);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-text function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        positive: 0,
        negative: 0,
        neutral: 0
      }), {
      status: 200, // Return 200 even on error, with default values
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});