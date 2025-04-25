// src/screens/GoalScreen.jsx

import { useState, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Message       from '../components/Message';
import { useNavigate } from 'react-router-dom';
import {
  useGetMyGoalQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation
} from '../slices/goalsApiSlice';

const GoalScreen = () => {
  const navigate = useNavigate();

  // Try to fetch the current user's goal
  const {
    data: goal,
    isLoading,
    isError,
    error
  } = useGetMyGoalQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  const [createGoal] = useCreateGoalMutation();
  const [updateGoal] = useUpdateGoalMutation();

  // Form state
  const [goalType, setGoalType]             = useState('');
  const [targetWeight, setTargetWeight]     = useState('');
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState('');
  const [protein, setProtein]               = useState('');
  const [carbs, setCarbs]                   = useState('');
  const [fats, setFats]                     = useState('');
  const [submitError, setSubmitError]       = useState(null);

  // When the goal comes back, populate the form
  useEffect(() => {
    if (goal) {
      setGoalType(goal.goalType);
      setTargetWeight(goal.targetWeight || '');
      setDailyCalorieGoal(goal.dailyCalorieGoal);
      if (goal.dailyMacrosGoal) {
        setProtein(goal.dailyMacrosGoal.protein);
        setCarbs(goal.dailyMacrosGoal.carbohydrates);
        setFats(goal.dailyMacrosGoal.fat);
      }
    }
  }, [goal]);

  // Decide if we’re in “create” mode (no goal) vs “edit” mode
  const isNotFound = isError && error.status === 404;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        goalType,
        targetWeight: targetWeight || null,
        dailyCalorieGoal,
        dailyMacrosGoal: { protein, carbs, fats }
      };

      if (goal) {
        await updateGoal({ id: goal._id, ...payload }).unwrap();
      } else {
        await createGoal(payload).unwrap();
      }

      navigate('/profile');
    } catch (err) {
      setSubmitError(err.data?.message || err.error);
    }
  };

  if (isLoading) return <Spinner />;

  // Only show an error if it's *not* a 404 (i.e. something really broke)
  if (isError && error.status !== 404) {
    return <Message variant="danger">{error.data?.message || error.error}</Message>;
  }

  return (
    <FormContainer>
      <h1>{goal ? 'Edit Your Goal' : 'Set Your Goal'}</h1>
      {submitError && <Message variant="danger">{submitError}</Message>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="goalType" className="mb-3">
          <Form.Label>Goal Type</Form.Label>
          <Form.Select
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
            required
          >
            <option value="">Choose…</option>
            <option>Weight Loss</option>
            <option>Muscle Gain</option>
            <option>Maintenance</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="targetWeight" className="mb-3">
          <Form.Label>Target Weight (optional)</Form.Label>
          <Form.Control
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="dailyCalorieGoal" className="mb-3">
          <Form.Label>Daily Calorie Goal</Form.Label>
          <Form.Control
            type="number"
            value={dailyCalorieGoal}
            onChange={(e) => setDailyCalorieGoal(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="protein" className="mb-3">
          <Form.Label>Protein (g)</Form.Label>
          <Form.Control
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="carbs" className="mb-3">
          <Form.Label>Carbs (g)</Form.Label>
          <Form.Control
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="fats" className="mb-3">
          <Form.Label>Fats (g)</Form.Label>
          <Form.Control
            type="number"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          {goal ? 'Update Goal' : 'Create Goal'}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default GoalScreen;
