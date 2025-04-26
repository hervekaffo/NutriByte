import React, { useState } from 'react';
import { useGetNutritionLogsQuery, useGetNutritionLogByDateQuery } from '../slices/mealsApiSlice';
import { useGetMyGoalQuery }          from '../slices/goalsApiSlice';
import { useGetNutritionSuggestionQuery } from '../slices/mealsApiSlice';
import { Table, Spinner, Modal, Button, ListGroup, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message                        from '../components/Message';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const NutritionLogsScreen = () => {
  // Fetch all logs & goal
  const { data: logs = [], isLoading: loadingLogs, error: errorLogs } = useGetNutritionLogsQuery();
  const { data: goal, isLoading: loadingGoal, error: errorGoal }   = useGetMyGoalQuery();
  const { data: suggestionData, isLoading: loadingSuggestion, error: suggestionError } =
  useGetNutritionSuggestionQuery();

  // State for modal
  const [showModal, setShowModal]     = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleRowClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  if (loadingLogs || loadingGoal) return <Spinner />;
  if (errorLogs)  return <Message variant="danger">{errorLogs.data?.message || errorLogs.error}</Message>;
  if (errorGoal)  return <Message variant="danger">{errorGoal.data?.message || errorGoal.error}</Message>;
  if (!goal) {
    return (
      <Message>
        No goal set.{' '}
        <Link to="/goals">
          Set your goal now
        </Link>
      </Message>
    );
  }
  // Prepare chart data
  const sorted = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const labels   = sorted.map(l => new Date(l.date).toLocaleDateString());
  const calories = sorted.map(l => l.totalCalories);
  const calorieGoal = goal.dailyCalorieGoal;

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Consumed',
        data: calories,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Goal',
        data: labels.map(() => calorieGoal),
        borderColor: 'rgba(255,99,132,1)',
        borderDash: [5,5],
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const latest = sorted[sorted.length - 1] || { totalMacros: { protein:0, carbs:0, fats:0 } };
  const macroLabels = ['Protein (g)','Carbs (g)','Fats (g)'];
  const barData = {
    labels: macroLabels,
    datasets: [
      {
        label: 'Consumed',
        data: [
          latest.totalMacros.protein,
          latest.totalMacros.carbs,
          latest.totalMacros.fats
        ],
        backgroundColor: 'rgba(75,192,192,0.6)'
      },
      {
        label: 'Goal',
        data: [
          goal.dailyMacrosGoal.protein,
          goal.dailyMacrosGoal.carbohydrates,
          goal.dailyMacrosGoal.fat
        ],
        backgroundColor: 'rgba(255,99,132,0.6)'
      }
    ]
  };

  const proteinCal = latest.totalMacros.protein * 4;
  const carbsCal   = latest.totalMacros.carbs   * 4;
  const fatsCal    = latest.totalMacros.fats    * 9;
  const pieData = {
    labels: ['Protein Cal','Carb Cal','Fat Cal'],
    datasets: [{
      data: [proteinCal, carbsCal, fatsCal],
      backgroundColor: [
        'rgba(75,192,192,0.6)',
        'rgba(255,205,86,0.6)',
        'rgba(255,99,132,0.6)'
      ],
      borderColor: [
        'rgba(75,192,192,1)',
        'rgba(255,205,86,1)',
        'rgba(255,99,132,1)'
      ],
      borderWidth:1
    }]
  };

  const baseOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: { legend:{position:'top'} }
  };

  return (
    <>
     <h2 className="mt-5">Your Daily Nutrition Logs</h2>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Date</th><th>Calories</th><th>Protein</th>
            <th>Carbs</th><th>Fats</th><th>% Calorie Goal</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(log => (
            <tr key={log.date} style={{cursor:'pointer'}}
                onClick={() => handleRowClick(log.date)}>
              <td>{new Date(log.date).toLocaleDateString()}</td>
              <td>{log.totalCalories}</td>
              <td>{log.totalMacros.protein}</td>
              <td>{log.totalMacros.carbs}</td>
              <td>{log.totalMacros.fats}</td>
              <td>
  {log.progressTowardsGoal?.calories != null
    ? `${log.progressTowardsGoal.calories.toFixed(1)}%`
    : '—'}
</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Card className="mt-4 shadow-sm">
      <Card.Header as="h5" className="bg-primary text-white">
        AI Nutrition Suggestions
      </Card.Header>
      <Card.Body>
        {loadingSuggestion && (
          <div className="text-center py-3">
            <Spinner animation="border" role="status" />
          </div>
        )}
        {suggestionError && (
          <Message variant="danger">
            {suggestionError.data?.message || suggestionError.error}
          </Message>
        )}
        {suggestionData?.suggestion && (
          <ListGroup variant="flush">
            {suggestionData.suggestion
              .split('\n')
              .map((line) => line.trim())
              .filter((line) => line)
              .map((line, idx) => (
                <ListGroup.Item key={idx}>
                  <span className="fw-bold me-2">•</span>
                  {line.replace(/^•?\s*/, '')}
                </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>

      <h2 className="mb-4">Nutrition Progress</h2>

      <div style={{ height:'300px' }} className="mb-5">
        <Line
          data={lineData}
          options={{
            ...baseOptions,
            plugins: {
              ...baseOptions.plugins,
              title:{display:true, text:'Daily Calories vs. Goal'}
            },
            scales: {
              y:{title:{display:true, text:'Calories'}},
              x:{title:{display:true, text:'Date'}}
            }
          }}
        />
      </div>

      <div style={{ height:'300px' }} className="mb-5">
        <Bar
          data={barData}
          options={{
            ...baseOptions,
            plugins: {
              ...baseOptions.plugins,
              title:{display:true, text:'Latest Macros vs. Goal (g)'}
            },
            scales: {
              y:{title:{display:true, text:'Grams'}},
              x:{title:{display:true, text:'Macro'}}
            }
          }}
        />
      </div>

      <h3 className="mt-5 mb-3">Nutrients Breakdown of Latest Log</h3>
      <div style={{ height:'300px', maxWidth:'400px', margin:'0 auto' }}>
        <Pie
          data={pieData}
          options={{
            ...baseOptions,
            plugins: {
              ...baseOptions.plugins,
              title:{display:true, text:'Nutrients by Macro'},
              legend:{position:'bottom'}
            }
          }}
        />
      </div>


      {/* Modal for single log */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedDate
              ? `Log Details: ${new Date(selectedDate).toLocaleDateString()}`
              : 'Log Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDate && <SingleLogDetail date={selectedDate} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Component to fetch & render one log's details
const SingleLogDetail = ({ date }) => {
  const { data: log, isLoading, error } = useGetNutritionLogByDateQuery(date);

  if (isLoading) return <Spinner />;
  if (error)   return <Message variant="danger">{error.data?.message || error.error}</Message>;

  return (
    <ListGroup variant="flush">
      <ListGroup.Item><strong>Date:</strong> {new Date(log.date).toLocaleString()}</ListGroup.Item>
      <ListGroup.Item><strong>Meal Type:</strong> {log.mealType}</ListGroup.Item>
      <ListGroup.Item><strong>Total Calories:</strong> {log.totalCalories}</ListGroup.Item>
      <ListGroup.Item>
        <strong>Protein:</strong> {log.totalMacros.protein} g
      </ListGroup.Item>
      <ListGroup.Item>
        <strong>Carbs:</strong> {log.totalMacros.carbs} g
      </ListGroup.Item>
      <ListGroup.Item>
        <strong>Fats:</strong> {log.totalMacros.fats} g
      </ListGroup.Item>
    </ListGroup>
  );
};

export default NutritionLogsScreen;
