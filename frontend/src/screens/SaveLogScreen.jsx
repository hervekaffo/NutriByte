// src/screens/SaveLogScreen.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Form,
  Button,
  Spinner,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { useCreateMealMutation } from '../slices/mealsApiSlice';
import { resetMeal } from '../slices/mealSlice';

const SaveLogScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mealItems } = useSelector((state) => state.meal);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalCalories, setTotalCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const [createMeal, { isLoading, error }] = useCreateMealMutation();

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
    <Container className="py-4">
      <h1 className="mb-4 text-center">Review &amp; Save Your Meal Log</h1>
      <Row>
        {/* Left column: meal preview */}
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Header as="h5">Your Meal</Card.Header>
            <ListGroup variant="flush">
              {mealItems.length === 0 ? (
                <ListGroup.Item className="text-center text-muted">
                  No items added yet.
                </ListGroup.Item>
              ) : (
                mealItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col>{item.brandOwner}</Col>
                      <Col className="text-end">Qty: {item.qty}</Col>
                    </Row>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card>

          <div className="d-flex justify-content-between">
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/meal')}
            >
              Back to Meal Builder
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => navigate('/nutrition-logs')}
            >
              View All Logs
            </Button>
          </div>
        </Col>

        {/* Right column: form */}
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Header as="h5">Log Details</Card.Header>
            <Card.Body>
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="date" className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="totalCalories" className="mb-3">
                  <Form.Label>Total Calories</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter total calories"
                    value={totalCalories}
                    onChange={(e) => setTotalCalories(e.target.value)}
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group controlId="protein" className="mb-3">
                      <Form.Label>Protein (g)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="e.g. 80"
                        value={protein}
                        onChange={(e) => setProtein(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="carbs" className="mb-3">
                      <Form.Label>Carbs (g)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="e.g. 150"
                        value={carbs}
                        onChange={(e) => setCarbs(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="fats" className="mb-3">
                      <Form.Label>Fats (g)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="e.g. 60"
                        value={fats}
                        onChange={(e) => setFats(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {error && (
                  <Message variant="danger" className="mb-3">
                    {error.data?.message || error.error}
                  </Message>
                )}

                <Button
                  type="submit"
                  variant="success"
                  disabled={isLoading || mealItems.length === 0}
                  className="w-100"
                >
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    'Save and Finish'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SaveLogScreen;
