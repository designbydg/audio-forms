import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { audioUrl } = await req.json();
    const apiKey = Deno.env.get('ASSEMBLYAI_API_KEY');

    console.log('Starting transcription process...');
    console.log('Audio URL provided:', !!audioUrl);
    console.log('API Key available:', !!apiKey);

    if (!apiKey) {
      throw new Error('AssemblyAI API key not configured. Please check Edge Function secrets.');
    }

    if (!audioUrl) {
      throw new Error('Audio URL is required');
    }

    // Create transcription request
    console.log('Making transcription request to AssemblyAI...');
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audioUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('AssemblyAI API error response:', errorData);
      throw new Error(`AssemblyAI API error: ${errorData}`);
    }

    const transcriptionRequest = await response.json();
    console.log('Transcription request created:', transcriptionRequest.id);

    // Poll for transcription result
    let transcriptionResult;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      console.log(`Polling attempt ${attempts + 1}/${maxAttempts}...`);
      
      const pollResponse = await fetch(
        `https://api.assemblyai.com/v2/transcript/${transcriptionRequest.id}`,
        {
          headers: {
            'Authorization': apiKey,
          },
        }
      );

      if (!pollResponse.ok) {
        const errorData = await pollResponse.text();
        console.error('Error polling transcription:', errorData);
        throw new Error(`Error polling transcription: ${errorData}`);
      }

      transcriptionResult = await pollResponse.json();
      console.log('Transcription status:', transcriptionResult.status);

      if (transcriptionResult.status === 'completed') {
        break;
      } else if (transcriptionResult.status === 'error') {
        throw new Error('Transcription failed: ' + transcriptionResult.error);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!transcriptionResult || transcriptionResult.status !== 'completed') {
      throw new Error('Transcription timed out or failed to complete');
    }

    console.log('Transcription completed successfully');
    return new Response(JSON.stringify(transcriptionResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in transcribe-audio function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});