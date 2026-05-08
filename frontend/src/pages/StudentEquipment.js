import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser, getUserRole } from '../utils/auth';

const StudentEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [formData, setFormData] = useState({
    dueDate: '',
    purpose: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const user = getCurrentUser();
  const role = getUserRole();

  useEffect(function() {
    console.log('🔥 StudentEquipment mounted');
    fetchData();
  }, []);

  const fetchData = async function() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token');
      }
      
      console.log('📡 Fetching available equipment...');
      var equipResponse = await axios.get('http://localhost:3000/api/equipment?status=Available', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setEquipment(equipResponse.data || []);

      console.log('📡 Fetching my requests...');
      var requestsResponse = await axios.get('http://localhost:3000/api/checkout-requests/my-requests', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setMyRequests(requestsResponse.data || []);
      
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError('Failed to load data. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClick = function(equip) {
    setSelectedEquipment(equip);
    setFormData({ dueDate: '', purpose: '' });
    setShowRequestModal(true);
  };

 // In handleSubmitRequest, ensure dueDate is in YYYY-MM-DD format:
const handleSubmitRequest = async function(e) {
  e.preventDefault();
  setSubmitting(true);
  setError('');
  setSuccess('');

  try {
    const token = localStorage.getItem('token');
    
    // ✅ Ensure dueDate is in YYYY-MM-DD format
    var dueDateValue = formData.dueDate;
    if (!dueDateValue || dueDateValue === '') {
      throw new Error('Please select a due date');
    }
    
    // If it's already a Date object, convert to string
    if (dueDateValue instanceof Date) {
      dueDateValue = dueDateValue.toISOString().split('T')[0];
    }
    
    console.log('📡 Submitting checkout request with dueDate:', dueDateValue);
    
    await axios.post('http://localhost:3000/api/checkout-requests', {
      equipmentId: selectedEquipment.id,
      borrowerName: user ? (user.username || user.email) : 'Unknown',
      borrowerEmail: user ? user.email : '',
      dueDate: dueDateValue,  // ✅ Send as YYYY-MM-DD string
      purpose: formData.purpose
    }, {
      headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Request submitted!');
    setSuccess('✓ Request submitted! Wait for admin approval.');
    setShowRequestModal(false);
    fetchData();
    setTimeout(function() { setSuccess(''); }, 4000);
    
  } catch (err) {
    console.error('❌ Error submitting request:', err);
    var errorMsg = '✗ ' + (err.response ? err.response.data.message : 'Error submitting request');
    setError(errorMsg);
    setTimeout(function() { setError(''); }, 5000);
  } finally {
    setSubmitting(false);
  }
};

  const getStatusBadge = function(status) {
    var styles = {
      pending: 'badge-warning',
      approved: 'badge-info',
      rejected: 'badge-danger',
      picked_up: 'badge-success',
      returned: 'badge-success'
    };
    return styles[status] || 'badge-info';
  };

  const getStatusText = function(status) {
    var texts = {
      pending: '⏳ Pending Approval',
      approved: '✅ Approved - Ready for Pickup',
      rejected: '❌ Rejected',
      picked_up: '📦 Picked Up',
      returned: '✓ Returned'
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-slate-300 text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-8">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 py-10">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold gradient-text">Available Equipment</h1>
          <p className="text-slate-400 mt-3">Request to borrow equipment for your projects</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {success && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl mb-6">{success}</div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">{error}</div>
        )}

        {/* My Requests Section */}
        {myRequests.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center">
              <span className="mr-2">📋</span> My Requests
            </h2>
            <div className="space-y-3">
              {myRequests.map(function(request) {
                if (!request) return null;
                return (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <div>
                      <div className="font-semibold text-slate-100">
                        {request.equipment && request.equipment.name ? request.equipment.name : 'Equipment'}
                      </div>
                      <div className="text-sm text-slate-400">
                        Due: {request.dueDate ? new Date(request.dueDate).toLocaleDateString() : '-'} • {request.purpose || 'No purpose'}
                      </div>
                    </div>
                    <span className={getStatusBadge(request.status)}>
                      {getStatusText(request.status)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Equipment Grid */}
        <h2 className="text-2xl font-bold text-slate-100 mb-6">Available for Request</h2>
        
        {equipment.length === 0 ? (
          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-slate-400 text-xl">No equipment available right now</p>
            <p className="text-slate-500 mt-2">Check back later or contact the lab administrator</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map(function(item) {
              if (!item) return null;
              return (
                <div key={item.id} className="card p-6 hover:shadow-2xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-xl">💻</span>
                      </div>
                      <div className="ml-4">
                        <div className="font-semibold text-slate-100">{item.name}</div>
                        <div className="text-sm text-slate-400 font-mono">{item.serialNumber}</div>
                      </div>
                    </div>
                    <span className="badge-success">Available</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-400 mb-4">
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      {item.location || 'Unknown'}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">✨</span>
                      Condition: {item.condition || 'Unknown'}
                    </div>
                    {item.category && (
                      <div className="flex items-center">
                        <span className="mr-2">🏷️</span>
                        {item.category}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleRequestClick(item)}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <span className="mr-2">📝</span> Request to Borrow
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-lg w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-100">Request to Borrow</h2>
              <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-slate-200 text-2xl">×</button>
            </div>
            
            <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
              <div className="font-semibold text-slate-100">{selectedEquipment.name}</div>
              <div className="text-sm text-slate-400">{selectedEquipment.serialNumber}</div>
              <div className="text-sm text-slate-400 mt-1">📍 {selectedEquipment.location}</div>
              <div className="text-sm text-slate-400">✨ Condition: {selectedEquipment.condition}</div>
            </div>
            
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Due Date *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={function(e) { setFormData({...formData, dueDate: e.target.value}); }}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Purpose of Checkout *</label>
                <textarea
                  placeholder="Describe what you'll use this equipment for..."
                  value={formData.purpose}
                  onChange={function(e) { setFormData({...formData, purpose: e.target.value}); }}
                  rows={4}
                  className="input-field"
                  required
                />
              </div>
              
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 text-sm text-indigo-300">
                <strong>Note:</strong> Your request will be reviewed by an admin. You'll be notified when approved, then you can pick up the equipment.
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
                <button type="button" onClick={() => setShowRequestModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentEquipment;