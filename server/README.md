
# LynixDevs Express.js Server

This Express.js server replaces the Supabase edge functions for the LynixDevs application, providing email functionality, contact form handling, and admin operations.

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Fill in your configuration in the `.env` file:

#### Required Configuration:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)

#### Email Service Configuration (Choose one):

**Option 1: Brevo (Recommended)**
- Sign up at https://brevo.com
- Get your API key from the dashboard
- Set `BREVO_API_KEY` in your .env file

**Option 2: Gmail SMTP**
- Enable 2-factor authentication on your Gmail account
- Generate an app password: https://support.google.com/accounts/answer/185833
- Set `GMAIL_USER` and `GMAIL_APP_PASSWORD` in your .env file

**Option 3: SendGrid**
- Sign up at https://sendgrid.com
- Get your API key from the dashboard
- Set `SENDGRID_API_KEY` in your .env file

### 3. Update Frontend Configuration

Update your frontend to use the new server endpoints. Change the API calls from Supabase functions to your Express server:

**Contact Form:**
- From: `supabase.functions.invoke("contact-submit", ...)`
- To: `fetch("http://localhost:3001/api/contact/submit", ...)`

**Newsletter:**
- From: `supabase.functions.invoke("newsletter-subscribe", ...)`
- To: `fetch("http://localhost:3001/api/newsletter/subscribe", ...)`

**Email Sending:**
- From: `fetch("/api/functions/v1/send-email", ...)`
- To: `fetch("http://localhost:3001/api/email/send", ...)`

### 4. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### Health Check
- `GET /health` - Check if server is running

### Email
- `POST /api/email/send` - Send email

### Contact
- `POST /api/contact/submit` - Submit contact form

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter

### Admin (Requires Authentication)
- `GET /api/admin/users` - Get all users (admin only)

## Deployment

For production deployment, you can:

1. **Deploy to Heroku, Railway, or similar platforms**
2. **Use PM2 for process management**
3. **Set up a reverse proxy with Nginx**
4. **Configure environment variables on your hosting platform**

Make sure to:
- Set `NODE_ENV=production`
- Update `FRONTEND_URL` to your production frontend URL
- Use production email service credentials
- Enable HTTPS for security

## Troubleshooting

### Common Issues:

1. **Email not sending**: Check your email service credentials and configuration
2. **CORS errors**: Ensure `FRONTEND_URL` is set correctly
3. **Database errors**: Verify Supabase credentials and connection
4. **Authentication issues**: Check Supabase service role key permissions

### Logs:
The server logs all operations to the console. Check the logs for detailed error information.
