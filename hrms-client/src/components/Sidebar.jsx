import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, ClipboardList, Wallet, Bell, LogOut, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['admin', 'hr', 'employee'] },
    { name: 'Employees', path: '/employees', icon: <Users size={20} />, roles: ['admin', 'hr'] },
    { name: 'Attendance', path: '/attendance', icon: <Calendar size={20} />, roles: ['admin', 'hr', 'employee'] },
    { name: 'Leaves', path: '/leaves', icon: <ClipboardList size={20} />, roles: ['admin', 'hr', 'employee'] },
    { name: 'Payroll', path: '/payroll', icon: <Wallet size={20} />, roles: ['admin', 'hr', 'employee'] },
    { name: 'Profile', path: '/profile', icon: <User size={20} />, roles: ['admin', 'hr', 'employee'] },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
        <span className="text-xl font-bold text-gray-800">NexHR</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          item.roles.includes(user?.role) && (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 mb-2">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold uppercase">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
