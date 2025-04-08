import { useEffect, useState } from 'react';
import { getConsistentImage } from '../utils/imageUtils';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToMeal, removeFromMeal } from '../slices/mealSlice';

const MealScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const meal = useSelector((state) => state.meal);
  const { mealItems } = meal;

  // NOTE: no need for an async function here as we are not awaiting the
  // resolution of a Promise
  const addToMealHandler = (meal, qty) => {
    dispatch(addToMeal({ ...meal, qty }));
  };

  const removeFromMealHandler = (id) => {
    dispatch(removeFromMeal(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/savelogs');
  };

  const [imageList, setImageList] = useState([]);

useEffect(() => {
  const fetchImages = async () => {
    try {
      const res = await fetch('/food_images', {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch images');
      const data = await res.json();
      setImageList(data.map((img) => ({ src: img })));
    } catch (err) {
      console.error('Image fetch error:', err);
    }
  };
  fetchImages();
}, []);

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>Meal Foods</h1>
        {mealItems.length === 0 ? (
          <Message>
            Your Meal is empty Please add some food <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {mealItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                  <Image
  src={
    imageList.length > 0
      ? `/food_images/${getConsistentImage(imageList, item._id)}`
      : '/images/sample.jpg'
  }
  alt={item.brandOwner}
  fluid
  rounded
  style={{ width: '100%', height: '100px', objectFit: 'cover' }} // Set width, height, and objectFit to make the image consistent
/>
                  </Col>
                  <Col md={3}>
                    <Link to={`/meal/${item._id}`}>{item.fdcId}</Link>
                  </Col>
                  <Col md={2}>{item.brandedFoodCategory}</Col>
                  <Col md={2}>
                    <Form.Control
                      type='number'
                      value={item.qty}
                      min='1'
                      max={item.countInStock}
                      onChange={(e) =>
                        addToMealHandler(item, Number(e.target.value))
                      }
                    />
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromMealHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Subtotal ({mealItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={mealItems.length === 0}
                onClick={checkoutHandler}
              >
                Submit
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default MealScreen;
