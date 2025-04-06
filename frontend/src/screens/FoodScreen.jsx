import { useState } from 'react';
 import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { useGetFoodDetailsQuery } from '../slices/foodApiSlice';
//import Rating from '../components/Rating';
import { FaArrowLeft } from "react-icons/fa";
import Loader from '../components/Loader';
import Message from '../components/Message';
import { addToMeal } from '../slices/mealSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const FoodScreen = () => {
  const { id: foodId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const addToMealHandler = () => {
    dispatch(addToMeal({ ...food, qty }));
    navigate('/meal');
  }
  
  const { data: food, isLoading, error } = useGetFoodDetailsQuery(foodId);

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        <FaArrowLeft />
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <Image src='' alt={food.brandOwner} fluid />
            </Col>
            <Col md={4}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{food.description}</h3>
                </ListGroup.Item>
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
                      <Col>{food.servingSizeUnit}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col xs='auto' className='my-1'>
                        <Form.Control
                          type='number'
                          value={qty}
                          min='1'
                          onChange={(e) => setQty(Number(e.target.value))}
                        />
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button className='btn-block' type='button' onClick={addToMealHandler}>
                      <FontAwesomeIcon icon={faPlus} />
                      {' '}
                      Add To My Meal
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default FoodScreen;