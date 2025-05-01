import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  useGetFoodDetailsQuery,
  useCreateReviewMutation,
} from '../slices/foodsApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToMeal } from '../slices/mealSlice';

const FoodScreen = () => {
  const { id: foodId } = useParams();
  const location = useLocation(); 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const addToMealHandler = () => {
    dispatch(addToMeal({ ...food, qty }));
    navigate('/meal');
  };

  const {
    data: food,
    isLoading,
    refetch,
    error,
  } = useGetFoodDetailsQuery(foodId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingFoodReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        foodId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review created successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={food.fdcId} description={food.description} />
          <Row>
          <Col md={6}>
    <Image
      src={food.image}
      alt={food.fdcId}
      fluid
      style={{ height: '300px', objectFit: 'cover' }}
    />
</Col>

            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{food.brandOwner}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={food.rating}
                    text={`${food.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Category: {food.brandedFoodCategory}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {food.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Serving Size:</Col>
                      <Col>
                        <strong>{food.servingSize} {food.servingSizeUnit}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Market Country: {food.marketCountry}</Col>
                    </Row>
                  </ListGroup.Item>

                  {/* Qty Input */}
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            type='number'
                            min='1'
                            max={10}
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          />
                        </Col>
                      </Row>
                    </ListGroup.Item>

                  <ListGroup.Item>
                    <Button
                      className='btn-block'
                      type='button'
                      disabled={food.countInStock === 0}
                      onClick={addToMealHandler}
                    >
                      Add To Meal
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className='review'>
            <Col md={6}>
              <h2>Reviews</h2>
              {food.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant='flush'>
                {food.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>

                  {loadingFoodReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group className='my-2' controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className='my-2' controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingFoodReview}
                        type='submit'
                        variant='primary'
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/login'>sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default FoodScreen;
