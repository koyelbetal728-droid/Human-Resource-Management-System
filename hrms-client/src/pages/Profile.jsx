import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, MapPin, Briefcase, Building, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-100 uppercase">
          {user?.name?.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
          <p className="text-gray-500 font-medium capitalize">{user?.role} • {user?.employeeId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-4 mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="flex items-start gap-3">
                <Mail className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="text-gray-700 font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Phone</p>
                  <p className="text-gray-700 font-medium">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:col-span-2">
                <MapPin className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Address</p>
                  <p className="text-gray-700 font-medium">123 Business Bay, Whitefield, Bangalore, Karnataka</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-4 mb-4">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="flex items-start gap-3">
                <Building className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Department</p>
                  <p className="text-gray-700 font-medium">{user?.department || 'Not Assigned'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Position</p>
                  <p className="text-gray-700 font-medium">{user?.position || 'Not Assigned'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Permissions</p>
                  <p className="text-gray-700 font-medium capitalize">{user?.role} Level</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Security</h3>
            <button className="w-full py-2.5 bg-gray-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors border border-indigo-100 mb-3">
              Change Password
            </button>
            <button className="w-full py-2.5 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-colors border border-gray-200">
              Enable 2FA
            </button>
          </div>

          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
            <h3 className="font-bold text-orange-800 mb-2">Notice</h3>
            <p className="text-sm text-orange-700">Please update your address if you have recently relocated for tax compliance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
