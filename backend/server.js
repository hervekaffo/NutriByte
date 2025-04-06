import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import foodRoutes from './routes/foodRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';

const port = process.env.PORT || 5000;

connectDB();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/foods', foodRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(notFound);
 app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));