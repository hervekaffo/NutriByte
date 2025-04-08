import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
//import { saveShippingAddress } from '../slices/cartSlice';

const SaveLogScreen = () => {
  const meal = useSelector((state) => state.meal);


  //const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    navigate('');
  };

  return (
    <FormContainer>
      <h3>Finish and Save To your Meals Log</h3>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='mealType'>
          <Form.Label>Meal Type</Form.Label>
          <Form.Control as='select' required>
            <option value=''>Select...</option>
            <option value='Breakfast'>Breakfast</option>
            <option value='Lunch'>Lunch</option>
            <option value='Dinner'>Dinner</option>
            <option value='Snack'>Snack</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='address'>
          <Form.Label>Calories</Form.Label>
          <Form.Control
            type='text'
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='city'>
          <Form.Label>Satured Fat</Form.Label>
          <Form.Control
            type='text'
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='postalCode'>
          <Form.Label>Fibers</Form.Label>
          <Form.Control
            type='text'
            required
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Save and Finish
        </Button>
      </Form>
    </FormContainer>
  );
};

export default SaveLogScreen;
