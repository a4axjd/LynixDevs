
interface ProjectUpdateTemplateProps {
  userName: string;
  projectName: string;
  updateTitle: string;
  updateDescription: string;
  progressPercentage: number;
  userEmail: string;
  projectDashboardLink: string;
}

export const generateProjectUpdateHTML = ({ 
  userName, 
  projectName, 
  updateTitle, 
  updateDescription, 
  progressPercentage, 
  userEmail,
  projectDashboardLink 
}: ProjectUpdateTemplateProps) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Update - ${projectName}</title>
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
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
        
        .project-info {
            background: #f7fafc;
            border-radius: 12px;
            padding: 24px;
            margin: 25px 0;
        }
        
        .project-name {
            font-size: 18px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 16px;
        }
        
        .update-title {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 12px;
        }
        
        .update-description {
            font-size: 14px;
            color: #4a5568;
            line-height: 1.5;
            margin-bottom: 20px;
        }
        
        .progress-section {
            margin-top: 20px;
        }
        
        .progress-label {
            font-size: 14px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
        }
        
        .progress-bar {
            width: 100%;
            height: 12px;
            background: #e2e8f0;
            border-radius: 6px;
            overflow: hidden;
            margin-bottom: 8px;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 6px;
            width: ${progressPercentage}%;
            transition: width 0.3s ease;
        }
        
        .progress-text {
            font-size: 12px;
            color: #718096;
            text-align: right;
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
            <div class="logo">📈</div>
            <h1>Project Update</h1>
            <p>Your project is making progress!</p>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${userName || 'there'}!</div>
            
            <p class="text">
                We have an exciting update on your project with LynixDevs. Here's what's been happening:
            </p>
            
            <div class="project-info">
                <div class="project-name">📁 ${projectName}</div>
                
                <div class="update-title">${updateTitle}</div>
                <div class="update-description">${updateDescription}</div>
                
                <div class="progress-section">
                    <div class="progress-label">Project Progress</div>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="progress-text">${progressPercentage}% Complete</div>
                </div>
            </div>
            
            <p class="text">
                Want to see more details about your project? Visit your project dashboard to view files, timelines, and communicate with our team.
            </p>
            
            <div style="text-align: center;">
                <a href="${projectDashboardLink}" class="cta-button">
                    View Project Dashboard
                </a>
            </div>
            
            <p class="text">
                Thank you for choosing LynixDevs for your development needs. We're committed to delivering exceptional results and keeping you informed every step of the way.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>LynixDevs Project Team</strong></p>
            <p>Bringing your vision to life</p>
            
            <p style="margin-top: 20px; font-size: 12px;">
                This email was sent to ${userEmail} regarding your project "${projectName}".
            </p>
        </div>
    </div>
</body>
</html>
  `;
};
