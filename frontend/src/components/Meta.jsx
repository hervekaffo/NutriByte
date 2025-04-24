import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{String(title)}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome To NutriByte',
  description: 'Nutition Decision Platform',
  keywords: 'Healthy, Nutrition, Food, Diet',
};

export default Meta;
