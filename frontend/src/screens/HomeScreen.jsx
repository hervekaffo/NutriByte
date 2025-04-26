import React, { useState } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetFoodsQuery, useGetTopFoodsQuery } from '../slices/foodsApiSlice';
import BFood from '../components/BFood';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import InfoCarousel from '../components/InfoCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetFoodsQuery({ keyword, pageNumber });
  const {
    data: topFoods,
    isLoading: loadingTopFoods,
    error: errorTopFoods
  } = useGetTopFoodsQuery();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalFood, setModalFood] = useState(null);

  const openModal = (food) => {
    setModalFood(food);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setModalFood(null);
  };

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
              {errorTopFoods.data?.message || errorTopFoods.error}
            </Message>
          ) : (
            <Row>
              {topFoods.map((food) => (
                <Col key={food._id} sm={12} md={6} lg={4} xl={3}>
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => openModal(food)}
                  >
                    <BFood food={food} />
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </>
      ) : (
        <Button variant="light" onClick={() => window.history.back()}>
          Go Back
        </Button>
      )}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          <h1>Suggested Foods</h1>
          <Row>
            {data.foods.map((food) => (
              <Col key={food._id} sm={12} md={6} lg={4} xl={3}>
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => openModal(food)}
                >
                  <BFood food={food} />
                </div>
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword || ''}
          />
        </>
      )}

      {/* Food Detail Modal */}
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalFood?.brandOwner || 'Food Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalFood && (
            <>
              <p><strong>Description:</strong> {modalFood.description}</p>
              <p><strong>Category:</strong> {modalFood.brandedFoodCategory}</p>
              <p><strong>Serving:</strong> {modalFood.servingSize} {modalFood.servingSizeUnit}</p>
              {modalFood.macros && (
                <>
                  <p><strong>Calories:</strong> {modalFood.macros.calories}</p>
                  <p><strong>Protein:</strong> {modalFood.macros.protein} g</p>
                  <p><strong>Carbs:</strong> {modalFood.macros.carbohydrates} g</p>
                  <p><strong>Fats:</strong> {modalFood.macros.fat} g</p>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HomeScreen;