
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Resend API key from environment variables
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable is not set");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing Resend API key in environment variables" 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Initialize Resend with API key
    const resend = new Resend(resendApiKey);

    const { record, table } = await req.json();
    console.log(`Received ${table} submission:`, record);

    let subject = "";
    let htmlContent = "";

    // Format email differently based on form type
    if (table === "enquiries") {
      subject = `New Enquiry from ${record.name}`;
      htmlContent = `
        <h1>New Enquiry Submitted</h1>
        <p><strong>Name:</strong> ${record.name}</p>
        <p><strong>Email:</strong> ${record.email}</p>
        <p><strong>Phone:</strong> ${record.phone}</p>
        <p><strong>Service Required:</strong> ${record.service}</p>
        <p><strong>Budget Range:</strong> ${record.budget || "Not specified"}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `;
    } else if (table === "bookings") {
      subject = `New Booking from ${record.name}`;
      htmlContent = `
        <h1>New Booking Submitted</h1>
        <p><strong>Name:</strong> ${record.name}</p>
        <p><strong>Email:</strong> ${record.email || "Not provided"}</p>
        <p><strong>Phone:</strong> ${record.phone}</p>
        <p><strong>Date:</strong> ${record.date}</p>
        <p><strong>Time:</strong> ${record.time}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `;
    } else {
      throw new Error("Unknown form type");
    }

    console.log("Attempting to send email with subject:", subject);
    
    // Send email notification
    const emailResult = await resend.emails.send({
      from: "ARW Construction <notifications@arwconstruction.au>",
      to: ["josh@arwc.com.au"],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email notification sent:", emailResult);

    return new Response(
      JSON.stringify({ success: true, message: "Email notification sent" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-form-notification function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        stack: error.stack 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
