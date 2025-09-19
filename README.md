# Mental Wellness Assessment Tool

A comprehensive mental wellness assessment application with Google OAuth integration and automated email functionality.

## Features

- **Mental Wellness Assessment**: Comprehensive 5-step assessment covering academic stress, family dynamics, social relationships, physical/emotional health, and cultural/societal factors
- **Google OAuth Integration**: Secure login with Google accounts
- **Automated Welcome Emails**: Sends personalized welcome emails after Google account selection
- **Personalized Recommendations**: AI-powered recommendations based on assessment results
- **Progress Tracking**: Track mental wellness progress over time
- **PDF Report Generation**: Download detailed assessment reports
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Gmail account for sending emails

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Email Settings

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Copy the 16-character password

3. **Set Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### 3. Start the Email Service

```bash
# Start the backend email service
npm start
```

The email service will run on `http://localhost:3001`

### 4. Start the Frontend

```bash
# Start the frontend application
npm run serve
```

The application will be available at `http://localhost:3000`

## Usage

### For Users

1. **Access the Application**: Open `http://localhost:3000` in your browser
2. **Login with Google**:
   - Click "Continue with Google"
   - Select your Google account
   - A welcome email will be automatically sent to your Gmail account
   - You'll be redirected to the assessment
3. **Take Assessment**: Complete the 5-step mental wellness assessment
4. **View Results**: Get personalized recommendations and wellness tips
5. **Download Report**: Save your assessment results as a PDF

### For Developers

#### Project Structure

```
mood-assessment-tool/
├── server.js              # Backend email service
├── package.json           # Dependencies and scripts
├── index.html            # Main application
├── login_new.html        # Login page with Google OAuth
├── style.css             # Application styles
├── app.js                # Frontend logic
├── register.html         # Registration page
└── README.md            # This file
```

#### API Endpoints

- `POST /api/send-welcome-email`: Send welcome email to user
- `GET /api/health`: Health check for email service

#### Email Template

The welcome email includes:
- Personalized greeting
- Assessment overview
- Next steps guidance
- Support resources
- Professional disclaimer

## Google OAuth Setup

The application uses Google's OAuth 2.0 for authentication. The client ID is already configured in the code. For production use:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins and redirect URIs
6. Replace the client ID in `login_new.html`

## Security Considerations

- **Email Credentials**: Never commit email credentials to version control
- **Environment Variables**: Use `.env` files for sensitive configuration
- **HTTPS**: Use HTTPS in production for OAuth security
- **CORS**: Configure CORS properly for your domain in production

## Troubleshooting

### Email Not Sending

1. Check that the email service is running (`http://localhost:3001/api/health`)
2. Verify email credentials in `.env` file
3. Check Gmail account settings for app passwords
4. Review server console for error messages

### Google Login Issues

1. Verify the client ID is correct
2. Check authorized origins in Google Cloud Console
3. Ensure HTTPS is used in production
4. Check browser console for JavaScript errors

### Assessment Not Loading

1. Ensure all files are in the correct directory
2. Check browser console for JavaScript errors
3. Verify localStorage is enabled in browser
4. Clear browser cache and try again

## Support

For technical support or questions:
- Check the browser console for error messages
- Verify all dependencies are installed
- Ensure ports 3000 and 3001 are available
- Check email service logs for issues

## License

This project is licensed under the MIT License.
