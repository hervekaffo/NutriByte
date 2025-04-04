import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Food from '../components/Food';
import axios from 'axios';
import { use } from 'react';

const HomeScreen = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await axios.get('/api/foods');
        setFoods(data);
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };

    fetchFoods();
  }
  , []);
  return (
    <>
      <h1>Branded Foods</h1>
      <Row>
        {foods.map((food) => (
          <Col key={food.fdcId} sm={12} md={6} lg={4} xl={3}>
            <Food food={food} />
          </Col>
        ))}
      </Row>
    </>
  );
 
};

export default HomeScreen;
