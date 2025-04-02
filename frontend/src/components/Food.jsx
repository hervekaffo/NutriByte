import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
 
 const Food = ({ food }) => {
 return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="" alt="Image"/>
      <Card.Body>
      <a href={`/food/${food.fdcId}`}>
        <Card.Title>{food.fdcId}</Card.Title>
        </a>
        <Card.Text>
            {food.description}
        </Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>{food.brandOwner}</ListGroup.Item>
        <ListGroup.Item>{food.brandedFoodCategory}</ListGroup.Item>
        <ListGroup.Item>{food.publicationDate}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Card.Link href="#">Learn more</Card.Link>
      </Card.Body>
    </Card>
    );
};
 export default Food;