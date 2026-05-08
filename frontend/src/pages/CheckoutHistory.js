import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CheckoutHistory = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('checkouts'); // 'checkouts' or 'pending'
  const [overdueCount, setOverdueCount] = useState(0);

  useEffect(() => {
    console.log('🔥 CheckoutHistory mounted');
    fetchCheckouts();
    fetchPendingRequests();
  }, []);

  const fetchCheckouts = async function() {
    try {
      console.log('📡 Fetching checkouts...');
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const response = await axios.get('http://localhost:3000/api/checkouts', {
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Checkout response:', response.data);
      var data = response.data;
      if (!Array.isArray(data)) {
        data = [];
      }
      setCheckouts(data);
      
      // Calculate overdue count
      var today = new Date();
      var overdue = data.filter(function(c) {
        if (c.status === 'returned' || !c.dueDate) return false;
        var dueDate = new Date(c.dueDate);
        return dueDate < today;
      });
      setOverdueCount(overdue.length);
      
    } catch (err) {
      console.error('❌ Error fetching checkouts:', err);
      setError('Failed to load checkouts. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async function() {
    try {
      console.log('📡 Fetching pending requests...');
      const token = localStorage.getItem('token');
      
      if (!token) {
        return;
      }
      
      const response = await axios.get('http://localhost:3000/api/checkout-requests?status=pending', {
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Pending requests response:', response.data);
      var data = response.data;
      if (!Array.isArray(data)) {
        data = [];
      }
      setPendingRequests(data);
      
    } catch (err) {
      console.error('❌ Error fetching pending requests:', err);
      // Don't show error to user - just log it
    }
  };

  const handleMarkReturned = async function(checkoutId) {
    try {
      console.log('📡 Marking checkout as returned:', checkoutId);
      const token = localStorage.getItem('token');
      
      await axios.put('http://localhost:3000/api/checkouts/' + checkoutId + '/return', {}, {
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Marked as returned');
      setSuccess('✓ Equipment marked as returned!');
      fetchCheckouts();
      setTimeout(function() { setSuccess(''); }, 3000);
      
    } catch (err) {
      console.error('❌ Error marking as returned:', err);
      setError('✗ Error: ' + (err.response ? err.response.data.message : 'Failed to update'));
      setTimeout(function() { setError(''); }, 5000);
    }
  };

  const handleSendReminder = async function(checkoutId) {
    try {
      console.log('📡 Sending reminder for checkout:', checkoutId);
      const token = localStorage.getItem('token');
      
      await axios.post('http://localhost:3000/api/checkouts/' + checkoutId + '/reminder', {}, {
        headers: { Authorization: 'Bearer ' + token }
      });
      
      setSuccess('✓ Reminder sent to borrower!');
      setTimeout(function() { setSuccess(''); }, 3000);
      
    } catch (err) {
      console.error('❌ Error sending reminder:', err);
      setError('✗ Error sending reminder');
      setTimeout(function() { setError(''); }, 3000);
    }
  };

  // ✅ NEW: Approve student request
  const handleApproveRequest = async function(requestId) {
    try {
      console.log('📡 Approving request:', requestId);
      const token = localStorage.getItem('token');
      
      await axios.put('http://localhost:3000/api/checkout-requests/' + requestId + '/status', 
        { status: 'approved' },
        {
          headers: { 
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Request approved');
      setSuccess('✓ Request approved! Student can now pick up equipment.');
      fetchPendingRequests();
      fetchCheckouts(); // Refresh regular checkouts too
      setTimeout(function() { setSuccess(''); }, 3000);
      
    } catch (err) {
      console.error('❌ Error approving request:', err);
      setError('✗ Error: ' + (err.response ? err.response.data.message : 'Failed to approve'));
      setTimeout(function() { setError(''); }, 5000);
    }
  };

  // ✅ NEW: Reject student request
  const handleRejectRequest = async function(requestId) {
    if (!window.confirm('Reject this request? The student will be notified.')) {
      return;
    }
    
    try {
      console.log('📡 Rejecting request:', requestId);
      const token = localStorage.getItem('token');
      
      await axios.put('http://localhost:3000/api/checkout-requests/' + requestId + '/status', 
        { status: 'rejected' },
        {
          headers: { 
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Request rejected');
      setSuccess('✓ Request rejected');
      fetchPendingRequests();
      setTimeout(function() { setSuccess(''); }, 3000);
      
    } catch (err) {
      console.error('❌ Error rejecting request:', err);
      setError('✗ Error: ' + (err.response ? err.response.data.message : 'Failed to reject'));
      setTimeout(function() { setError(''); }, 5000);
    }
  };

  // Filter checkouts based on overdue filter
  var displayedCheckouts = showOverdueOnly 
    ? checkouts.filter(function(c) {
        if (c.status === 'returned' || !c.dueDate) return false;
        return new Date(c.dueDate) < new Date();
      })
    : checkouts;

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
          <h1 className="text-4xl font-bold gradient-text">Checkout History</h1>
          <p className="text-slate-400 mt-3">Manage checkouts and student requests</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {success && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl mb-6">{success}</div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">{error}</div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 border-l-4 border-indigo-500">
            <p className="text-slate-400 text-sm">Total Checkouts</p>
            <p className="text-4xl font-bold text-indigo-400">{checkouts.length}</p>
          </div>
          <div className="card p-6 border-l-4 border-amber-500">
            <p className="text-slate-400 text-sm">Pending Requests</p>
            <p className="text-4xl font-bold text-amber-400">{pendingRequests.length}</p>
          </div>
          <div className="card p-6 border-l-4 border-red-500">
            <p className="text-slate-400 text-sm">Overdue Items</p>
            <p className="text-4xl font-bold text-red-400">{overdueCount}</p>
          </div>
          <div className="card p-6 border-l-4 border-emerald-500">
            <p className="text-slate-400 text-sm">Returned</p>
            <p className="text-4xl font-bold text-emerald-400">
              {checkouts.filter(function(c) { return c.status === 'returned'; }).length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="card p-2 mb-8">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('checkouts')}
              className={
                'flex-1 px-4 py-3 rounded-lg font-medium transition-all ' +
                (activeTab === 'checkouts' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700')
              }
            >
              📦 All Checkouts ({checkouts.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={
                'flex-1 px-4 py-3 rounded-lg font-medium transition-all ' +
                (activeTab === 'pending' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700')
              }
            >
              ⏳ Pending Requests ({pendingRequests.length})
            </button>
          </div>
        </div>

        {/* Overdue Filter (only for checkouts tab) */}
        {activeTab === 'checkouts' && (
          <div className="card p-6 mb-8">
            <div className="flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOverdueOnly}
                  onChange={(e) => setShowOverdueOnly(e.target.checked)}
                  className="h-5 w-5 text-red-600 focus:ring-red-500 border-slate-600 rounded bg-slate-800"
                />
                <span className="ml-3 text-slate-300 font-medium">Show Overdue Only</span>
              </label>
              {showOverdueOnly && overdueCount > 0 && (
                <span className="text-red-400 text-sm">({overdueCount} items)</span>
              )}
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'checkouts' ? (
          // ✅ Regular Checkouts Table
          displayedCheckouts.length === 0 ? (
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">📭</div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">
                {showOverdueOnly ? 'No Overdue Checkouts' : 'No Checkouts Found'}
              </h2>
              <p className="text-slate-400">
                {showOverdueOnly ? 'Great! All items are on time.' : 'Create a checkout to see it here'}
              </p>
            </div>
          ) : (
            <div className="card p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Equipment</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Borrower</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Due Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {displayedCheckouts.map(function(checkout) {
                      if (!checkout) return null;
                      
                      var equipName = checkout.equipment && checkout.equipment.name ? checkout.equipment.name : 'Equipment';
                      var equipSerial = checkout.equipment && checkout.equipment.serialNumber ? checkout.equipment.serialNumber : '';
                      var isOverdue = checkout.dueDate && new Date(checkout.dueDate) < new Date() && checkout.status !== 'returned';
                      
                      return (
                        <tr key={checkout.id} className={'hover:bg-slate-800/50 ' + (isOverdue ? 'bg-red-500/10' : '')}>
                          <td className="px-6 py-4 text-sm text-slate-100">
                            <div>{equipName}</div>
                            {equipSerial && <div className="text-xs text-slate-500 font-mono">{equipSerial}</div>}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">
                            {checkout.borrowerName || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className={isOverdue ? 'text-red-400 font-semibold' : 'text-slate-400'}>
                              {checkout.dueDate ? new Date(checkout.dueDate).toLocaleDateString() : '-'}
                            </div>
                            {isOverdue && <div className="text-xs text-red-400">OVERDUE</div>}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={
                              'px-3 py-1 rounded-full text-xs font-semibold ' +
                              (checkout.status === 'returned' ? 'bg-emerald-500/20 text-emerald-400' :
                               checkout.status === 'borrowed' ? (isOverdue ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400') :
                               'bg-slate-500/20 text-slate-400')
                            }>
                              {checkout.status || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {checkout.status === 'borrowed' && (
                              <div className="space-y-2">
                                <button 
                                  onClick={() => handleMarkReturned(checkout.id)}
                                  className="text-emerald-400 hover:text-emerald-300 font-medium block"
                                >
                                  ✓ Return
                                </button>
                                {isOverdue && (
                                  <button 
                                    onClick={() => handleSendReminder(checkout.id)}
                                    className="text-red-400 hover:text-red-300 font-medium block"
                                  >
                                    📧 Send Reminder
                                  </button>
                                )}
                              </div>
                            )}
                            {checkout.status === 'returned' && (
                              <span className="text-slate-500">Completed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          // ✅ Pending Requests Table
          pendingRequests.length === 0 ? (
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">No Pending Requests</h2>
              <p className="text-slate-400">All student requests have been processed</p>
            </div>
          ) : (
            <div className="card p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Equipment</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Student</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Due Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Purpose</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Requested</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {pendingRequests.map(function(request) {
                      if (!request) return null;
                      
                      var equipName = request.equipment && request.equipment.name ? request.equipment.name : 'Equipment';
                      var equipSerial = request.equipment && request.equipment.serialNumber ? request.equipment.serialNumber : '';
                      
                      return (
                        <tr key={request.id} className="hover:bg-slate-800/50">
                          <td className="px-6 py-4 text-sm text-slate-100">
                            <div>{equipName}</div>
                            {equipSerial && <div className="text-xs text-slate-500 font-mono">{equipSerial}</div>}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">
                            <div>{request.borrowerName || 'Unknown'}</div>
                            <div className="text-xs text-slate-500">{request.borrowerEmail || ''}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">
                            {request.dueDate ? new Date(request.dueDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                            {request.purpose || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">
                            {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="space-y-2">
                              <button 
                                onClick={() => handleApproveRequest(request.id)}
                                className="text-emerald-400 hover:text-emerald-300 font-medium block"
                              >
                                ✓ Approve
                              </button>
                              <button 
                                onClick={() => handleRejectRequest(request.id)}
                                className="text-red-400 hover:text-red-300 font-medium block"
                              >
                                ✗ Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CheckoutHistory;
