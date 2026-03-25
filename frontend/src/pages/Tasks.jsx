import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '' });
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, [filters, currentPage]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...filters
      });
      const response = await api.get(`/tasks?${params}`);
      setTasks(response.data.tasks);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, formData);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', formData);
        toast.success('Task created');
      }
      setShowModal(false);
      setFormData({ title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '' });
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      toast.error(error.response.data.error || 'Error saving task');
    }
  };

  const deleteTask = async (id) => {
    if (confirm('Delete task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        toast.success('Task deleted');
        fetchTasks();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const editTask = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    const params = new URLSearchParams(newFilters);
    setSearchParams(params);
  };

  return (
<div>
      <div className="mb-12">
        <img src="https://cdn-icons-png.flaticon.com/512/3870/3870589.png" alt="Tasks" className="w-24 h-24 mx-auto mb-6 opacity-50" />
        <h1 className="text-4xl font-bold text-center mb-6">My Tasks</h1>
      </div>
      <div className="mb-6 flex flex-wrap gap-4">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Task
        </button>
        <select 
          className="select select-bordered max-w-xs"
          value={filters.status}
          onChange={(e) => updateFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <select 
          className="select select-bordered max-w-xs"
          value={filters.priority}
          onChange={(e) => updateFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input 
          type="text"
          placeholder="Search tasks..."
          className="input input-bordered"
          value={filters.search}
          onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
        />
      </div>

      {loading ? (
        <div className="flex justify-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td><span className={`badge badge-${task.status === 'Done' ? 'success' : task.status === 'In Progress' ? 'warning' : 'secondary'}`}>{task.status}</span></td>
                  <td><span className={`badge badge-${task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'success'}`}>{task.priority}</span></td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-info mr-2" onClick={() => editTask(task)}>Edit</button>
                    <button className="btn btn-sm btn-error" onClick={() => deleteTask(task._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button 
              key={page}
              className={`btn ${currentPage == page ? 'btn-active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{editingTask ? 'Edit Task' : 'New Task'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input name="title" className="input input-bordered" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea name="description" className="textarea textarea-bordered" value={formData.description} onChange={handleInputChange} />
              </div>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select name="status" className="select select-bordered" value={formData.status} onChange={handleInputChange}>
                  <option>Todo</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>
              </div>
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Priority</span>
                </label>
                <select name="priority" className="select select-bordered" value={formData.priority} onChange={handleInputChange}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Due Date</span>
                </label>
                <input type="date" name="dueDate" className="input input-bordered" value={formData.dueDate} onChange={handleInputChange} />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn" onClick={() => {
                  setShowModal(false);
                  setEditingTask(null);
                  setFormData({ title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '' });
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;

