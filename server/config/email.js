
const nodemailer = require('nodemailer');

// Email service configuration
const createEmailTransporter = () => {
  // Check for Brevo configuration first (recommended)
  if (process.env.BREVO_API_KEY) {
    return {
      type: 'brevo',
      apiKey: process.env.BREVO_API_KEY
    };
  }

  // Gmail SMTP configuration
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  // SendGrid configuration
  if (process.env.SENDGRID_API_KEY) {
    return {
      type: 'sendgrid',
      apiKey: process.env.SENDGRID_API_KEY
    };
  }

  throw new Error('No email service configured. Please set up Brevo, Gmail, or SendGrid credentials.');
};

const getDefaultEmailSender = async () => {
  try {
    // This would need to be implemented to fetch from your database
    // For now, return a default
    return {
      email: "noreply@lynixdevs.us",
      name: "LynixDevs"
    };
  } catch (error) {
    console.error('Error fetching default sender:', error);
    return {
      email: "noreply@lynixdevs.us",
      name: "LynixDevs"
    };
  }
};

const sendEmail = async (emailData) => {
  const { to, subject, html, replyTo, name, senderEmail, senderName } = emailData;

  try {
    const transporter = createEmailTransporter();
    
    // Get sender info - use provided or fetch default
    let fromEmail = senderEmail;
    let fromName = senderName;
    
    if (!fromEmail || !fromName) {
      const defaultSender = await getDefaultEmailSender();
      fromEmail = fromEmail || defaultSender.email;
      fromName = fromName || defaultSender.name;
    }

    // Handle Brevo API
    if (transporter.type === 'brevo') {
      const brevoPayload = {
        sender: {
          name: fromName,
          email: fromEmail,
        },
        to: [{ email: to, name: name || to }],
        subject: subject,
        htmlContent: html,
      };

      if (replyTo) {
        brevoPayload.replyTo = {
          email: replyTo,
          name: name || replyTo,
        };
      }

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": transporter.apiKey,
        },
        body: JSON.stringify(brevoPayload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Brevo API error: ${response.status} ${errorData}`);
      }

      return await response.json();
    }

    // Handle SendGrid
    if (transporter.type === 'sendgrid') {
      const sgPayload = {
        personalizations: [{
          to: [{ email: to, name: name || to }],
          subject: subject
        }],
        from: {
          email: fromEmail,
          name: fromName
        },
        content: [{
          type: "text/html",
          value: html
        }]
      };

      if (replyTo) {
        sgPayload.reply_to = {
          email: replyTo,
          name: name || replyTo
        };
      }

      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${transporter.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sgPayload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`SendGrid API error: ${response.status} ${errorData}`);
      }

      return { success: true };
    }

    // Handle Gmail/SMTP - Force the from address
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: to,
      subject: subject,
      html: html,
      // For Gmail, we need to set these additional headers to try to override the from
      headers: {
        'From': `"${fromName}" <${fromEmail}>`,
        'Reply-To': replyTo || fromEmail,
        'Return-Path': fromEmail
      }
    };

    if (replyTo) {
      mailOptions.replyTo = replyTo;
    }

    console.log('Sending email with mailOptions:', JSON.stringify(mailOptions, null, 2));

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent result:', result);
    return result;

  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  getDefaultEmailSender
};
