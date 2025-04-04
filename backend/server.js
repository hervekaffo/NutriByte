import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import foodRoutes from './routes/foodRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';


const port = process.env.PORT || 5000;

connectDB();
const app = express();



app.use('/api/foods', foodRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(notFound);
 app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));