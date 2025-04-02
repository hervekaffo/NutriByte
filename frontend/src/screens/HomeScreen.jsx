import { Row, Col } from 'react-bootstrap';
 import Food from '../components/Food';
 import foods from '../branded_food';
 
 const HomeScreen = () => {
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