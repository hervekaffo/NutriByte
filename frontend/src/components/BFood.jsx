import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { getConsistentImage } from '../utils/imageUtils';
import { useEffect, useState } from 'react';

const BFood = ({ food }) => {
  const getRandomImage = (images) => {
    return images[Math.floor(Math.random() * images.length)].src;
  };

  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/food_images', {
          headers: {
            'Accept': 'application/json', // Explicitly request JSON response
          },
        }); // Assuming this endpoint returns the list of image names
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const data = await response.json();
            setImageList(data.map(image => ({ src: image, width: 300, height: 300 })));
            //console.log('Fetched images:', data);  
          } catch (error) {
          console.error('Unexpected content type:', contentType);
          setImageList([]); // Ensure imageList is reset to an empty array
            setImageList([]); // Fallback to an empty list if JSON parsing fails
          }
        } else {
          console.error('Unexpected content type:', contentType);
          if (contentType && contentType.includes('text/html')) {
            console.warn('Received HTML response. Please check the /food_images endpoint.');
          }
          setImageList([]); // Fallback to an empty list if response is not JSON
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const getConsistentImage = (images, key) => {
    const index = key
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) % images.length;
    return images[index]?.src;
  };

  return (
    <Card className='my-3 p-3 rounded'>
      {imageList.length > 0 && (
  <Link to={`/food/${food._id}`}>
  {imageList.length > 0 && (
    <Card.Img
      src={`/food_images/${getConsistentImage(imageList, food._id)}`}
      variant='top'
      style={{ height: '200px', objectFit: 'cover' }}
    />
  )}
</Link>
)}


      <Card.Body>
        <Link to={`/food/${food._id}`}>
          <Card.Title as='div' className='food-title'>
            <strong>{food.brandOwner}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={food.rating}
            text={`${food.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3'>{food.brandedFoodCategory}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default BFood;
