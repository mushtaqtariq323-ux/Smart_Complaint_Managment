# AI Fitness Coach 🏋️‍♂️🤖

AI Fitness Coach is an AI-powered fitness web application designed to help users create personalized workout and nutrition plans based on their fitness goals, activity level, and preferences.

## 🚀 Features

* 🤖 AI Fitness Coach chatbot
* 🏋️ Personalized workout plans
* 🥗 Personalized diet and nutrition guidance
* 🎯 Fitness goals:

  * Weight Loss
  * Weight Gain
  * Muscle Building
  * Maintenance
* 📊 User fitness profile
* 📸 Body/posture analysis
* 🔐 Firebase Authentication
* ☁️ Firebase Firestore for user data
* 👤 User and Admin functionality
* 📱 Responsive design for desktop and mobile

## 🛠️ Technologies Used

* HTML
* CSS
* JavaScript
* Firebase Authentication
* Firebase Firestore
* Groq API
* MediaPipe
* AI-powered fitness assistance

## ⚙️ Setup

### 1. Clone or download the project

Open the project in VS Code.

### 2. Configure Firebase

Create/configure your Firebase project and add the Firebase configuration to the application.

Make sure Firestore Database and Authentication are enabled.

### 3. Configure Groq API

Create an environment variable for your Groq API key.

Example:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Never expose your API key directly in frontend code or commit it to GitHub.

### 4. Firestore Rules

Deploy the `firestore.rules` file included in the project root to your Firebase Firestore Database.

In Firebase Console:

**Build → Firestore Database → Rules → Publish**

### 5. Run the project

Open the project using a local development server such as VS Code Live Server.

## 🔒 Security

API keys and other sensitive credentials should be stored in environment variables or a secure backend.

Do not upload `.env` files containing real API keys to GitHub.

Add the following to `.gitignore`:

```gitignore
.env
.env.local
node_modules/
```

## 📁 Project Structure

```text
AI-Fitness-Coach/
│
├── index.html
├── style.css
├── script.js
├── firestore.rules
├── .env
├── .gitignore
└── README.md
```

## 🎯 Purpose

The goal of AI Fitness Coach is to provide users with an easy-to-use digital fitness assistant that combines AI, personalized recommendations, workout planning, and nutrition guidance in one application.

## 👨‍💻 Developer

Developed as an AI-powered fitness project.
