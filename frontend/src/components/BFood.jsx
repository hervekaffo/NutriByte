import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const BFood = ({ food }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/food/${food._id}`}>
        <Card.Img src='/images/sample.jpg' variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/food/${food._id}`}>
          <Card.Title as='div' className='food-title'>
            <strong>{food.brandOwner}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={food.rating}
            text={`${food.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3'>{food.brandedFoodCategory}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default BFood;
