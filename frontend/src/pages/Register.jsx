import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/register', data);
      login(response.data.token, response.data.user);
      toast.success('Account created!');
    } catch (error) {
      toast.error(error.response.data.error || 'Registration failed');
    }
  };

  return (
<div className="hero min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 animate-gradient-x">
      <div className="hero-content flex-col lg:flex-row-reverse gap-12">
        <div className="text-center lg:text-left lg:max-w-md">
          <img src="https://cdn-icons-png.flaticon.com/512/3445/3445520.png" alt="Register" className="w-48 h-48 mx-auto lg:mx-0 mb-6 shadow-2xl" />
          <h1 className="text-5xl font-bold text-white">Join Task Manager</h1>
          <p className="py-6 text-white/90">Create account to track your tasks with analytics & insights</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <h2 className="card-title text-2xl text-center">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  className="input input-bordered" 
                  {...register('email', { required: 'Email required' })} 
                />
                {errors.email && <span className="label-text-alt text-error">{errors.email.message}</span>}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input 
                  type="password" 
                  className="input input-bordered" 
                  {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 chars' } })} 
                />
                {errors.password && <span className="label-text-alt text-error">{errors.password.message}</span>}
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </div>
              <div className="text-center mt-4">
                <button 
                  onClick={() => navigate('/login')} 
                  className="link link-hover"
                >
                  Already have account? Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

