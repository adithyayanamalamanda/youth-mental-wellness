const express = require('express');

const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Replace with your MySQL root password
    database: 'mood_assessment',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com', // Replace with your email
        pass: process.env.EMAIL_PASS || 'your-app-password'    // Replace with your app password
    }
});

// Verify email configuration
transporter.verify((error, success) => {
    if (error) {
        console.log('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// API endpoint to send OTP
app.post('/api/send-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const otp = generateOTP();
        const timestamp = new Date();

        // Store OTP in database
        await pool.query(
            'INSERT INTO otp_verification (email, otp, timestamp) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = VALUES(otp), timestamp = VALUES(timestamp)',
            [email, otp, timestamp]
        );

        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: 'Your OTP for Mental Wellness Assessment Registration',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #4F46E5; text-align: center;">Email Verification</h1>

                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; margin: 20px 0; color: white; text-align: center;">
                        <h2 style="margin: 0;">Your OTP Code</h2>
                        <div style="font-size: 32px; font-weight: bold; margin: 20px 0; letter-spacing: 5px;">${otp}</div>
                        <p style="margin: 10px 0 0 0;">This code will expire in 10 minutes</p>
                    </div>

                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin: 0; color: #555;">You're registering for the Mental Wellness Assessment Tool. If you didn't request this, please ignore this email.</p>
                    </div>

                    <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                        <p>This OTP is valid for 10 minutes only.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        console.log(`OTP sent successfully to ${email}`);
        res.json({ success: true, message: 'OTP sent successfully!' });

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP', details: error.message });
    }
});

// API endpoint to verify OTP
app.post('/api/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        // Retrieve OTP from database
        const [rows] = await pool.query('SELECT otp, timestamp FROM otp_verification WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(400).json({ error: 'OTP not found or expired' });
        }

        const storedOtp = rows[0].otp;
        const timestamp = new Date(rows[0].timestamp);
        const now = new Date();
        const diffMs = now - timestamp;
        const maxAgeMs = 10 * 60 * 1000; // 10 minutes

        if (diffMs > maxAgeMs) {
            // Delete expired OTP
            await pool.query('DELETE FROM otp_verification WHERE email = ?', [email]);
            return res.status(400).json({ error: 'OTP has expired' });
        }

        if (storedOtp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // OTP is valid, delete it
        await pool.query('DELETE FROM otp_verification WHERE email = ?', [email]);

        res.json({ success: true, message: 'OTP verified successfully!' });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Failed to verify OTP', details: error.message });
    }
});

// API endpoint to send welcome email
app.post('/api/send-welcome-email', async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return res.status(400).json({ error: 'Email and name are required' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: 'Welcome to Mental Wellness Assessment Tool!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #4F46E5; text-align: center;">Welcome to Your Mental Wellness Journey!</h1>

                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; margin: 20px 0; color: white;">
                        <h2 style="margin: 0;">Hello ${name}!</h2>
                        <p style="margin: 10px 0 0 0;">Thank you for joining our Mental Wellness Assessment Tool.</p>
                    </div>

                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">What happens next?</h3>
                        <ul style="color: #555;">
                            <li>You can now access your personalized mental wellness assessment</li>
                            <li>Receive tailored recommendations based on your responses</li>
                            <li>Track your mental health progress over time</li>
                            <li>Access helpful resources and support information</li>
                        </ul>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Start Your Assessment</a>
                    </div>

                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <p style="margin: 0; color: #856404;"><strong>Remember:</strong> This tool is designed to support your mental wellness journey, but it's not a substitute for professional medical advice. If you're experiencing severe distress, please reach out to a qualified mental health professional.</p>
                    </div>

                    <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                        <p>Need help? Contact our support team or visit our resources section.</p>
                        <p>Stay well, ${name}!</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        console.log(`Welcome email sent successfully to ${email}`);
        res.json({ success: true, message: 'Welcome email sent successfully!' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Email service is running' });
});

app.listen(PORT, () => {
    console.log(`Email service server running on port ${PORT}`);
    console.log(`Make sure to set EMAIL_USER and EMAIL_PASS environment variables`);
});
