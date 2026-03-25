import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import { SunIcon, MoonIcon } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      html.classList.add('dark');
      localStorage.theme = 'dark';
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.theme || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="drawer lg:drawer-open">
      <input id="sidebar" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-100 shadow-lg">
          <div className="flex-none lg:hidden">
            <label htmlFor="sidebar" className="btn btn-square btn-ghost">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M0 0h20v20H0z" fill="none"/>
                <path d="M3 6h14v2H3V6zm0 5h14v2H3v-2zm0 5h10v2H3v-2z"/>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 text-xl font-bold">Task Manager</div>
          <div className="flex-none gap-2">
            <button onClick={toggleDarkMode} className="btn btn-ghost btn-xs">
              <span className="text-xl dark:hidden">☀️</span>
              <span className="text-xl hidden dark:block">🌙</span>
            </button>
            <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full flex items-center justify-center bg-primary">
<span className="text-xs font-bold">{user?.email?.split('@')[0][0]?.toUpperCase() || 'U'}</span>
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>
                  <button onClick={() => logout()}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="sidebar" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li><Link to="/dashboard/tasks">Tasks</Link></li>
          <li><Link to="/dashboard/analytics">Analytics</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Layout;
