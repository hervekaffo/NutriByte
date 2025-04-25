import { useGetNutritionLogsQuery } from '../slices/mealsApiSlice';
import { Table, Spinner } from 'react-bootstrap';
import Message from '../components/Message';

const NutritionLogsScreen = () => {
  const { data: logs, isLoading, error } = useGetNutritionLogsQuery();

  if (isLoading) return <Spinner />;
  if (error)   return <Message variant="danger">{error.data?.message || error.error}</Message>;

  return (
    <>
      <h2>Your Daily Nutrition Logs</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Calories</th>
            <th>Protein</th>
            <th>Carbs</th>
            <th>Fats</th>
            <th>% Calorie Goal</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.date}>
              <td>{new Date(log.date).toLocaleDateString()}</td>
              <td>{log.totalCalories}</td>
              <td>{log.totalMacros.protein}</td>
              <td>{log.totalMacros.carbs}</td>
              <td>{log.totalMacros.fats}</td>
              <td>
                {log.progressTowardsGoal.calories
                  ? `${log.progressTowardsGoal.calories.toFixed(1)}%`
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default NutritionLogsScreen;
