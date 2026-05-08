import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CheckoutForm = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    equipmentId: '',
    borrowerId: '',
    borrowerName: '',
    borrowerEmail: '',
    dueDate: '',
    purpose: ''
  });

  useEffect(function() {
    console.log('🔥 CheckoutForm mounted');
    fetchAvailableEquipment();
    fetchUsers();
  }, []);

  const fetchAvailableEquipment = async function() {
    try {
      console.log('📡 Fetching available equipment...');
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const response = await axios.get('http://localhost:3000/api/equipment?status=Available', {
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Equipment response:', response.data);
      var data = response.data;
      if (!Array.isArray(data)) {
        data = [];
      }
      setEquipmentList(data);
      
    } catch (err) {
      console.error('❌ Error fetching equipment:', err);
      setError('Failed to load available equipment. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async function() {
    try {
      console.log('📡 Fetching users for borrower selection...');
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: { Authorization: 'Bearer ' + token }
      });
      
      console.log('✅ Users response:', response.data);
      var users = response.data || [];
      if (!Array.isArray(users)) users = [];
      setUsersList(users.filter(function(u) { 
        return u.role === 'student' || u.role === 'faculty'; 
      }));
      
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      setUsersList([
        { id: 1, username: 'student_user', email: 'student@test.com', full_name: 'Student User', role: 'student' }
      ]);
    }
  };

  const handleUserSelect = function(userId) {
    var user = usersList.find(function(u) { return u.id === parseInt(userId); });
    if (user) {
      setFormData({
        ...formData,
        borrowerId: userId,
        borrowerName: user.full_name || user.username,
        borrowerEmail: user.email
      });
    }
  };

  const handleSubmit = async function(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      console.log('📡 Creating checkout...');
      const token = localStorage.getItem('token');
      
      if (!formData.equipmentId) {
        throw new Error('Please select equipment');
      }
      if (!formData.dueDate) {
        throw new Error('Please select a due date');
      }
      
      // ✅ FIX: Send dueDate as plain string (YYYY-MM-DD), NOT as Date object
      // Backend @IsDate() expects Date instance, but JSON converts it to string
      // So we send string and let backend parse it, OR update backend DTO
      var payload = {
        equipmentId: parseInt(formData.equipmentId),
        userId: formData.borrowerId ? parseInt(formData.borrowerId) : null,
        borrowerName: formData.borrowerName,
        borrowerEmail: formData.borrowerEmail,
        dueDate: formData.dueDate,  // ✅ Send as string "YYYY-MM-DD"
        purpose: formData.purpose,
        status: 'borrowed'
      };
      
      console.log('📤 Sending payload:', payload);
      
      const response = await axios.post('http://localhost:3000/api/checkouts', payload, {
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Checkout created successfully:', response.data);
      setSuccess('✓ Checkout created successfully!');
      
      // Reset form
      setFormData({
        equipmentId: '',
        borrowerId: '',
        borrowerName: '',
        borrowerEmail: '',
        dueDate: '',
        purpose: ''
      });
      
      // Refresh equipment list
      fetchAvailableEquipment();
      
    } catch (err) {
      console.error('❌ Error creating checkout:', err);
      console.error('❌ Error response:', err.response);
      
      var errorMsg = 'Error creating checkout';
      if (err.response) {
        console.error('❌ Backend error details:', err.response.data);
        if (err.response.data.message) {
          errorMsg += ': ' + err.response.data.message;
        }
        if (err.response.data.error) {
          errorMsg += ' (' + err.response.data.error + ')';
        }
      } else if (err.request) {
        errorMsg += ' (No response from server - is backend running?)';
      } else {
        errorMsg += ': ' + err.message;
      }
      
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
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
          <h1 className="text-4xl font-bold gradient-text">New Checkout</h1>
          <p className="text-slate-400 mt-3">Process equipment checkout</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {success && (
            <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl mb-6">{success}</div>
          )}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">{error}</div>
          )}

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Equipment *</label>
                <select
                  value={formData.equipmentId}
                  onChange={function(e) { setFormData({ ...formData, equipmentId: e.target.value }); }}
                  className="input-field"
                  required
                >
                  <option value="">Choose available equipment...</option>
                  {equipmentList.map(function(equip) {
                    if (!equip) return null;
                    return (
                      <option key={equip.id} value={equip.id}>
                        {equip.name} ({equip.serialNumber}) - {equip.category || 'General'}
                      </option>
                    );
                  })}
                </select>
                {equipmentList.length === 0 && (
                  <p className="text-sm text-amber-400 mt-2">⚠ No available equipment. Add equipment first!</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Borrower (Optional)</label>
                <select
                  value={formData.borrowerId}
                  onChange={function(e) { handleUserSelect(e.target.value); }}
                  className="input-field"
                >
                  <option value="">Select from registered users...</option>
                  {usersList.map(function(user) {
                    if (!user) return null;
                    return (
                      <option key={user.id} value={user.id}>
                        {(user.full_name || user.username)} ({user.email})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Borrower Name *</label>
                <input
                  type="text"
                  value={formData.borrowerName}
                  onChange={function(e) { setFormData({ ...formData, borrowerName: e.target.value }); }}
                  className="input-field"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Borrower Email *</label>
                <input
                  type="email"
                  value={formData.borrowerEmail}
                  onChange={function(e) { setFormData({ ...formData, borrowerEmail: e.target.value }); }}
                  className="input-field"
                  placeholder="borrower@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Due Date *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={function(e) { setFormData({ ...formData, dueDate: e.target.value }); }}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Purpose *</label>
                <textarea
                  value={formData.purpose}
                  onChange={function(e) { setFormData({ ...formData, purpose: e.target.value }); }}
                  rows={4}
                  className="input-field"
                  placeholder="Describe the purpose of this checkout..."
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1" disabled={submitting || equipmentList.length === 0}>
                  {submitting ? 'Processing...' : 'Submit Checkout'}
                </button>
                <button type="button" className="btn-secondary flex-1" onClick={function() { window.history.back(); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;