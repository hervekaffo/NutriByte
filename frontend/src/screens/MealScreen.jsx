// src/screens/MealScreen.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import {
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Card,
  Image,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useGetFoodsQuery } from '../slices/foodsApiSlice';
import { addToMeal, removeFromMeal } from '../slices/mealSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getConsistentImage } from '../utils/imageUtils';

const LinkImage = ({ food, imageList }) => {
  const src =
    imageList.length > 0
      ? `/food_images/${getConsistentImage(imageList, food._id)}`
      : '/images/sample.jpg';
  return (
    <Link to={`/food/${food._id}`}>
      <Card.Img
        src={src}
        alt={food.brandOwner}
        variant="top"
        style={{ height: '150px', objectFit: 'cover' }}
      />
    </Link>
  );
};

const MealScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mealItems } = useSelector((state) => state.meal);

  // Search state
  const [keyword, setKeyword] = useState('');
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetFoodsQuery({ keyword, pageNumber: 1 });

  // Load images once
  const [imageList, setImageList] = useState([]);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/food_images', {
          headers: { Accept: 'application/json' },
        });
        const imgs = await res.json();
        setImageList(imgs.map((src) => ({ src })));
      } catch (err) {
        console.error('Image fetch error:', err);
      }
    };
    fetchImages();
  }, []);

  const searchHandler = (e) => {
    e.preventDefault();
    refetch();
  };

  const addHandler = (food) => {
    dispatch(addToMeal({ ...food, qty: 1 }));
  };

  const removeHandler = (id) => {
    dispatch(removeFromMeal(id));
  };

  return (
    <>
      <Row className="mb-3">
        <Col>
          <h1>Build Your Meal</h1>
        </Col>
        <Col className="text-end">
          <Button
            variant="success"
            onClick={() => navigate('/savelogs')}
            disabled={mealItems.length === 0}
            className="me-2"
          >
            Save Meal Log
          </Button>
          <Button variant="outline-primary" as={Link} to="/nutrition-logs">
            View Meal Logs
          </Button>
        </Col>
      </Row>

      <Row>
        {/* Left: Search + results */}
        <Col md={8}>
          <Form onSubmit={searchHandler} className="d-flex mb-3">
            <Form.Control
              type="text"
              placeholder="Search foods..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button type="submit" variant="primary" className="ms-2">
              Search
            </Button>
          </Form>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <Row>
              {data.foods.map((food) => {
                const alreadyAdded = mealItems.find((i) => i._id === food._id);
                return (
                  <Col key={food._id} sm={12} md={6} lg={4} xl={3}>
                    <Card className="mb-3 p-2">
                      <LinkImage food={food} imageList={imageList} />
                      <Card.Body>
                        <Card.Title>{food.brandOwner}</Card.Title>
                        <Card.Text>{food.brandedFoodCategory}</Card.Text>
                        <Button
                          onClick={() => addHandler(food)}
                          disabled={!!alreadyAdded}
                        >
                          {alreadyAdded ? 'Added' : 'Add to Meal'}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Col>

        {/* Right: Current meal */}
        <Col md={4}>
          <h2>Your Meal</h2>
          {mealItems.length === 0 ? (
            <Message>Your meal is empty</Message>
          ) : (
            <ListGroup variant="flush">
              {mealItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col xs={2}>
                      <Image
                        src={
                          imageList.length > 0
                            ? `/food_images/${getConsistentImage(
                                imageList,
                                item._id
                              )}`
                            : '/images/sample.jpg'
                        }
                        alt={item.brandOwner}
                        fluid
                        rounded
                        style={{ height: '50px', objectFit: 'cover' }}
                      />
                    </Col>
                    <Col xs={6}>{item.brandOwner}</Col>
                    <Col xs={4} className="text-end">
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeHandler(item._id)}
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
      </Row>
    </>
  );
};

export default MealScreen;
