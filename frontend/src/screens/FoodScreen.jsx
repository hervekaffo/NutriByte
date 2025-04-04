import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
//import Rating from '../components/Rating';
import axios from 'axios';

const FoodScreen = () => {
  const { id: foodId } = useParams();
  const [food, setFood] = useState({});

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const { data } = await axios.get(`/api/foods/${foodId}`);
        setFood(data);
      } catch (error) {
        console.error('Error fetching food:', error);
      }
    };

    fetchFood();
  }, [foodId]);

  return (
    <>
      <Link to='/' className='btn btn-light my-3'>
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src='' alt={food.brandOwner} fluid />
        </Col>
        <Col md={4}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{food.description}</h3>
            </ListGroup.Item>
            {/* <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </ListGroup.Item> */}
            <ListGroup.Item>Market Country: {food.marketCountry}</ListGroup.Item>
            <ListGroup.Item>Ingredients: {food.ingredients}</ListGroup.Item>
            <ListGroup.Item>Branded Category: {food.brandedFoodCategory}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Serving Size:</Col>
                  <Col>
                    <strong>{food.servingSize}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Serving Size Unit:</Col>
                  <Col>
                    {food.servingSizeUnit}
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  className='btn-block'
                  type='button'
                //   disabled={product.countInStock === 0}
                >
                  Add To My Meal
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default FoodScreen;