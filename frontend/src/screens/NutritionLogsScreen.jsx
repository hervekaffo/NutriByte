import React from 'react';
import { useGetNutritionLogsQuery } from '../slices/mealsApiSlice';
import { useGetMyGoalQuery }         from '../slices/goalsApiSlice';
import { Table, Spinner }            from 'react-bootstrap';
import Message                       from '../components/Message';
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
  const {
    data: logs = [],
    isLoading: loadingLogs,
    error: errorLogs
  } = useGetNutritionLogsQuery();
  const {
    data: goal,
    isLoading: loadingGoal,
    error: errorGoal
  } = useGetMyGoalQuery();

  if (loadingLogs || loadingGoal) return <Spinner />;
  if (errorLogs) return <Message variant="danger">{errorLogs.data?.message || errorLogs.error}</Message>;
  if (errorGoal) return <Message variant="danger">{errorGoal.data?.message || errorGoal.error}</Message>;

  // sort logs by date
  const sorted = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const labels = sorted.map(l => new Date(l.date).toLocaleDateString());
  const calories = sorted.map(l => l.totalCalories);
  const calorieGoal = goal.dailyCalorieGoal;

  // latest log macros
  const latest = sorted[sorted.length - 1] || { totalMacros: { protein: 0, carbs: 0, fats: 0 } };
  const macroLabels = ['Protein (g)', 'Carbs (g)', 'Fats (g)'];

  // Chart datasets
  const lineData = {
    labels,
    datasets: [
      {
        label: 'Consumed',
        data: calories,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Goal',
        data: labels.map(() => calorieGoal),
        borderColor: 'rgba(255,99,132,1)',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      }
    ]
  };

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
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
      {
        label: 'Goal',
        data: [
          goal.dailyMacrosGoal.protein,
          goal.dailyMacrosGoal.carbohydrates,
          goal.dailyMacrosGoal.fat
        ],
        backgroundColor: 'rgba(255,99,132,0.6)',
      }
    ]
  };

  const pieData = {
    labels: macroLabels,
    datasets: [
      {
        label: 'Macro Distribution',
        data: [
          latest.totalMacros.protein,
          latest.totalMacros.carbs,
          latest.totalMacros.fats
        ],
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
        borderWidth: 1
      }
    ]
  };

  // Shared chart options
  const baseOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  };

  return (
    <>
          {/* Data Table */}
          <h2 className="mt-5">Your Daily Nutrition Logs</h2>
      <Table striped bordered hover responsive className="mt-3">
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
          {sorted.map(log => (
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
      <h2 className="mb-4">Nutrition Progress</h2>

      {/* Line Chart: Calories vs Goal */}
      <div style={{ height: '300px' }} className="mb-5">
        <Line
          data={lineData}
          options={{
            ...baseOptions,
            plugins: {
              ...baseOptions.plugins,
              title: { display: true, text: 'Daily Calories vs. Goal' }
            },
            scales: {
              y: { title: { display: true, text: 'Calories' } },
              x: { title: { display: true, text: 'Date' } }
            }
          }}
        />
      </div>

      {/* Bar Chart: Latest vs Macros Goal */}
      <div style={{ height: '300px' }} className="mb-5">
        <Bar
          data={barData}
          options={{
            ...baseOptions,
            plugins: {
              ...baseOptions.plugins,
              title: { display: true, text: 'Latest Macros vs. Goal' }
            },
            scales: {
              y: { title: { display: true, text: 'Grams' } },
              x: { title: { display: true, text: 'Macro' } }
            }
          }}
        />
      </div>

      {/* Pie Chart: Macro Distribution */}
      <h3 className="mt-5 mb-3">Macro Distribution (Latest Log)</h3>
      <div style={{ height: '300px', maxWidth: '400px', margin: '0 auto' }}>
        <Pie
          data={pieData}
          options={{
            ...baseOptions,
            plugins: {
              ...baseOptions.plugins,
              title: { display: true, text: 'Macros Consumed Breakdown' },
              legend: { position: 'bottom' }
            }
          }}
        />
      </div>
    </>
  );
};

export default NutritionLogsScreen;
