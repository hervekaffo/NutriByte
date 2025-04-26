import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useRegisterMutation,
  useUploadMutation,
} from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("Male");
  const [activityLevel, setActivityLevel] = useState("Sedentary");
  const [goal, setGoal] = useState("Maintain Weight");
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState("");
  const [proteinGoal, setProteinGoal] = useState("");
  const [carbsGoal, setCarbsGoal] = useState("");
  const [fatsGoal, setFatsGoal] = useState("");

  const [picture, setPicture] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [register, { isLoading }] = useRegisterMutation();
  const [uploadImage] = useUploadMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("picture", file);
    setUploading(true);
    try {
      const { data } = await uploadImage(formData).unwrap();
      setPicture(data);
    } catch (err) {
      toast.error(err.data?.message || err.error);
    }
    setUploading(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      const user = await register({
        name,
        email,
        password,
        picture,
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        gender,
        activityLevel,
        goal,
        dailyCalorieGoal: Number(dailyCalorieGoal),
        dailyMacrosGoal: {
          protein: Number(proteinGoal),
          carbs: Number(carbsGoal),
          fats: Number(fatsGoal),
        },
      }).unwrap();
      dispatch(setCredentials(user));
      navigate("/");
    } catch (err) {
      setError(err.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Register</h1>
      {error && <Message variant="danger">{error}</Message>}
      {isLoading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="my-2">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="email" className="my-2">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="picture" className="my-2">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control type="file" onChange={uploadFileHandler} />
          {uploading && <Loader />}
        </Form.Group>

        <Form.Group controlId="password" className="my-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="my-2">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Row>
          <Col md={4}>
            <Form.Group controlId="age" className="my-2">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="weight" className="my-2">
              <Form.Label>Weight (kg)</Form.Label>
              <Form.Control
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="height" className="my-2">
              <Form.Label>Height (cm)</Form.Label>
              <Form.Control
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="gender" className="my-2">
          <Form.Label>Gender</Form.Label>
          <Form.Control
            as="select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="activityLevel" className="my-2">
          <Form.Label>Activity Level</Form.Label>
          <Form.Control
            as="select"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            required
          >
            <option>Sedentary</option>
            <option>Lightly Active</option>
            <option>Moderately Active</option>
            <option>Very Active</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="goal" className="my-2">
          <Form.Label>Goal</Form.Label>
          <Form.Control
            as="select"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          >
            <option>Lose Weight</option>
            <option>Maintain Weight</option>
            <option>Gain Muscle</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="dailyCalorieGoal" className="my-2">
          <Form.Label>Daily Calorie Goal (kcal)</Form.Label>
          <Form.Control
            type="number"
            value={dailyCalorieGoal}
            onChange={(e) => setDailyCalorieGoal(e.target.value)}
            required
          />
        </Form.Group>

        <Row>
          <Col md={4}>
            <Form.Group controlId="proteinGoal" className="my-2">
              <Form.Label>Protein Goal (g)</Form.Label>
              <Form.Control
                type="number"
                value={proteinGoal}
                onChange={(e) => setProteinGoal(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="carbsGoal" className="my-2">
              <Form.Label>Carbs Goal (g)</Form.Label>
              <Form.Control
                type="number"
                value={carbsGoal}
                onChange={(e) => setCarbsGoal(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="fatsGoal" className="my-2">
              <Form.Label>Fats Goal (g)</Form.Label>
              <Form.Control
                type="number"
                value={fatsGoal}
                onChange={(e) => setFatsGoal(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary" className="mt-3">
          Register
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Have an account? <Link to="/login">Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
