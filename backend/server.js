import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

import foodRoutes from './routes/foodRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import nutritionLogRoutes from './routes/nutritionLogRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import suggestionRoutes from './routes/suggestionRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 1. Healthcheck endpoint for tests
app.get('/api/healthcheck', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 2. API routes
app.use('/api/foods', foodRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/nutrition-logs', nutritionLogRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/suggestions', suggestionRoutes);

// 3. Static serving in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(
    '/images/user_images',
    express.static('/var/data/images/user_images')
  );
  app.use(express.static(path.join(__dirname, '/frontend/build')));
  app.get('*', (_req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  const __dirname = path.resolve();
  app.use(
    '/images/user_images',
    express.static(path.join(__dirname, '/images/user_images'))
  );
  app.get('/', (_req, res) => {
    res.send('API is running....');
  });
}

// 4. Error handlers
app.use(notFound);
app.use(errorHandler);

// 5. Only start listening if NOT in test mode
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 5000;
  app.listen(port, () =>
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${port}`
    )
  );
}

export default app;
