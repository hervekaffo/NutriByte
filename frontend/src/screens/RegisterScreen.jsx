import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { useRegisterMutation, useUploadMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const RegisterScreen = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    age: '', weight: '', height: '',
    gender: 'Male', activityLevel: '',
    goal: 'Maintain Weight',
    dailyCalorieGoal: '', protein: '', carbs: '', fats: '',
  });
  const [pictureFile, setPictureFile] = useState(null);
  const [uploadUserImage] = useUploadMutation();
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const onFileChange = e => setPictureFile(e.target.files[0]);

  const submitHandler = async e => {
    e.preventDefault();
    let picture = '/images/user_images/default.jpg';

    if (pictureFile) {
      const fd = new FormData();
      fd.append('picture', pictureFile);
      const res = await uploadUserImage(fd).unwrap();
      picture = res.picture;
    }

    const registerData = {
      ...form,
      picture,
      dailyMacrosGoal: {
        protein: Number(form.protein),
        carbs: Number(form.carbs),
        fats: Number(form.fats),
      }
    };

    const user = await register(registerData).unwrap();
    dispatch(setCredentials(user));
    navigate('/');
  };

  return (
    <FormContainer>
      <h1>Register</h1>
      {isLoading && <Loader />}
      <Form onSubmit={submitHandler}>
        {/* Name, Email, Password */}
        <Form.Group controlId='name'><Form.Label>Name</Form.Label>
          <Form.Control name='name' value={form.name} onChange={onChange} required />
        </Form.Group>
        <Form.Group controlId='email'><Form.Label>Email</Form.Label>
          <Form.Control type='email' name='email' value={form.email} onChange={onChange} required />
        </Form.Group>
        <Form.Group controlId='password'><Form.Label>Password</Form.Label>
          <Form.Control type='password' name='password' value={form.password} onChange={onChange} required />
        </Form.Group>

        {/* Picture Upload */}
        <Form.Group controlId='picture'><Form.Label>Picture</Form.Label>
          <Form.Control type='file' onChange={onFileChange} accept='image/*' />
        </Form.Group>

        {/* Profile fields */}
        <Row>
          <Col><Form.Group controlId='age'><Form.Label>Age</Form.Label>
            <Form.Control type='number' name='age' value={form.age} onChange={onChange} required />
          </Form.Group></Col>
          <Col><Form.Group controlId='height'><Form.Label>Height (cm)</Form.Label>
            <Form.Control type='number' name='height' value={form.height} onChange={onChange} required />
          </Form.Group></Col>
          <Col><Form.Group controlId='weight'><Form.Label>Weight (kg)</Form.Label>
            <Form.Control type='number' name='weight' value={form.weight} onChange={onChange} required />
          </Form.Group></Col>
        </Row>

        <Form.Group controlId='gender'><Form.Label>Gender</Form.Label>
          <Form.Control as='select' name='gender' value={form.gender} onChange={onChange}>
            <option>Male</option><option>Female</option><option>Other</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='activityLevel'><Form.Label>Activity Level</Form.Label>
          <Form.Control as='select' name='activityLevel' value={form.activityLevel} onChange={onChange}>
            <option value=''>Select...</option>
            <option>Sedentary</option><option>Lightly Active</option>
            <option>Moderately Active</option><option>Very Active</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='goal'><Form.Label>Goal</Form.Label>
          <Form.Control as='select' name='goal' value={form.goal} onChange={onChange}>
            <option>Lose Weight</option>
            <option>Maintain Weight</option>
            <option>Gain Muscle</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='dailyCalorieGoal'><Form.Label>Daily Calorie Goal</Form.Label>
          <Form.Control type='number' name='dailyCalorieGoal' value={form.dailyCalorieGoal} onChange={onChange} required />
        </Form.Group>

        <Row>
          <Col><Form.Group controlId='protein'><Form.Label>Protein (g)</Form.Label>
            <Form.Control type='number' name='protein' value={form.protein} onChange={onChange} /></Form.Group>
          </Col>
          <Col><Form.Group controlId='carbs'><Form.Label>Carbs (g)</Form.Label>
            <Form.Control type='number' name='carbs' value={form.carbs} onChange={onChange} /></Form.Group>
          </Col>
          <Col><Form.Group controlId='fats'><Form.Label>Fats (g)</Form.Label>
            <Form.Control type='number' name='fats' value={form.fats} onChange={onChange} /></Form.Group>
          </Col>
        </Row>

        <Button type='submit' className='mt-3'>Register</Button>
      </Form>
    </FormContainer>
  );
};

export default RegisterScreen;
