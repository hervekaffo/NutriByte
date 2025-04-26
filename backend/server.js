import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import foodRoutes from './routes/foodRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import mealRoutes from './routes/mealRoutes.js';                   
import nutritionLogRoutes from './routes/nutritionLogRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import suggestionRoutes from './routes/suggestionRoutes.js';

const port = process.env.PORT || 5000;

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/foods', foodRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/meals', mealRoutes);                                 
app.use('/api/nutrition-logs', nutritionLogRoutes); 
app.use('/api/goals', goalRoutes);
app.use('/api/suggestions', suggestionRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use('/images/user_images', express.static('/var/data/images/user_images'));
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  const __dirname = path.resolve();
  app.use('/images/user_images', express.static(path.join(__dirname, '/images/user_images')));
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
