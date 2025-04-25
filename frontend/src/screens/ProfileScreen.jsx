import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  ListGroup,
  Image,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProfileMutation, useUploadMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyGoalQuery } from '../slices/goalsApiSlice';
import Message from '../components/Message';
import Loader from '../components/Loader';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Mutations
  const [updateProfile, { isLoading: loadingUpdate }] = useProfileMutation();
  const [uploadFile, { isLoading: loadingUpload }] = useUploadMutation();

  // Fetch goal
  const {
    data: goal,
    isLoading: loadingGoal,
    error: errorGoal,
  } = useGetMyGoalQuery(undefined, { refetchOnMountOrArgChange: true });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    picture: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    activityLevel: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState(null);

  // Populate from userInfo
  useEffect(() => {
    if (userInfo) {
      setFormData((f) => ({
        ...f,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        age: userInfo.age,
        weight: userInfo.weight,
        height: userInfo.height,
        gender: userInfo.gender,
        activityLevel: userInfo.activityLevel,
      }));
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    try {
      const { url } = await uploadFile(data).unwrap();
      setFormData((f) => ({ ...f, picture: url }));
      toast.success('Profile picture uploaded');
    } catch (err) {
      toast.error(err.data?.message || err.error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const updated = await updateProfile({
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        password: formData.password || undefined,
      }).unwrap();

      dispatch(setCredentials(updated));
      setMessage('Profile updated successfully');
      setFormData((f) => ({ ...f, password: '', confirmPassword: '' }));
    } catch (err) {
      setMessage(err.data?.message || err.error);
    }
  };

  return (
    <Container className="py-5">
      <Row className="g-4">
        {/* PROFILE CARD */}
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              My Profile
            </Card.Header>
            <Card.Body>
              {message && (
                <Message
                  variant={message.includes('success') ? 'success' : 'danger'}
                >
                  {message}
                </Message>
              )}
              <Form onSubmit={submitHandler}>
                {/* Picture upload & preview */}
                <Form.Group controlId="picture" className="mb-3 text-center">
                  {formData.picture && (
                    <Image
                      src={formData.picture}
                      roundedCircle
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      className="mb-2"
                    />
                  )}
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control
                    type="file"
                    name="picture"
                    accept="image/*"
                    onChange={uploadHandler}
                  />
                  {loadingUpload && (
                    <Spinner animation="border" size="sm" className="mt-2" />
                  )}
                </Form.Group>

                {/* Text fields */}
                {[
                  { label: 'Name', name: 'name', type: 'text' },
                  { label: 'Email', name: 'email', type: 'email' },
                  { label: 'Age', name: 'age', type: 'number' },
                  { label: 'Weight (kg)', name: 'weight', type: 'number' },
                  { label: 'Height (cm)', name: 'height', type: 'number' },
                ].map(({ label, name, type }) => (
                  <Form.Group controlId={name} className="mb-3" key={name}>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                    />
                  </Form.Group>
                ))}

                <Form.Group controlId="gender" className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Choose…</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="activityLevel" className="mb-3">
                  <Form.Label>Activity Level</Form.Label>
                  <Form.Select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                  >
                    <option value="">Choose…</option>
                    <option>Sedentary</option>
                    <option>Lightly Active</option>
                    <option>Moderately Active</option>
                    <option>Very Active</option>
                  </Form.Select>
                </Form.Group>

                {/* Password */}
                <Row>
                  <Col>
                    <Form.Group controlId="password" className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="confirmPassword" className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={loadingUpdate}
                >
                  {loadingUpdate ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* GOAL CARD */}
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">My Goal</Card.Header>
            <Card.Body>
              {loadingGoal ? (
                <Loader />
              ) : errorGoal ? (
                <Message variant="danger">
                  {errorGoal.data?.message || errorGoal.error}
                </Message>
              ) : goal ? (
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Type:</strong> {goal.goalType}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Target Weight:</strong>{' '}
                    {goal.targetWeight || '—'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Calories/day:</strong> {goal.dailyCalorieGoal}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Protein:</strong>{' '}
                    {goal.dailyMacrosGoal.protein} g
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Carbs:</strong>{' '}
                    {goal.dailyMacrosGoal.carbohydrates} g
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Fats:</strong> {goal.dailyMacrosGoal.fat} g
                  </ListGroup.Item>
                </ListGroup>
              ) : (
                <Message>
                  No goal set. <a href="/goals">Set your goal now</a>
                </Message>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;
