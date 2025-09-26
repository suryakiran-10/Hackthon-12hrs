const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface EmailRequest {
  email: string;
  jobTitle: string;
  company: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email, jobTitle, company }: EmailRequest = await req.json();

    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - Resend
    // - AWS SES
    // - Mailgun
    
    // For now, we'll simulate sending an email
    console.log(`Sending confirmation email to ${email} for ${jobTitle} at ${company}`);
    
    // Simulate email content
    const emailContent = {
      to: email,
      subject: `Application Confirmation - ${jobTitle} at ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3B82F6;">Application Confirmed!</h1>
          <p>Dear Candidate,</p>
          <p>Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${company}</strong>.</p>
          <p>We have received your application and our team will review it shortly. You will receive further notifications regarding your interview and opportunities.</p>
          <div style="background: #F3F4F6; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">Next Steps:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Our HR team will review your application within 3-5 business days</li>
              <li>If selected, you'll receive an interview invitation</li>
              <li>You can schedule your AI-powered interview at your convenience</li>
            </ul>
          </div>
          <p>Best of luck with your application!</p>
          <p style="color: #6B7280;">
            Best regards,<br>
            The JobPortal Team
          </p>
        </div>
      `
    };

    // Here you would actually send the email using your preferred service
    // Example with a hypothetical email service:
    // await emailService.send(emailContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Confirmation email sent successfully",
        emailPreview: emailContent // Remove this in production
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to send confirmation email" 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});