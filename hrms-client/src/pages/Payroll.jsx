import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, FileText, IndianRupee, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';

const Payroll = () => {
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/payroll/my');
      setPayroll(res.data.payroll);
    } catch (err) {
      toast.error('Failed to fetch payroll history');
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (num) => {
    return new Date(0, num - 1).toLocaleString('default', { month: 'long' });
  };

  const downloadPDF = (pay) => {
    const doc = new jsPDF();
    const month = getMonthName(pay.month);

    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo color
    doc.text('NexHR Solutions', 105, 20, null, 'center');

    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`Salary Slip - ${month} ${pay.year}`, 105, 30, null, 'center');

    // Line Separator
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Employee Details
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Employee ID: EMP0001`, 20, 50);
    doc.text(`Status: ${pay.status.toUpperCase()}`, 150, 50);

    // Salary Table
    doc.setFillColor(243, 244, 246);
    doc.rect(20, 60, 170, 10, 'F');
    doc.setFont(undefined, 'bold');
    doc.text('Description', 25, 66);
    doc.text('Amount (INR)', 150, 66);

    doc.setFont(undefined, 'normal');
    doc.text('Basic Salary', 25, 80);
    doc.text(`Rs. ${pay.basicSalary.toLocaleString()}`, 150, 80);

    doc.text('Take Home (Net)', 25, 90);
    doc.setFont(undefined, 'bold');
    doc.text(`Rs. ${pay.netSalary.toLocaleString()}`, 150, 90);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('This is a computer-generated document and does not require a signature.', 105, 120, null, 'center');

    doc.save(`Payslip_${month}_${pay.year}.pdf`);
    toast.success(`Downloading ${month} Payslip...`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Payroll & Salary</h1>
          <p className="text-gray-500 mt-1">Review your financial statements and earnings history.</p>
        </div>
        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-xl border border-gray-200 shadow-sm">
          <button className="px-5 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg shadow-md shadow-indigo-100 transition-all">My Earnings</button>
          <button className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Deductions</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Card */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-10 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest opacity-80">Annual Gross Projection</p>
                  <p className="text-5xl font-black mt-2 tracking-tight">₹18,00,000</p>
                </div>
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                  <TrendingUp className="text-white w-8 h-8" />
                </div>
              </div>
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
                  <p className="text-xs text-indigo-100 font-bold uppercase tracking-wider mb-1">Monthly Take Home</p>
                  <p className="text-2xl font-bold">₹1,38,500</p>
                </div>
                <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
                  <p className="text-xs text-indigo-100 font-bold uppercase tracking-wider mb-1">Monthly Taxes (TDS)</p>
                  <p className="text-2xl font-bold">₹11,500</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
          </div>

          {/* History Section */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-800">Payment History</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold ring-1 ring-green-200">2 Paid</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold ring-1 ring-orange-200">1 Pending</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {payroll.map((pay) => (
                <div key={pay._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50/80 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText size={28} />
                    </div>
                    <div>
                      <p className="font-bold text-xl text-gray-800">{getMonthName(pay.month)} {pay.year}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-indigo-600">₹{pay.netSalary.toLocaleString()}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400 font-medium tracking-wide">Ref: {pay._id.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className={`p-1.5 rounded-xl flex items-center gap-2 px-4 ${pay.status === 'paid' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'
                      }`}>
                      {pay.status === 'paid' ? <CheckCircle size={16} /> : <Clock size={16} />}
                      <span className="text-xs font-black uppercase tracking-widest">{pay.status}</span>
                    </div>
                    <button
                      onClick={() => downloadPDF(pay)}
                      className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-indigo-600 hover:text-white hover:rotate-12 transition-all duration-300"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {payroll.length === 0 && !loading && (
                <div className="p-20 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                    <FileText size={40} />
                  </div>
                  <p className="text-gray-400 font-bold text-lg">No Financial Records Found</p>
                  <p className="text-gray-400 text-sm mt-1">Check back later once the HR generates your payslip.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100">
            <h3 className="text-lg font-black text-gray-800 mb-6">Financial Summary</h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center group">
                <span className="text-gray-500 font-medium">Monthly TDS</span>
                <span className="font-bold text-gray-800 bg-gray-50 px-3 py-1 rounded-lg">₹11,500</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-gray-500 font-medium">Provident Fund (PF)</span>
                <span className="font-bold text-gray-800 bg-gray-50 px-3 py-1 rounded-lg">₹2,180</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-gray-500 font-medium">Other Deductions</span>
                <span className="font-bold text-gray-800 bg-gray-50 px-3 py-1 rounded-lg">₹0</span>
              </div>
              <div className="pt-6 mt-6 border-t border-gray-100 flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Deductions</p>
                  <p className="text-2xl font-black text-red-600 mt-1">₹13,680</p>
                </div>
                <div className="h-12 w-1 bg-red-100 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-3">Questions?</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">If you notice any discrepancies in your salary or tax deductions, please reach out to the finance team immediately.</p>
              <button className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 hover:scale-[1.02] shadow-xl shadow-indigo-900/40 transition-all active:scale-[0.98]">
                Raise Inquery
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
