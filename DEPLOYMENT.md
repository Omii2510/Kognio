# VoiceStock Deployment Guide

## 🚀 Quick Deploy

### Option 1: Deploy to Render (Recommended)

**Backend Deployment:**
1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Create New Web Service
4. Connect your GitHub repo
5. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
6. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   GROQ_API_KEY=your_groq_key
   GROQ_MODEL=llama-3.3-70b-versatile
   NODE_ENV=production
   ```

**Frontend Deployment:**
1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set Root Directory: `frontend`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
5. Deploy

### Option 2: Deploy to Railway

**Backend:**
1. Go to [Railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy

**Frontend:**
1. Same as Vercel above

### Option 3: Deploy to Heroku

**Backend:**
```bash
cd backend
heroku create voicestock-api
heroku config:set MONGODB_URI=your_uri
heroku config:set GROQ_API_KEY=your_key
git push heroku main
```

**Frontend:**
```bash
cd frontend
vercel --prod
```

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas database created
- [ ] Groq API key obtained
- [ ] Strong JWT secret generated
- [ ] Environment variables configured
- [ ] CORS origins updated
- [ ] Code pushed to GitHub

## 🔒 Security Notes

- Never commit `.env` files
- Use strong JWT secrets (32+ characters)
- Enable MongoDB IP whitelist
- Use HTTPS in production
- Rotate API keys regularly

## 📊 Post-Deployment

1. Test all API endpoints
2. Test voice commands
3. Verify database connections
4. Monitor error logs
5. Set up backups

## 🆘 Troubleshooting

**CORS Errors:**
- Update `FRONTEND_URL` in backend `.env`
- Check CORS configuration in `server.js`

**Database Connection:**
- Verify MongoDB URI
- Check IP whitelist in MongoDB Atlas
- Ensure network access is configured

**API Not Working:**
- Check environment variables
- Verify API URL in frontend `.env`
- Check server logs

## 📞 Support

For issues, check:
- Backend logs on Render/Railway
- Browser console for frontend errors
- MongoDB Atlas logs
