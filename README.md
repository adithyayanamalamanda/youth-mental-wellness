# 🧠 Mental Wellness Assessment Tool

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)

A comprehensive, culturally sensitive mental wellness assessment application designed for Indian youth. This tool integrates Google OAuth for secure access and provides automated, personalized feedback via email and PDF reports.

## ✨ Features

- **Comprehensive Assessment**: 5-step analysis covering:
  - 📚 Academic Stress
  - 👨‍👩‍👧‍👦 Family Dynamics
  - 🤝 Social & Personal Relationships
  - 💪 Physical & Emotional Health
  - 🕉️ Cultural & Societal Factors
- **Secure Authentication**: Seamless login with Google OAuth.
- **Automated Communication**: Instant welcome emails and OTP verification.
- **AI-Driven Insights**: Personalized recommendations based on assessment scores.
- **Professional Reports**: Generate and download detailed PDF assessment reports.
- **Responsive Design**: Optimized for both desktop and mobile experiences.
- **Dark Mode**: User-friendly dark mode for comfortable viewing.
- **Privacy First**: Secure handling of sensitive user data.

## 🛠️ Tech Stack

**Frontend**
- HTML5, CSS3 (Custom Properties), JavaScript (ES6+)
- OAuth 2.0 (Google Identity Services)
- jsPDF (Report Generation)

**Backend**
- Node.js & Express.js
- MySQL (Database)
- Nodemailer (Email Service)
- JSON Web Tokens (JWT)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL Server
- Gmail Account (for email services)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/adithyayanamalamanda/youth-mental-wellness.git
    cd youth-mental-wellness
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    # Email Configuration
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-app-specific-password
    
    # Database Configuration (if not using default local)
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=your_password
    DB_NAME=mood_assessment
    ```

4.  **Database Setup**
    Import the `mysql-setup.sql` file into your MySQL database to create the necessary tables.

### Running the Application

1.  **Start the Server** (Runs both backend and serves frontend)
    ```bash
    npm start
    ```

2.  **Access the App**
    Open [http://localhost:3001](http://localhost:3001) in your browser.

## 📁 Project Structure

```
youth-mental-wellness/
├── server.js              # Express backend & static file server
├── app.js                 # Core frontend logic & assessment engine
├── index.html             # Main application dashboard
├── login_new.html         # Modern login interface
├── register.html          # User registration page
├── style.css              # Global styling & dark mode definitions
├── mysql-setup.sql        # Database schema
└── package.json           # Project dependencies
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📞 Contact

**Adithya Yanamalamanda** - [GitHub Profile](https://github.com/adithyayanamalamanda)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
