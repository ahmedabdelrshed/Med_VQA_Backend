# Medical VQA Backend System

A backend system for a Medical Visual Question Answering (VQA) application that provides health-related analysis, predictions, and management of medical data.

## Features

- **Authentication & Authorization**

  - Email/Password authentication
  - OAuth integration (Google, GitHub)
  - JWT-based authorization
  - Email verification system

- **Health Analysis**

  - Blood pressure prediction
  - Blood sugar level analysis
  - Obesity analysis
  - General health assessment
  - Symptoms-based disease prediction

- **Chat System**

  - Image-based medical queries
  - Symptom-based queries
  - Voice response generation
  - Chat history management

- **User Management**
  - Profile management
  - Health records
  - Avatar upload/management
  - Password reset functionality

## Tech Stack

- **Backend Framework**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Passport.js
- **File Storage**: Cloudinary
- **Email Service**: SendGrid
- **Voice Generation**: gTTS (Google Text-to-Speech)
- **Deployment**: Vercel

## API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/emailVerification` - Email verification
- `POST /auth/reset-password` - Password reset

### Health Analysis

- `POST /api/sugarPatient/analyzeSugar` - Blood sugar analysis
- `POST /api/bloodPressurePatient/predict-blood-pressure` - Blood pressure prediction
- `POST /api/obesity/predict` - Obesity analysis
- `POST /api/health/health-record` - Health record creation/update

### Chat & Questions

- `POST /chat` - Create new chat
- `POST /question/questionImage/:chatId` - Add image-based question
- `POST /question/questionSymptoms/:chatId` - Add symptoms-based question

## Setup & Installation

1. Clone the repository

```bash
git clone https://github.com/ahmedabdelrshed/Med_VQA_Frontend.git

2. Install dependencies
npm install


3. Create a .env file with the following variables:
PORT=4000
MONGO_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SENDGRID_API_KEY=your_sendgrid_key
FRONTEND_URL=your_frontend_url


4. Start the development server

npm run dev

Project Structure

├── APIModelCaller/     # API integrations for ML models
├── config/            # Configuration files
├── controllers/       # Route controllers
├── DB/               # Database configuration
├── middlewares/      # Custom middlewares
├── models/           # Database models
├── Routes/           # API routes
├── services/         # Business logic
├── utils/            # Utility functions
├── validations/      # Input validation
└── index.js          # Application entry point


Contributing
Fork the repository
Create a new branch
Make your changes
Submit a pull request
License

This project is licensed under the MIT License.
This README provides a comprehensive overview of the project, its features, setup instructions, and structure. Let me know if you'd like any sections expanded or modified!This README provides a comprehensive overview of the project, its features, setup instructions, and structure. Let me know if you'd like any
```
