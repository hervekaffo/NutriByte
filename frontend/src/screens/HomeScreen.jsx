import { Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import {
  useGetFoodsQuery,
  useGetTopFoodsQuery,
} from '../slices/foodsApiSlice';
import BFood from '../components/BFood';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import InfoCarousel from '../components/InfoCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  // Query for regular foods
  const { data, isLoading, error } = useGetFoodsQuery({
    keyword,
    pageNumber,
  });

  // Query for top-rated foods
  const {
    data: topFoods,
    isLoading: loadingTopFoods,
    error: errorTopFoods,
  } = useGetTopFoodsQuery();

  return (
    <>
      {!keyword ? (
        <>
          <InfoCarousel />
          <h2>Top Rated Foods</h2>
          {loadingTopFoods ? (
            <Loader />
          ) : errorTopFoods ? (
            <Message variant="danger">
              {errorTopFoods?.data?.message || errorTopFoods?.error}
            </Message>
          ) : (
            <Row>
              {topFoods &&
                topFoods.map((food) => (
                  <Col key={food._id} sm={12} md={6} lg={4} xl={3}>
                    <BFood food={food} />
                  </Col>
                ))}
            </Row>
          )}
        </>
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          <h1>Suggested Foods</h1>
          <Row>
            {data.foods &&
              data.foods.map((food) => (
                <Col key={food._id} sm={12} md={6} lg={4} xl={3}>
                  <BFood food={food} />
                </Col>
              ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
