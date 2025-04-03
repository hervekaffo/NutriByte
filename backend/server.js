import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import foods from './data/branded_food.js';
const port = process.env.PORT || 5000;

const app = express();

app.get('/api/foods', (req, res) => {
    res.json(foods);
});

app.get('/api/foods/:id', (req, res) => {
    const food = foods.find((f) => f.fdcId === Number(req.params.id));
    if (food) {
        res.json(food);
    } else {
        res.status(404).json({ message: 'Food not found' });
    }
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(port, () => console.log(`Server running on port ${port}`));