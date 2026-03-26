@echo off
echo Deploying VoiceStock to Vercel...

echo.
echo 1. Deploying Backend...
cd backend
call vercel --prod
cd ..

echo.
echo 2. Deploying Frontend...
cd frontend
call vercel --prod
cd ..

echo.
echo Deployment complete!
echo Don't forget to:
echo 1. Add environment variables in Vercel dashboard
echo 2. Update frontend .env with backend URL
pause