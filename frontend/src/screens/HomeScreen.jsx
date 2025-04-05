import { Row, Col } from 'react-bootstrap';
import { useGetFoodsQuery } from '../slices/foodSlice';
import Food from '../components/Food';
import Loader from '../components/Loader';
import Message from '../components/Message';

const HomeScreen = () => {

  const { data: foods, isLoading, error } = useGetFoodsQuery();
  return (
    <>
       {isLoading ? (
          <Loader />
       ) : error ? (
          <Message variant='danger'>
            {error?.data.message || error.error}
          </Message>
       ) : (
         <>
           <h1>Suggested Foods</h1>
           <Row>
             {foods.map((food) => (
               <Col key={food._id} sm={12} md={6} lg={4} xl={3}>
                 <Food food={food} />
               </Col>
             ))}
           </Row>
         </>
       )}
    </>
  );
 
};

export default HomeScreen;
