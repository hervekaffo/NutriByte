import { Carousel, Image } from 'react-bootstrap';

const InfoCarousel = () => {
  return(
  <Carousel>
  <Carousel.Item interval={5000}>
    <Image
      className="d-block w-100"
      src="/images/Nutrition_breakdown.jpg"
      alt="First slide"
      style={{ height: '500px', objectFit: 'cover' }}
    />
    <Carousel.Caption>
      <h3>Track your Meals Log</h3>
      <p>See the Summary of what you eat Dayly.</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item interval={5000}>
  <Image
      className="d-block w-100"
      src="/images/Nutrition_progress.jpg"
      alt="First slide"
      style={{ height: '500px', objectFit: 'cover' }}
    />
    <Carousel.Caption>
      <h3>Monitor your Calories Intake</h3>
      <p>See You calories compared to goals you set.</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
  <Image
      className="d-block w-100"
      src="/images/AI_suggestions.jpg"
      alt="First slide"
      style={{ height: '500px', objectFit: 'cover' }}
    />
    <Carousel.Caption>
      <h3>Make Nutrition Decisions</h3>
      <p>
        See The suggestions made by Nutribite and take control of your Health.
      </p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
  <Image
      className="d-block w-100"
      src="/images/pic3.jpg"
      alt="First slide"
      style={{ height: '500px', objectFit: 'cover' }}
    />
    <Carousel.Caption>
      <h3>Enjoy Your Healthy Diet</h3>
      <p>
        Improve you Health with better Nutrition choices.
      </p>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>
    
  );
};
export default InfoCarousel;
