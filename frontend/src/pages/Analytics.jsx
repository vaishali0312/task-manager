import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get('/analytics');
      // Format data for charts (fill missing categories)
      const statusData = ['Todo', 'In Progress', 'Done'].map(status => {
        const item = response.data.tasksByStatus.find(s => s._id === status);
        return item ? item.count : 0;
      });

      const priorityData = ['Low', 'Medium', 'High'].map(priority => {
        const item = response.data.tasksByPriority.find(p => p._id === priority);
        return item ? item.count : 0;
      });

      setAnalytics({
        ...response.data,
        tasksByStatusFormatted: statusData,
        tasksByPriorityFormatted: priorityData,
        statusLabels: ['Todo', 'In Progress', 'Done'],
        priorityLabels: ['Low', 'Medium', 'High']
      });
    } catch (error) {
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="loading loading-spinner loading-lg"></div>
      <p>Loading analytics...</p>
    </div>
  );

  if (!analytics) return <div className="text-center py-12">No analytics data available</div>;

  const pieData = {
    labels: analytics.statusLabels,
    datasets: [{
      data: analytics.tasksByStatusFormatted,
      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
      borderWidth: 2,
      borderColor: '#ffffff',
    }],
  };

  const barData = {
    labels: analytics.priorityLabels,
    datasets: [{
      label: 'Number of Tasks',
      data: analytics.tasksByPriorityFormatted,
      backgroundColor: '#3b82f6',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="stat-title">Total Tasks</div>
          <div className="stat-value">{analytics.totalTasks}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-success">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="stat-title">Completed</div>
          <div className="stat-value text-success">{analytics.completedTasks}</div>
          <div className="stat-desc">{analytics.completionPercentage}%</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-warning">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">{analytics.pendingTasks}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-error">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="stat-title">Overdue</div>
          <div className="stat-value text-error">{analytics.overdueTasks}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Pie Chart */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">📊 Tasks by Status</h3>
            <div className="h-96">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Priority Bar Chart */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">📈 Tasks by Priority</h3>
            <div className="h-96">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="card-actions justify-end">
        <button className="btn btn-outline btn-wide" onClick={fetchAnalytics}>
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default Analytics;

