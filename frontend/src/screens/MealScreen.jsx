import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import {
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Card,
  Image,
  Modal,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useGetFoodsQuery } from "../slices/foodsApiSlice";
import { addToMeal, removeFromMeal } from "../slices/mealSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const MealScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mealItems } = useSelector((state) => state.meal);

  const [keyword, setKeyword] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);

  const { data, isLoading, error, refetch } = useGetFoodsQuery({
    keyword,
    pageNumber: 1,
  });

  const searchHandler = (e) => {
    e.preventDefault();
    refetch();
  };

  const addHandler = (food) => dispatch(addToMeal({ ...food, qty: 1 }));
  const removeHandler = (id) => dispatch(removeFromMeal(id));
  const isInMeal = (id) => mealItems.some((i) => i._id === id);

  return (
    <>
      <Row className="mb-3">
        <Col>
          <h1>Build Your Meal</h1>
        </Col>
        <Col className="text-end">
          <Button
            variant="success"
            onClick={() => navigate("/savelogs")}
            disabled={!mealItems.length}
            className="me-2"
          >
            Save Meal Log
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/nutrition-logs")}
          >
            View Meal Logs
          </Button>
        </Col>
      </Row>

      <Row>
        {/* Left: Search + Results */}
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
              {data.foods.map((food) => (
                <Col key={food._id} sm={12} md={6} lg={4} xl={3}>
                  <Card className="mb-3 p-2">
                    <Card.Img
                      src={food.image || "/images/sample.jpg"}
                      variant="top"
                      style={{
                        height: "150px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedFood(food)}
                    />
                    <Card.Body>
                      <Card.Title>{food.brandOwner}</Card.Title>
                      <Card.Text>{food.brandedFoodCategory}</Card.Text>
                      <Button
                        onClick={() => addHandler(food)}
                        disabled={isInMeal(food._id)}
                        className="me-2"
                      >
                        {isInMeal(food._id) ? "Added" : "Add to Meal"}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>

        {/* Right: Current Meal */}
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
                        src={item.image || "/images/sample.jpg"}
                        alt={item.brandOwner}
                        fluid
                        rounded
                        style={{ height: "50px", objectFit: "cover" }}
                      />
                    </Col>
                    <Col xs={6}>{item.brandOwner}</Col>
                    <Col xs={4} className="text-end">
                      <Button
                        variant="light"
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

      {/* Details Modal */}
      <Modal
        show={!!selectedFood}
        onHide={() => setSelectedFood(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedFood?.brandOwner}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image
            src={selectedFood?.image || "/images/sample.jpg"}
            alt={selectedFood?.brandOwner}
            rounded
            className="mb-3 d-block mx-auto"
            style={{
              width: "300px",
              height: "300px",
              objectFit: "cover",
            }}
          />
          <p>
            <strong>FDC ID:</strong> {selectedFood?.fdcId}
          </p>
          <p>
            <strong>Category:</strong> {selectedFood?.brandedFoodCategory}
          </p>
          <p>
            <strong>Description:</strong> {selectedFood?.description}
          </p>
          <p>
            <strong>Serving Size:</strong> {selectedFood?.servingSize}{" "}
            {selectedFood?.servingSizeUnit}
          </p>
          <p>
            <strong>Market Country:</strong> {selectedFood?.marketCountry}
          </p>
          <p>
            <strong>Brand Owner:</strong> {selectedFood?.brandOwner}
          </p>
          {selectedFood?.macros && (
            <>
              <p>
                <strong>Calories:</strong> {selectedFood.macros.calories}
              </p>
              <p>
                <strong>Protein:</strong> {selectedFood.macros.protein} g
              </p>
              <p>
                <strong>Carbs:</strong> {selectedFood.macros.carbohydrates} g
              </p>
              <p>
                <strong>Fat:</strong> {selectedFood.macros.fat} g
              </p>
              {selectedFood.macros.fiber != null && (
                <p>
                  <strong>Fiber:</strong> {selectedFood.macros.fiber} g
                </p>
              )}
              {selectedFood.macros.sugar != null && (
                <p>
                  <strong>Sugar:</strong> {selectedFood.macros.sugar} g
                </p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              dispatch(addToMeal({ ...selectedFood, qty: 1 }));
              setSelectedFood(null);
            }}
            disabled={isInMeal(selectedFood?._id)}
          >
            {isInMeal(selectedFood?._id) ? "Added" : "Add to Meal"}
          </Button>
          <Button variant="secondary" onClick={() => setSelectedFood(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MealScreen;
