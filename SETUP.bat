@echo off
echo ========================================
echo VoiceStock Setup Instructions
echo ========================================
echo.
echo Step 1: Install Backend Dependencies
echo Navigate to backend folder and run: npm install
echo.
echo Step 2: Configure Backend Environment
echo Edit backend\.env with your MongoDB URI and Groq API key
echo.
echo Step 3: Install Frontend Dependencies
echo Navigate to frontend folder and run: npm install
echo.
echo Step 4: Start MongoDB
echo Make sure MongoDB is running locally or use MongoDB Atlas
echo.
echo Step 5: Start Backend Server
echo In backend folder, run: npm run dev
echo Server will start on http://localhost:5000
echo.
echo Step 6: Start Frontend Server
echo In frontend folder, run: npm run dev
echo App will start on http://localhost:3000
echo.
echo ========================================
echo Quick Start Commands:
echo ========================================
echo cd backend
echo npm install
echo npm run dev
echo.
echo (In new terminal)
echo cd frontend
echo npm install
echo npm run dev
echo ========================================
pause
