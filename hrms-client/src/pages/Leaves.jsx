import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Plus, MessageSquare, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'sick',
    from: '',
    to: '',
    reason: ''
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/leaves/my');
      setLeaves(res.data.leaves);
    } catch (err) {
      toast.error('Failed to fetch leave history');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/api/leaves', formData);
      toast.success('Leave applied successfully!');
      setShowModal(false);
      setFormData({ leaveType: 'sick', from: '', to: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply leave');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leave Management</h1>
          <p className="text-gray-500 text-sm">Request and track your leave applications</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Apply for Leave</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Request Leave</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Leave Type</label>
                <select 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500"
                  value={formData.leaveType}
                  onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                >
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="paid">Paid Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">From</label>
                  <input 
                    type="date" 
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500"
                    value={formData.from}
                    onChange={(e) => setFormData({...formData, from: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">To</label>
                  <input 
                    type="date" 
                    required
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500"
                    value={formData.to}
                    onChange={(e) => setFormData({...formData, to: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Reason</label>
                <textarea 
                  required
                  rows="3"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Why are you taking leave?"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Available Paid Leaves', count: '12', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Sick Leaves Left', count: '8', color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Pending Requests', count: leaves.filter(l => l.status === 'pending').length, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Application History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Duration</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaves.map((leave) => (
                <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="capitalize px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                      {leave.leaveType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex flex-col">
                      <span>{new Date(leave.from).toLocaleDateString()} - {new Date(leave.to).toLocaleDateString()}</span>
                      <span className="text-xs text-gray-400 font-medium">{leave.totalDays} Days</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{leave.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`capitalize inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                      leave.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {leave.status === 'approved' && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                      {leave.status === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>}
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leaves.length === 0 && !loading && (
            <div className="p-20 text-center text-gray-500">You haven't applied for any leaves yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaves;
