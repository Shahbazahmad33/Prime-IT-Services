# Prime IT Solutions Website

A modern, responsive web application showcasing IT solutions and services.  
Includes a secure contact form powered by **Node.js**, **Express**, and **Gmail SMTP integration**, with frontend built using **HTML, CSS, and JavaScript**.  

---

## 🚀 Features
- Responsive company website layout (HTML, CSS, JS)
- Secure contact form with email delivery via Gmail SMTP
- Backend built with Node.js + Express
- Environment variable support for sensitive credentials
- Deployment-ready for Vercel (frontend) and Render (backend)

---

## 📂 Project Structure
Prime-IT-Solutions/
├── index.html          # Frontend HTML
├── styles.css          # Styling
├── app.js              # Frontend JS
├── server.js           # Backend server (Express + Nodemailer)
├── package.json        # Node.js dependencies
├── .gitignore          # Ignore node_modules and .env
├── .env                # Environment variables (NOT committed)
├── node_modules/       # Installed dependencies (ignored)
└── images/             # Project assets

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Shahbazahmad33/Prime-IT-Solutions.git
cd Prime-IT-Solutions
**2. Install dependencies**
npm install

**3. Configure environment variables**
Create a .env file in the root directory:

Code
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_RECEIVER_EMAIL=recipient-email@gmail.com
SMTP_FROM_EMAIL=your-email@gmail.com
NODE_ENV=development


📧 Contact Form
Sends emails via Gmail SMTP using Nodemailer

Validates input (name, email, message)

Supports plain text and HTML email formats

🛡️ Security Notes
.env file is ignored via .gitignore

Gmail App Passwords are used instead of real account passwords

CORS restricts API access to your frontend domain

📜 License
This project is licensed under the MIT License.
You are free to use, modify, and distribute with attribution.

👨‍💻 Author
Developed by Shahbaz Ahmad  
📧 Email: shahbaz.swe@gmail.com
🌍 Location: Lahore, Pakistan

