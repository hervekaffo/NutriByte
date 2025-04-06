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

  const addToMealHandler = async (food, qty) => {
    dispatch(addToMeal({ ...food, qty }));
  };

  const removeFromMealHandler = (id) => {
    dispatch(removeFromMeal(id));
  };

  const submitMealHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>Meal Foods</h1>
        {mealItems.length === 0 ? (
          <Message>
            Your Meal Has No Food please Add Food <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {mealItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src='' alt={item.brandOwner} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/food/${item._id}`}>{item.brandedFoodCategory}</Link>
                  </Col>
                  <Col md={2}>{item.servingSize}</Col>
                  <Col md={2}>{item.servingSizeUnit}</Col>
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
                {/* Subtotal ({mealItems.reduce((acc, item) => acc + item.qty, 0)}) */}
              </h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={mealItems.length === 0}
                onClick={submitMealHandler}
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
