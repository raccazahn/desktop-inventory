import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCurrentUser, getUserRole } from '../utils/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, available: 0, checkedOut: 0, overdue: 0 });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = getCurrentUser();
  const role = getUserRole();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async function() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found!');
        return;
      }

      const headers = { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      };

      // Fetch equipment from backend
      const equipRes = await axios.get('http://localhost:3000/api/equipment', { headers });
      
      // Fetch checkouts from backend
      const checkoutRes = await axios.get('http://localhost:3000/api/checkouts', { headers });
      
      var equipment = equipRes.data || [];
      var checkouts = checkoutRes.data || [];
      
      // Calculate REAL stats from backend data
      var total = equipment.length;
      var available = equipment.filter(function(e) { return e.status === 'Available'; }).length;
      var checkedOut = equipment.filter(function(e) { return e.status === 'In Use' || e.status === 'borrowed'; }).length;
      
      setStats({
        total: total,
        available: available,
        checkedOut: checkedOut,
        overdue: 0
      });
      
      // Get recent activity from checkouts
      var recentActivity = checkouts.slice(0, 5).map(function(c) {
        var equipName = c.equipment && c.equipment.name ? c.equipment.name : 'Equipment';
        var borrower = c.borrowerName ? c.borrowerName : 'Unknown';
        var actionText = c.status === 'returned' ? 'Equipment Returned' : 'Equipment Checked Out';
        var timeText = new Date(c.createdAt || c.checkoutDate).toLocaleString();
        
        return {
          id: c.id,
          action: actionText,
          details: equipName + ' - ' + borrower,
          time: timeText
        };
      });
      
      setActivity(recentActivity);
    } catch (err) {
      console.error('Error fetching dashboard ', err);
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const goToEquipment = function() { navigate('/equipment'); };
  const goToCheckout = function() { navigate('/checkout'); };
  const goToCheckoutHistory = function() { navigate('/admin/checkouts'); };
  const goToReports = function() { navigate('/reports'); };
  const goToAddEquipment = function() { navigate('/equipment'); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navbar is in App.js */}
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 py-10">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
          <p className="text-slate-400 mt-3">Real-time inventory overview</p>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8">
        {/* Quick Action Buttons - Role Based */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            {/* Equipment - All roles can view */}
            <button onClick={goToEquipment} className="btn-secondary flex items-center">
              <span className="mr-2">💻</span> View Equipment
            </button>
            
            {/* Checkout - Admin, Technician, Faculty */}
            {(role === 'admin' || role === 'technician' || role === 'faculty') && (
              <button onClick={goToCheckout} className="btn-primary flex items-center">
                <span className="mr-2">📋</span> New Checkout
              </button>
            )}
            
            {/* Checkout History - Admin, Technician */}
            {(role === 'admin' || role === 'technician') && (
              <button onClick={goToCheckoutHistory} className="btn-secondary flex items-center">
                <span className="mr-2">📦</span> Checkout History
              </button>
            )}
            
            {/* Reports - Admin, Technician */}
            {(role === 'admin' || role === 'technician') && (
              <button onClick={goToReports} className="btn-secondary flex items-center">
                <span className="mr-2">📊</span> Reports
              </button>
            )}
            
            {/* Add Equipment - Admin, Technician only */}
            {(role === 'admin' || role === 'technician') && (
              <button onClick={goToAddEquipment} className="btn-success flex items-center">
                <span className="mr-2">➕</span> Add Equipment
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Equipment</p>
                <p className="text-4xl font-bold text-indigo-400">
                  {loading ? '...' : stats.total}
                </p>
              </div>
              <div className="bg-indigo-500/20 p-3 rounded-xl">
                <span className="text-2xl">💻</span>
              </div>
            </div>
          </div>

          <div className="card p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Available</p>
                <p className="text-4xl font-bold text-emerald-400">
                  {loading ? '...' : stats.available}
                </p>
              </div>
              <div className="bg-emerald-500/20 p-3 rounded-xl">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="card p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Checked Out</p>
                <p className="text-4xl font-bold text-amber-400">
                  {loading ? '...' : stats.checkedOut}
                </p>
              </div>
              <div className="bg-amber-500/20 p-3 rounded-xl">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>

          <div className="card p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Overdue</p>
                <p className="text-4xl font-bold text-red-400">
                  {loading ? '...' : stats.overdue}
                </p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-xl">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Recent Activity</h2>
          {loading ? (
            <div className="text-slate-400">Loading...</div>
          ) : activity.length === 0 ? (
            <div className="text-slate-400">No recent activity</div>
          ) : (
            <div className="space-y-4">
              {activity.map(function(item) {
                return (
                  <div key={item.id} className="flex items-center p-4 bg-slate-700/30 rounded-xl">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center mr-4">📋</div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-100">{item.action}</p>
                      <p className="text-sm text-slate-400">{item.details}</p>
                    </div>
                    <span className="text-sm text-slate-500">{item.time}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;