
interface WelcomeEmailTemplateProps {
  userName: string;
  userEmail: string;
}

export const generateWelcomeEmailHTML = ({ userName, userEmail }: WelcomeEmailTemplateProps) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to LynixDevs</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 20px;
        }
        
        .text {
            font-size: 16px;
            line-height: 1.6;
            color: #4a5568;
            margin-bottom: 20px;
        }
        
        .features {
            background: #f7fafc;
            border-radius: 12px;
            padding: 24px;
            margin: 30px 0;
        }
        
        .features h3 {
            font-size: 18px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 16px;
        }
        
        .feature-list {
            list-style: none;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            font-size: 14px;
            color: #4a5568;
        }
        
        .feature-icon {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            margin-right: 12px;
            flex-shrink: 0;
            position: relative;
        }
        
        .feature-icon::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 10px;
            font-weight: bold;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .footer {
            background: #f7fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer p {
            font-size: 14px;
            color: #718096;
            margin-bottom: 8px;
        }
        
        .social-links {
            margin-top: 20px;
        }
        
        .social-link {
            display: inline-block;
            margin: 0 8px;
            padding: 8px;
            background: #e2e8f0;
            border-radius: 50%;
            text-decoration: none;
            color: #4a5568;
            width: 36px;
            height: 36px;
            text-align: center;
            line-height: 20px;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">L</div>
            <h1>Welcome to LynixDevs!</h1>
            <p>Your journey to exceptional development starts here</p>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${userName || 'there'}! 👋</div>
            
            <p class="text">
                Thank you for joining LynixDevs! We're thrilled to have you as part of our community of developers and innovators.
            </p>
            
            <p class="text">
                Your account has been successfully created with the email: <strong>${userEmail}</strong>
            </p>
            
            <div class="features">
                <h3>What you can do with LynixDevs:</h3>
                <ul class="feature-list">
                    <li class="feature-item">
                        <div class="feature-icon"></div>
                        Access your personalized dashboard
                    </li>
                    <li class="feature-item">
                        <div class="feature-icon"></div>
                        Track your project progress in real-time
                    </li>
                    <li class="feature-item">
                        <div class="feature-icon"></div>
                        Connect with our expert development team
                    </li>
                    <li class="feature-item">
                        <div class="feature-icon"></div>
                        Get access to exclusive resources and updates
                    </li>
                </ul>
            </div>
            
            <p class="text">
                Ready to explore? Click the button below to access your dashboard and start your journey with us.
            </p>
            
            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'https://lynixdevs.com'}/dashboard" class="cta-button">
                    Go to Dashboard
                </a>
            </div>
            
            <p class="text">
                If you have any questions or need assistance, our support team is always here to help. Simply reply to this email or visit our contact page.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>LynixDevs Team</strong></p>
            <p>Building exceptional digital experiences</p>
            
            <div class="social-links">
                <a href="#" class="social-link">f</a>
                <a href="#" class="social-link">t</a>
                <a href="#" class="social-link">in</a>
                <a href="#" class="social-link">@</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px;">
                This email was sent to ${userEmail}. If you didn't sign up for LynixDevs, please ignore this email.
            </p>
        </div>
    </div>
</body>
</html>
  `;
};
