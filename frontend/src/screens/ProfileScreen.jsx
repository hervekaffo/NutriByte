// frontend/src/screens/ProfileScreen.jsx

import React, { useState, useEffect } from 'react'
import {
  Container, Row, Col, Card, Form, Button, Spinner, ListGroup, Image
} from 'react-bootstrap'
import { useDispatch, useSelector }      from 'react-redux'
import { toast }                         from 'react-toastify'
import { useProfileMutation, useUploadMutation } from '../slices/usersApiSlice'
import { useGetMyGoalQuery }             from '../slices/goalsApiSlice'
import { setCredentials }                from '../slices/authSlice'
import Message                           from '../components/Message'
import Loader                            from '../components/Loader'

const ProfileScreen = () => {
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)

  // load current goal to show in read-only card
  const { data: goal, isLoading: loadingGoal, error: errorGoal } =
    useGetMyGoalQuery()

  // mutations
  const [updateProfile, { isLoading: loadingUpdate }] = useProfileMutation()
  const [uploadFile, { isLoading: loadingUpload }]    = useUploadMutation()

  // form state
  const [form, setForm] = useState({
    name: '', email: '', picture: '',
    age: '', weight: '', height: '',
    gender: 'Male', activityLevel: 'Sedentary',
    goal: 'Maintenance',
    dailyCalorieGoal: '',
    proteinGoal: '', carbsGoal: '', fatsGoal: '',
    password: '', confirmPassword: ''
  })
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (userInfo) {
      setForm(f => ({
        ...f,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        age: userInfo.age,
        weight: userInfo.weight,
        height: userInfo.height,
        gender: userInfo.gender,
        activityLevel: userInfo.activityLevel,
        goal: userInfo.goal || 'Maintenance',
        dailyCalorieGoal: userInfo.dailyCalorieGoal || '',
        proteinGoal: userInfo.dailyMacrosGoal?.protein || '',
        carbsGoal:   userInfo.dailyMacrosGoal?.carbs   || '',
        fatsGoal:    userInfo.dailyMacrosGoal?.fats    || ''
      }))
    }
  }, [userInfo])

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const uploadHandler = async e => {
    const file = e.target.files[0]
    if (!file) return
    const data = new FormData()
    data.append('picture', file)             // must match upload.single('picture')
    try {
      const { picture: url } = await uploadFile(data).unwrap()
      setForm(f => ({ ...f, picture: url }))
      toast.success('Upload successful')
    } catch (err) {
      toast.error(err.data?.message || err.error)
    }
  }

  const submitHandler = async e => {
    e.preventDefault()
    setMessage(null)
    if (form.password && form.password !== form.confirmPassword) {
      return setMessage('Passwords do not match')
    }
    try {
      const updated = await updateProfile({
        name: form.name,
        email: form.email,
        picture: form.picture,
        age: Number(form.age),
        weight: Number(form.weight),
        height: Number(form.height),
        gender: form.gender,
        activityLevel: form.activityLevel,
        goal: form.goal,                         // ← a string in ['Weight Loss','Maintenance','Muscle Gain']
        dailyCalorieGoal: Number(form.dailyCalorieGoal),
        dailyMacrosGoal: {                       // ← nested object
          protein: Number(form.proteinGoal),
          carbs:   Number(form.carbsGoal),
          fats:    Number(form.fatsGoal)
        },
        password: form.password || undefined
      }).unwrap()
      dispatch(setCredentials(updated))
      setMessage('Profile updated successfully')
      setForm(f => ({ ...f, password: '', confirmPassword: '' }))
    } catch (err) {
      setMessage(err.data?.message || err.error)
    }
  }

  return (
    <Container className="py-5">
      <Row className="g-4">
        {/* --- PROFILE FORM CARD --- */}
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              Edit Profile
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
                {/* Picture */}
                <Form.Group controlId="picture" className="mb-3 text-center">
                  {form.picture && (
                    <Image
                      src={form.picture}
                      roundedCircle
                      style={{ width: 100, height: 100, objectFit: 'cover' }}
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

                {/* Basic info */}
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Age / Weight / Height */}
                <Row>
                  <Col>
                    <Form.Group controlId="age" className="mb-3">
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        name="age"
                        type="number"
                        value={form.age}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="weight" className="mb-3">
                      <Form.Label>Weight (kg)</Form.Label>
                      <Form.Control
                        name="weight"
                        type="number"
                        value={form.weight}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="height" className="mb-3">
                      <Form.Label>Height (cm)</Form.Label>
                      <Form.Control
                        name="height"
                        type="number"
                        value={form.height}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Gender & Activity */}
                <Form.Group controlId="gender" className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="activityLevel" className="mb-3">
                  <Form.Label>Activity Level</Form.Label>
                  <Form.Select
                    name="activityLevel"
                    value={form.activityLevel}
                    onChange={handleChange}
                  >
                    <option>Sedentary</option>
                    <option>Lightly Active</option>
                    <option>Moderately Active</option>
                    <option>Very Active</option>
                  </Form.Select>
                </Form.Group>

                {/* Goal type & numeric goals */}
                <Form.Group controlId="goal" className="mb-3">
                  <Form.Label>Goal</Form.Label>
                  <Form.Select
                    name="goal"
                    value={form.goal}
                    onChange={handleChange}
                  >
                    <option>Lose Weight</option>  
                    <option>Maintain Weight</option>
                    <option>Gain Muscle</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="dailyCalorieGoal" className="mb-3">
                  <Form.Label>Daily Calorie Goal</Form.Label>
                  <Form.Control
                    name="dailyCalorieGoal"
                    type="number"
                    value={form.dailyCalorieGoal}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group controlId="proteinGoal" className="mb-3">
                      <Form.Label>Protein (g)</Form.Label>
                      <Form.Control
                        name="proteinGoal"
                        type="number"
                        value={form.proteinGoal}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="carbsGoal" className="mb-3">
                      <Form.Label>Carbs (g)</Form.Label>
                      <Form.Control
                        name="carbsGoal"
                        type="number"
                        value={form.carbsGoal}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="fatsGoal" className="mb-3">
                      <Form.Label>Fats (g)</Form.Label>
                      <Form.Control
                        name="fatsGoal"
                        type="number"
                        value={form.fatsGoal}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Password */}
                <Row>
                  <Col>
                    <Form.Group controlId="password" className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="confirmPassword" className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
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
                  {loadingUpdate ? <Spinner animation="border" size="sm" /> : 'Update Profile'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* --- GOAL DISPLAY CARD --- */}
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
                  <ListGroup.Item><strong>Type:</strong> {goal.goalType}</ListGroup.Item>
                  <ListGroup.Item><strong>Target Weight:</strong> {goal.targetWeight ?? '—'}</ListGroup.Item>
                  <ListGroup.Item><strong>Calories/day:</strong> {goal.dailyCalorieGoal}</ListGroup.Item>
                  <ListGroup.Item><strong>Protein:</strong> {goal.dailyMacrosGoal.protein} g</ListGroup.Item>
                  <ListGroup.Item><strong>Carbs:</strong>   {goal.dailyMacrosGoal.carbohydrates} g</ListGroup.Item>
                  <ListGroup.Item><strong>Fats:</strong>    {goal.dailyMacrosGoal.fat} g</ListGroup.Item>
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
  )
}

export default ProfileScreen
