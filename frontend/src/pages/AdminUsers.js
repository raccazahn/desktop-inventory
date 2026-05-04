import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student',
    full_name: '',
    phone: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      // Fallback to mock data
      setUsers([
        { id: 1, username: 'admin_user', email: 'admin@test.com', role: 'admin', full_name: 'Admin User' },
        { id: 2, username: 'tech_user', email: 'tech@test.com', role: 'technician', full_name: 'Tech User' },
        { id: 3, username: 'student_user', email: 'student@test.com', role: 'student', full_name: 'Student User' }
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/auth/register', formData, {
        headers: { Authorization: 'Bearer ' + token }
      });
      
      setSuccess('User registered successfully!');
      setShowModal(false);
      setFormData({ username: '', email: '', password: '', role: 'student', full_name: '', phone: '' });
      fetchUsers();
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error registering user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:3000/api/users/' + userId, {
          headers: { Authorization: 'Bearer ' + token }
        });
        setSuccess('User deleted successfully!');
        fetchUsers();
      } catch (err) {
        setError('Error deleting user');
      }
    }
  };

  const getRoleBadge = function(userRole) {
    switch(userRole) {
      case 'admin': return 'badge-danger';
      case 'technician': return 'badge-warning';
      case 'faculty': return 'badge-info';
      default: return 'badge-success';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navbar is in App.js */}
      
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 py-10">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold gradient-text">User Management</h1>
          <p className="text-slate-400 mt-3 text-lg">Register and manage system users</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {success && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl mb-6">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="card p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-100">All Users ({users.length})</h2>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Register New User
            </button>
          </div>

          <div className="table-dark">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Username</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Full Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {users.map(function(user) {
                  return (
                    <tr key={user.id} className="table-row">
                      <td className="px-6 py-4 text-sm text-slate-100">{user.username}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{user.full_name || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={getRoleBadge(user.role)}>{user.role}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-indigo-400 hover:text-indigo-300 mr-3 font-medium">Edit</button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="text-red-400 hover:text-red-300 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Register User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-100">Register New User</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="input-field"
                required
                minLength={6}
              />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="input-field"
                required
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="input-field"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="technician">Technician</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
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

export default AdminUsers;