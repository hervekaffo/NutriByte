import { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { useCreateMealMutation } from '../slices/mealsApiSlice';
import { resetMeal } from '../slices/mealSlice';

const SaveLogScreen = () => {
  const { mealItems } = useSelector((state) => state.meal);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // yyyy-mm-dd

  // New state for manual entry
  const [totalCalories, setTotalCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const [createMeal, { isLoading, error }] = useCreateMealMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    // Base payload: date + foods
    const payload = {
      date,
      foods: mealItems.map((item) => ({
        foodId:   item._id,
        quantity: item.qty,
      })),
    };

    // If user filled in totals, include overrideTotals
    if (totalCalories) {
      payload.overrideTotals = {
        totalCalories: parseFloat(totalCalories),
        totalMacros: {
          protein: parseFloat(protein) || 0,
          carbs:   parseFloat(carbs)   || 0,
          fats:    parseFloat(fats)    || 0,
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
      <h3>Finish and Save Your Meal</h3>
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
            value={totalCalories}
            onChange={(e) => setTotalCalories(e.target.value)}
            placeholder="Enter total calories"
          />
        </Form.Group>

        <Form.Group controlId="protein" className="my-2">
          <Form.Label>Protein (g)</Form.Label>
          <Form.Control
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder="Enter protein grams"
          />
        </Form.Group>

        <Form.Group controlId="carbs" className="my-2">
          <Form.Label>Carbs (g)</Form.Label>
          <Form.Control
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="Enter carbs grams"
          />
        </Form.Group>

        <Form.Group controlId="fats" className="my-2">
          <Form.Label>Fats (g)</Form.Label>
          <Form.Control
            type="number"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
            placeholder="Enter fats grams"
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading
            ? <Spinner animation="border" size="sm" />
            : 'Save and Finish'}
        </Button>
      </Form>

      {error && (
        <p className="text-danger mt-2">
          {error.data?.message || error.error}
        </p>
      )}
    </FormContainer>
  );
};

export default SaveLogScreen;
