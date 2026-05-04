import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser, getUserRole } from '../utils/auth';

const EquipmentCatalog = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const user = getCurrentUser();
  const role = getUserRole();
  const canEdit = role === 'admin' || role === 'technician';

  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    status: 'Available',
    location: '',
    condition: '',
    category: ''
  });

  useEffect(() => {
    console.log('🔥 EquipmentCatalog mounted');
    fetchEquipment();
  }, []);

  const fetchEquipment = async function() {
    try {
      console.log('📡 Fetching equipment from backend...');
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get('http://localhost:3000/api/equipment', {
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ API response received:', response.data);
      var data = response.data;
      if (!Array.isArray(data)) {
        data = [];
      }
      setEquipment(data);
      setError(null);
      
    } catch (err) {
      console.error('❌ Error fetching equipment:', err);
      setError('Failed to load equipment. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = function() {
    setFormData({
      name: '',
      serialNumber: '',
      status: 'Available',
      location: '',
      condition: '',
      category: ''
    });
    setShowAddModal(true);
  };

  const handleEdit = function(item) {
    setSelectedEquipment(item);
    setFormData({
      name: item.name || '',
      serialNumber: item.serialNumber || '',
      status: item.status || 'Available',
      location: item.location || '',
      condition: item.condition || '',
      category: item.category || ''
    });
    setShowEditModal(true);
  };

  // ✅ FIXED: Delete with better error handling for foreign keys
  const handleDelete = async function(id) {
    // Get equipment name for confirmation message
    var item = equipment.find(function(e) { return e.id === id; });
    var itemName = item ? item.name : 'this equipment';
    
    if (window.confirm('Are you sure you want to delete "' + itemName + '"?\n\n⚠️ Warning: If this item has checkout records, deletion may fail.')) {
      try {
        const token = localStorage.getItem('token');
        
        console.log('🗑️ Deleting equipment ID:', id);
        await axios.delete('http://localhost:3000/api/equipment/' + id, {
          headers: { 
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ Equipment deleted successfully');
        setSuccess('✓ "' + itemName + '" deleted successfully!');
        fetchEquipment(); // Refresh list
        setTimeout(function() { setSuccess(''); }, 3000);
        
      } catch (err) {
        console.error('❌ Error deleting:', err);
        
        // ✅ Handle foreign key constraint error specifically
        var errorMsg = '✗ Error deleting equipment';
        if (err.response && err.response.data && err.response.data.message) {
          var backendMsg = err.response.data.message;
          if (backendMsg.includes('FOREIGN KEY') || backendMsg.includes('constraint')) {
            errorMsg = '✗ Cannot delete: This item has checkout records.\n\nSolution: Delete associated checkouts first, or mark equipment as "Unavailable" instead.';
          } else {
            errorMsg = '✗ ' + backendMsg;
          }
        }
        
        setError(errorMsg);
        setTimeout(function() { setError(''); }, 6000);
      }
    }
  };

  const handleSubmit = async function(e, isEdit) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      if (isEdit && selectedEquipment) {
        await axios.put('http://localhost:3000/api/equipment/' + selectedEquipment.id, formData, {
          headers: { 
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });
        setSuccess('✓ Equipment updated successfully!');
      } else {
        await axios.post('http://localhost:3000/api/equipment', formData, {
          headers: { 
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });
        setSuccess('✓ Equipment added successfully!');
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      fetchEquipment();
      setTimeout(function() { setSuccess(''); }, 3000);
      
    } catch (err) {
      console.error('❌ Error saving:', err);
      setError('✗ Error: ' + (err.response ? err.response.data.message : 'Failed to save'));
      setTimeout(function() { setError(''); }, 5000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-slate-300 text-xl">Loading equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-8">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 py-10">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold gradient-text">Equipment Catalog</h1>
          <p className="text-slate-400 mt-3">Total: {equipment.length} items</p>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8">
        {success && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl mb-6">{success}</div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 whitespace-pre-line">{error}</div>
        )}
        
        {equipment.length === 0 ? (
          <div className="card p-6 text-center">
            <div className="text-4xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">No Equipment Found</h2>
            <p className="text-slate-400 mb-4">Add your first equipment to get started</p>
            {canEdit && (
              <button onClick={handleAddClick} className="btn-primary">
                <span className="mr-2">➕</span> Add Equipment
              </button>
            )}
          </div>
        ) : (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-100">All Equipment ({equipment.length})</h2>
              {canEdit && (
                <button onClick={handleAddClick} className="btn-primary">
                  <span className="mr-2">➕</span> Add Equipment
                </button>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Serial Number</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Condition</th>
                    {canEdit && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {equipment.map(function(item, index) {
                    if (!item) return null;
                    return (
                      <tr key={item.id || index} className="hover:bg-slate-800/50">
                        <td className="px-6 py-4 text-sm text-slate-100">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-lg">💻</span>
                            </div>
                            <div>
                              <div className="font-semibold">{item.name || 'Unknown'}</div>
                              {item.category && <div className="text-xs text-slate-500">{item.category}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400 font-mono">{item.serialNumber || '-'}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={
                            'px-3 py-1 rounded-full text-xs font-semibold ' +
                            (item.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400' :
                             item.status === 'In Use' ? 'bg-amber-500/20 text-amber-400' :
                             'bg-red-500/20 text-red-400')
                          }>
                            {item.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{item.location || '-'}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={
                            'px-3 py-1 rounded-full text-xs font-semibold ' +
                            (item.condition === 'Excellent' ? 'bg-emerald-500/20 text-emerald-400' :
                             item.condition === 'Good' ? 'bg-blue-500/20 text-blue-400' :
                             item.condition === 'Fair' ? 'bg-amber-500/20 text-amber-400' :
                             'bg-red-500/20 text-red-400')
                          }>
                            {item.condition || 'Unknown'}
                          </span>
                        </td>
                        {canEdit && (
                          <td className="px-6 py-4 text-sm">
                            <button 
                              onClick={() => handleEdit(item)}
                              className="text-indigo-400 hover:text-indigo-300 mr-3 font-medium"
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="text-red-400 hover:text-red-300 font-medium"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ADD EQUIPMENT MODAL - FIXED STRUCTURE */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-100">Add New Equipment</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200 text-2xl">×</button>
            </div>
            
            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Equipment Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Dell OptiPlex 7080"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Serial Number *</label>
                  <input
                    type="text"
                    placeholder="e.g., SN-2024-001"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location *</label>
                  <input
                    type="text"
                    placeholder="e.g., Lab A"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Condition *</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select condition...</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Select category...</option>
                    <option value="Desktop">Desktop Computer</option>
                    <option value="Laptop">Laptop Computer</option>
                    <option value="Mouse">Mouse (Wireless/Wired)</option>
                    <option value="Keyboard">Keyboard (Wireless/Wired)</option>
                    <option value="Projector">Projector</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Headphones">Headphones</option>
                    <option value="Webcam">Webcam</option>
                    <option value="Speaker">Speaker</option>
                    <option value="Cable">Cable/Adapter</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Equipment'}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EQUIPMENT MODAL */}
      {showEditModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-100">Edit Equipment</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-200 text-2xl">×</button>
            </div>
            
            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Equipment Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Serial Number *</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Condition *</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Select category...</option>
                    <option value="Desktop">Desktop Computer</option>
                    <option value="Laptop">Laptop Computer</option>
                    <option value="Mouse">Mouse (Wireless/Wired)</option>
                    <option value="Keyboard">Keyboard (Wireless/Wired)</option>
                    <option value="Projector">Projector</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Headphones">Headphones</option>
                    <option value="Webcam">Webcam</option>
                    <option value="Speaker">Speaker</option>
                    <option value="Cable">Cable/Adapter</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update Equipment'}
                </button>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary flex-1">
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

export default EquipmentCatalog;