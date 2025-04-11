
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Supabase client
const supabaseUrl = "https://uwsunqlxehadmqikkdhm.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
        <p><strong>Budget Range:</strong> ${record.budget}</p>
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
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
