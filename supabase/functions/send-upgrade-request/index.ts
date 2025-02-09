import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ENCODED_EMAIL = "aGVsbG9AZ2V0YXVkaW9mb3Jtcy5jb20="; // Base64 encoded email

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function decodeEmail(encoded: string): string {
  return atob(encoded);
}

function isValidRequest(req: Request): boolean {
  const userAgent = req.headers.get('user-agent');
  if (!userAgent || userAgent.toLowerCase().includes('bot')) {
    return false;
  }
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders 
    });
  }

  try {
    // Validate the request
    if (!isValidRequest(req)) {
      console.error('Invalid request detected');
      return new Response(
        JSON.stringify({ error: 'Invalid request' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get user data from the JWT
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(jwt);
    
    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Authentication error');
    }

    const recipientEmail = decodeEmail(ENCODED_EMAIL);

    // Prepare email content
    const emailBody = `
      New Upgrade Request
      
      User Email: ${user?.email || 'Not provided'}
      User ID: ${user?.id || 'Not provided'}
      Timestamp: ${new Date().toISOString()}
    `;

    console.log('Processing upgrade request:', {
      userEmail: user?.email,
      timestamp: new Date().toISOString()
    });

    // Here you would typically integrate with your email service
    // For now, we'll just log the request and return success
    console.log('Would send email to:', recipientEmail);
    console.log('Email content:', emailBody);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Upgrade request received'
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error processing upgrade request:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: Deno.env.get('DENO_ENV') === 'development' ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});