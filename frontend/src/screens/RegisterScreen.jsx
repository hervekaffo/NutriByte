import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';

const RegisterScreen = () => {
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge]                 = useState('');
  const [weight, setWeight]           = useState('');
  const [height, setHeight]           = useState('');
  const [gender, setGender]           = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [goal, setGoal]               = useState('');
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState('');
  const [protein, setProtein]         = useState('');
  const [carbs, setCarbs]             = useState('');
  const [fats, setFats]               = useState('');
  const [message, setMessage]         = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      const payload = {
        name,
        email,
        password,
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        gender,
        activityLevel,
        goal,
        dailyCalorieGoal: dailyCalorieGoal ? Number(dailyCalorieGoal) : undefined,
        dailyMacrosGoal: {
          protein: protein ? Number(protein) : 0,
          carbs:   carbs   ? Number(carbs)   : 0,
          fats:    fats    ? Number(fats)    : 0,
        },
      };
      const user = await register(payload).unwrap();
      dispatch(setCredentials(user));
      navigate(redirect);
    } catch (err) {
      setMessage(err.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <Message variant="danger">{message}</Message>}
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

        <Form.Group controlId="age" className="my-2">
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="weight" className="my-2">
          <Form.Label>Weight (kg)</Form.Label>
          <Form.Control
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="height" className="my-2">
          <Form.Label>Height (cm)</Form.Label>
          <Form.Control
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="gender" className="my-2">
          <Form.Label>Gender</Form.Label>
          <Form.Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Choose…</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="activityLevel" className="my-2">
          <Form.Label>Activity Level</Form.Label>
          <Form.Select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            required
          >
            <option value="">Choose…</option>
            <option>Sedentary</option>
            <option>Lightly Active</option>
            <option>Moderately Active</option>
            <option>Very Active</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="goal" className="my-2">
          <Form.Label>Goal</Form.Label>
          <Form.Select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            required
          >
            <option value="">Choose…</option>
            <option>Lose Weight</option>
            <option>Maintain Weight</option>
            <option>Gain Muscle</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="dailyCalorieGoal" className="my-2">
          <Form.Label>Daily Calorie Goal</Form.Label>
          <Form.Control
            type="number"
            value={dailyCalorieGoal}
            onChange={(e) => setDailyCalorieGoal(e.target.value)}
          />
        </Form.Group>

        <Row>
          <Col md={4}>
            <Form.Group controlId="protein" className="my-2">
              <Form.Label>Protein (g)</Form.Label>
              <Form.Control
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="carbs" className="my-2">
              <Form.Label>Carbs (g)</Form.Label>
              <Form.Control
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="fats" className="my-2">
              <Form.Label>Fats (g)</Form.Label>
              <Form.Control
                type="number"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary" className="my-3" disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Register'}
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Log In</Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default RegisterScreen;
