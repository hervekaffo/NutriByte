import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  ListGroup,
  Form,
  Button,
  Spinner,
  Modal,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { useCreateMealMutation } from '../slices/mealsApiSlice';
import { resetMeal } from '../slices/mealSlice';
import { useGetFoodDetailsQuery } from '../slices/foodsApiSlice';

const SaveLogScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mealItems } = useSelector((state) => state.meal);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalCalories, setTotalCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const [createMeal, { isLoading: saving, error: saveError }] =
    useCreateMealMutation();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState(null);

  // Fetch details when modal opens
  const {
    data: modalFood,
    isLoading: loadingModalFood,
    error: errorModalFood,
    refetch: refetchModalFood,
  } = useGetFoodDetailsQuery(selectedFoodId, { skip: !selectedFoodId });

  const openModal = (id) => {
    setSelectedFoodId(id);
    setShowModal(true);
    if (selectedFoodId) {
      refetchModalFood();
    }
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedFoodId(null);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const payload = {
      date,
      foods: mealItems.map((item) => ({
        foodId: item._id,
        quantity: item.qty,
      })),
    };

    if (totalCalories) {
      payload.overrideTotals = {
        totalCalories: parseFloat(totalCalories),
        totalMacros: {
          protein: parseFloat(protein) || 0,
          carbs: parseFloat(carbs) || 0,
          fats: parseFloat(fats) || 0,
        },
      };
    }

    try {
      await createMeal(payload).unwrap();
      dispatch(resetMeal());
      navigate('/nutrition-logs');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FormContainer>
      <h3>Review & Save Your Meal Log</h3>
      <Row className="mb-3">
        <Col>
          <Button as={Link} to="/meal" variant="outline-secondary">
            Back to Meal Builder
          </Button>
        </Col>
      </Row>

      <Card className="mb-4 shadow-sm">
        <Card.Header>Your Meal Items</Card.Header>
        <ListGroup variant="flush">
          {mealItems.length === 0 && (
            <ListGroup.Item>No items added yet.</ListGroup.Item>
          )}
          {mealItems.map((item) => (
            <ListGroup.Item
              key={item._id}
              style={{ cursor: 'pointer' }}
              onClick={() => openModal(item._id)}
            >
              <Row>
                <Col xs={3}>
                  <img
                    src={item.image || '/placeholder-image.png'}
                    alt={item.description}
                    style={{ width: '40%', borderRadius: '5px' }}
                  />
                </Col>
                <Col xs={9}>
                  {item.brandOwner} × {item.qty}
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="date" className="my-2">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="totalCalories" className="my-2">
          <Form.Label>Total Calories</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter total calories"
            value={totalCalories}
            onChange={(e) => setTotalCalories(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="protein" className="my-2">
          <Form.Label>Protein (g)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter protein grams"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="carbs" className="my-2">
          <Form.Label>Carbs (g)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter carbs grams"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="fats" className="my-2">
          <Form.Label>Fats (g)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter fats grams"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
          />
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          disabled={saving || mealItems.length === 0}
        >
          {saving ? <Spinner animation="border" size="sm" /> : 'Save & Finish'}
        </Button>

        {saveError && (
          <Message variant="danger" className="mt-2">
            {saveError.data?.message || saveError.error}
          </Message>
        )}
      </Form>

      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {loadingModalFood
              ? 'Loading...'
              : modalFood
              ? modalFood.description
              : 'Food Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingModalFood ? (
            <Spinner />
          ) : errorModalFood ? (
            <Message variant="danger">
              {errorModalFood.data?.message || errorModalFood.error}
            </Message>
          ) : modalFood ? (
            <>
              <p>
                <strong>Brand:</strong> {modalFood.brandOwner}
              </p>
              <p>
                <strong>Category:</strong> {modalFood.brandedFoodCategory}
              </p>
              <p>
                <strong>Description:</strong> {modalFood.description}
              </p>
              <p>
                <strong>Serving:</strong> {modalFood.servingSize}{' '}
                {modalFood.servingSizeUnit}
              </p>
              <p>
                <strong>Calories:</strong> {modalFood.macros?.calories}
              </p>
              <p>
                <strong>Protein:</strong> {modalFood.macros?.protein} g
              </p>
              <p>
                <strong>Carbs:</strong> {modalFood.macros?.carbohydrates} g
              </p>
              <p>
                <strong>Fats:</strong> {modalFood.macros?.fat} g
              </p>
            </>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </FormContainer>
  );
};

export default SaveLogScreen;
