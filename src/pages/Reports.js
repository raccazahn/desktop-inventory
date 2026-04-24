import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [reportType, setReportType] = useState('utilization');
  const [equipment, setEquipment] = useState([]);
  const [checkouts, setCheckouts] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, checkedOut: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('🔥 Reports mounted');
    fetchReportData();
  }, []);

  const fetchReportData = async function() {
    try {
      console.log('📡 Fetching report data...');
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const [equipRes, checkoutRes] = await Promise.all([
        axios.get('http://localhost:3000/api/equipment', { 
          headers: { Authorization: 'Bearer ' + token } 
        }),
        axios.get('http://localhost:3000/api/checkouts', { 
          headers: { Authorization: 'Bearer ' + token } 
        })
      ]);
      
      console.log('✅ Equipment:', equipRes.data);
      console.log('✅ Checkouts:', checkoutRes.data);
      
      var equipData = equipRes.data || [];
      var checkoutData = checkoutRes.data || [];
      
      if (!Array.isArray(equipData)) equipData = [];
      if (!Array.isArray(checkoutData)) checkoutData = [];
      
      setEquipment(equipData);
      setCheckouts(checkoutData);
      
      var total = equipData.length;
      var available = equipData.filter(function(e) { return e.status === 'Available'; }).length;
      var checkedOut = equipData.filter(function(e) { return e.status === 'In Use' || e.status === 'borrowed'; }).length;
      
      setStats({
        total: total,
        available: available,
        checkedOut: checkedOut,
        overdue: 0
      });
      
    } catch (err) {
      console.error('❌ Error fetching report ', err);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = function() {
    var data = 'LAB INVENTORY REPORT\nGenerated: ' + new Date().toLocaleString() + '\n\n';
    data += 'Total Equipment: ' + stats.total + '\n';
    data += 'Available: ' + stats.available + '\n';
    data += 'Checked Out: ' + stats.checkedOut + '\n';
    data += 'Overdue: ' + stats.overdue + '\n';
    
    var blob = new Blob([data], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'LabInventory_Report_' + new Date().toISOString().split('T')[0] + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert('✓ Report downloaded!');
  };

  const handleExportExcel = function() {
    var headers = ['Name', 'Serial', 'Status', 'Location', 'Condition'];
    var rows = equipment.map(function(e) {
      return [
        e.name || '',
        e.serialNumber || '',
        e.status || '',
        e.location || '',
        e.condition || ''
      ];
    });
    
    var csv = [headers.join(','), rows.map(function(r) { return r.join(','); }).join('\n')].join('\n');
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Equipment_Inventory_' + new Date().toISOString().split('T')[0] + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert('✓ Excel file downloaded!');
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
          <h1 className="text-4xl font-bold gradient-text">Reports & Analytics</h1>
          <p className="text-slate-400 mt-3">Real-time data from your inventory</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6">{error}</div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 border-l-4 border-indigo-500">
            <p className="text-slate-400 text-sm">Total Equipment</p>
            <p className="text-4xl font-bold text-indigo-400">{stats.total}</p>
          </div>
          <div className="card p-6 border-l-4 border-emerald-500">
            <p className="text-slate-400 text-sm">Available</p>
            <p className="text-4xl font-bold text-emerald-400">{stats.available}</p>
          </div>
          <div className="card p-6 border-l-4 border-amber-500">
            <p className="text-slate-400 text-sm">Checked Out</p>
            <p className="text-4xl font-bold text-amber-400">{stats.checkedOut}</p>
          </div>
          <div className="card p-6 border-l-4 border-red-500">
            <p className="text-slate-400 text-sm">Overdue</p>
            <p className="text-4xl font-bold text-red-400">{stats.overdue}</p>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Report Type</h3>
          <div className="flex space-x-2">
            {['utilization', 'loss-damage', 'maintenance'].map(function(type) {
              return (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={
                    'flex-1 px-4 py-3 rounded-xl font-medium transition-all ' +
                    (reportType === type 
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white' 
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700')
                  }
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Equipment Data Table */}
        <div className="card p-6 mb-8">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Equipment Overview</h3>
          {equipment.length === 0 ? (
            <p className="text-slate-400">No equipment data available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Serial</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {equipment.map(function(item, index) {
                    if (!item) return null;
                    return (
                      <tr key={item.id || index} className="hover:bg-slate-800/50">
                        <td className="px-6 py-4 text-sm text-slate-100">{item.name || '-'}</td>
                        <td className="px-6 py-4 text-sm text-slate-400 font-mono">{item.serialNumber || '-'}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={
                            'px-3 py-1 rounded-full text-xs font-semibold ' +
                            (item.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400' :
                             item.status === 'In Use' ? 'bg-amber-500/20 text-amber-400' :
                             'bg-red-500/20 text-red-400')
                          }>
                            {item.status || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{item.location || '-'}</td>
                        <td className="px-6 py-4 text-sm text-slate-400">{item.condition || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Export Buttons */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Export Options</h3>
          <div className="flex flex-wrap gap-4">
            <button onClick={handleExportPDF} className="btn-danger">Export to PDF</button>
            <button onClick={handleExportExcel} className="btn-success">Export to Excel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;