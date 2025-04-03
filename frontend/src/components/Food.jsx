import {Card, ListGroup} from 'react-bootstrap';
// import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
 
 const Food = ({ food }) => {
 return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="" alt="Food Image"/>
      <Card.Body>
      <Link to={`/food/${food.fdcId}`}>
        <Card.Title >{food.fdcId}</Card.Title>
      </Link>
        <Card.Text as='div' className='food-title'>
        <strong>{food.description}</strong>
        </Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>{food.brandOwner}</ListGroup.Item>
        <ListGroup.Item as='div' className='food-title'>{food.brandedFoodCategory}</ListGroup.Item>
        <ListGroup.Item>{food.publicationDate}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Card.Link href="#">Learn more</Card.Link>
      </Card.Body>
    </Card>
    );
};
 export default Food;