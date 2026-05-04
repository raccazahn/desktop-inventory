import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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

  // ✅ PROFESSIONAL PDF EXPORT WITH REAL STYLING
  const handleExportPDF = async function() {
    try {
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      
      // Create new PDF document
      const doc = new jsPDF();
      
      // Brand colors
      const primaryColor = [79, 70, 229];    // indigo-600
      const successColor = [16, 185, 129];   // emerald-500
      const warningColor = [245, 158, 11];   // amber-500
      const dangerColor = [239, 68, 68];     // red-500
      const darkColor = [30, 41, 59];        // slate-800
      const lightColor = [248, 250, 252];    // slate-50
      
      // Get user info for report metadata
      var user = 'Admin';
      try {
        var storedUser = localStorage.getItem('user');
        if (storedUser) {
          var userData = JSON.parse(storedUser);
          user = userData.username || userData.email || 'User';
        }
      } catch (e) {}
      
      // 🎨 HEADER: Branded title bar
      doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.rect(0, 0, 210, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('🖥️ Desktop Inventory System', 105, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Professional Equipment Management Report', 105, 23, { align: 'center' });
      
      // Report metadata
      doc.setTextColor(148, 163, 184); // slate-400
      doc.setFontSize(9);
      doc.text('Generated: ' + new Date().toLocaleString(), 14, 42);
      doc.text('By: ' + user, 14, 47);
      doc.text('Report Type: ' + reportType.toUpperCase(), 14, 52);
      
      // 📊 STATS SECTION: Summary cards
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('📈 Summary Statistics', 14, 65);
      
      var statsData = [
        ['Total Equipment', stats.total.toString(), 'All registered items'],
        ['Available', stats.available.toString(), 'Ready for checkout'],
        ['Checked Out', stats.checkedOut.toString(), 'Currently in use'],
        ['Overdue', stats.overdue.toString(), 'Needs attention']
      ];
      
      doc.autoTable({
        startY: 70,
        head: [['Metric', 'Count', 'Description']],
        body: statsData,
        theme: 'grid',
        headStyles: { 
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: { 
          textColor: darkColor,
          fontSize: 8,
          cellPadding: 3
        },
        alternateRowStyles: { fillColor: [241, 245, 249] }, // slate-100
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' },
          1: { cellWidth: 30, halign: 'center' },
          2: { cellWidth: 90 }
        },
        margin: { left: 14, right: 14 }
      });
      
      // 📋 EQUIPMENT TABLE SECTION
      var finalY = doc.lastAutoTable.finalY + 10;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('💻 Equipment Inventory', 14, finalY);
      
      // Prepare equipment data for table
      var equipRows = equipment.map(function(item) {
        return [
          item.name || 'Unknown',
          item.serialNumber || '-',
          item.status || 'Unknown',
          item.location || '-',
          item.condition || '-'
        ];
      });
      
      doc.autoTable({
        startY: finalY + 5,
        head: [['Equipment Name', 'Serial Number', 'Status', 'Location', 'Condition']],
        body: equipRows,
        theme: 'striped',
        headStyles: { 
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8
        },
        bodyStyles: { 
          textColor: darkColor,
          fontSize: 8,
          cellPadding: 2
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 35, fontStyle: 'normal' },
          2: { 
            cellWidth: 30,
            fontStyle: 'bold',
            fillColor: function(data) {
              if (data.row.index % 2 === 0) return [248, 250, 252];
              return undefined;
            }
          },
          3: { cellWidth: 35 },
          4: { cellWidth: 30 }
        },
        didParseCell: function(data) {
          // Color-code status column
          if (data.section === 'body' && data.column.index === 2) {
            var status = data.cell.raw;
            if (status === 'Available') {
              data.cell.styles.textColor = successColor;
            } else if (status === 'In Use' || status === 'borrowed') {
              data.cell.styles.textColor = warningColor;
            } else {
              data.cell.styles.textColor = dangerColor;
            }
          }
        },
        margin: { left: 14, right: 14 }
      });
      
      // 📄 FOOTER
      var pageCount = doc.internal.getNumberOfPages();
      for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          '© 2026 Desktop Inventory System | Confidential Report | Page ' + i + ' of ' + pageCount,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      // 💾 SAVE PDF
      var fileName = 'DesktopInventory_Report_' + reportType + '_' + new Date().toISOString().split('T')[0] + '.pdf';
      doc.save(fileName);
      
      alert('📄 Professional PDF report downloaded successfully!\n\nFile: ' + fileName);
      
    } catch (err) {
      console.error('❌ Error generating PDF:', err);
      setError('✗ Failed to generate PDF. Please try again.');
      setTimeout(function() { setError(''); }, 5000);
    }
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
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Equipment_Inventory_' + new Date().toISOString().split('T')[0] + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert('✓ Excel file downloaded successfully!');
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