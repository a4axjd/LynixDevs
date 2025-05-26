
interface PasswordResetTemplateProps {
  userName: string;
  resetLink: string;
  userEmail: string;
}

export const generatePasswordResetHTML = ({ userName, resetLink, userEmail }: PasswordResetTemplateProps) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - LynixDevs</title>
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
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
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
            font-size: 24px;
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
        
        .warning-box {
            background: #fef5e7;
            border: 1px solid #f6ad55;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .warning-box h3 {
            color: #c05621;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .warning-box p {
            color: #c05621;
            font-size: 14px;
            margin: 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
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
            <div class="logo">🔒</div>
            <h1>Password Reset Request</h1>
            <p>Secure your LynixDevs account</p>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${userName || 'there'}!</div>
            
            <p class="text">
                We received a request to reset the password for your LynixDevs account associated with ${userEmail}.
            </p>
            
            <p class="text">
                If you made this request, click the button below to reset your password. This link will expire in 24 hours for your security.
            </p>
            
            <div style="text-align: center;">
                <a href="${resetLink}" class="cta-button">
                    Reset My Password
                </a>
            </div>
            
            <div class="warning-box">
                <h3>⚠️ Security Notice</h3>
                <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged, and your account is still secure.</p>
            </div>
            
            <p class="text">
                For security reasons, this link will expire in 24 hours. If you need to reset your password after this time, please request a new reset link.
            </p>
            
            <p class="text">
                If you're having trouble clicking the button, copy and paste the following link into your browser:
            </p>
            
            <p style="word-break: break-all; background: #f7fafc; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px; color: #4a5568;">
                ${resetLink}
            </p>
        </div>
        
        <div class="footer">
            <p><strong>LynixDevs Security Team</strong></p>
            <p>Keeping your account safe and secure</p>
            
            <p style="margin-top: 20px; font-size: 12px;">
                This is an automated security email from LynixDevs. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
  `;
};
