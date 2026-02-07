import React, { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import { AttendanceStatus, DailyAttendance, AttendanceRecord } from '../types';
// FIX: Import 'format' from its specific sub-package in date-fns.
import format from 'date-fns/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileDown, Printer, Mail } from 'lucide-react';

const AttendancePage: React.FC = () => {
  const { students, subjects, attendance, setAttendance } = useAppData();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedSection, setSelectedSection] = useState('All');

  const todaysAttendance = useMemo(() => {
    return attendance.find(a => a.date === selectedDate && a.subjectId === selectedSubjectId);
  }, [attendance, selectedDate, selectedSubjectId]);

  const studentsInSubject = useMemo(() => {
    const subject = subjects.find(s => s.id === selectedSubjectId);
    if (!subject) return [];
    return students.filter(s => subject.studentIds.includes(s.id));
  }, [students, subjects, selectedSubjectId]);

  const availableSections = useMemo(() => {
    const sections = new Set(studentsInSubject.map(s => s.section).filter(Boolean));
    return ['All', ...Array.from(sections).sort()];
  }, [studentsInSubject]);
  
  const filteredAndSortedStudents = useMemo(() => {
    return studentsInSubject
      .filter(student => selectedSection === 'All' || student.section === selectedSection)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [studentsInSubject, selectedSection]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    const newRecord: AttendanceRecord = { studentId, status };
    
    setAttendance(prev => {
      const existingDay = prev.find(a => a.date === selectedDate && a.subjectId === selectedSubjectId);
      if (existingDay) {
        return prev.map(day => 
          day.date === selectedDate && day.subjectId === selectedSubjectId
          ? { ...day, records: [...day.records.filter(r => r.studentId !== studentId), newRecord] }
          : day
        );
      } else {
        const newDay: DailyAttendance = {
          date: selectedDate,
          subjectId: selectedSubjectId,
          records: [newRecord],
        };
        return [...prev, newDay];
      }
    });
  };

  const attendanceSummary = useMemo(() => {
    return filteredAndSortedStudents.map(student => {
      const studentRecords = attendance
        .filter(a => a.subjectId === selectedSubjectId)
        .flatMap(a => a.records)
        .filter(r => r.studentId === student.id);
      
      const present = studentRecords.filter(r => r.status === AttendanceStatus.Present).length;
      const absent = studentRecords.filter(r => r.status === AttendanceStatus.Absent).length;
      const late = studentRecords.filter(r => r.status === AttendanceStatus.Late).length;
      const total = studentRecords.length;

      return {
        name: student.name,
        present,
        absent,
        late,
        presentPercentage: total > 0 ? (present / total * 100).toFixed(1) : '0.0',
      };
    });
  }, [attendance, filteredAndSortedStudents, selectedSubjectId]);
  
  const getStudentStatus = (studentId: string) => {
    return todaysAttendance?.records.find(r => r.studentId === studentId)?.status || 'Not Recorded';
  };

  const handleExportCSV = () => {
    const headers = ["Student Name", "Section", "Status"];
    const csvRows = [
        headers.join(','),
        ...filteredAndSortedStudents.map(s => [
            `"${s.name.replace(/"/g, '""')}"`,
            `"${(s.section || '').replace(/"/g, '""')}"`,
            `"${getStudentStatus(s.id)}"`,
        ].join(','))
    ];
    
    const subjectName = subjects.find(s => s.id === selectedSubjectId)?.name || 'attendance';
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_${subjectName}_${selectedDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateAttendanceHTML = () => {
    const subjectName = subjects.find(s => s.id === selectedSubjectId)?.name;
    const rows = filteredAndSortedStudents.map(s => `
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${s.name}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${s.section || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${getStudentStatus(s.id)}</td>
        </tr>
    `).join('');

    return `
        <h2>Attendance for ${subjectName} on ${selectedDate}</h2>
        <p><strong>Section:</strong> ${selectedSection}</p>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Student</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Section</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Status</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
  };

  const handlePrint = () => {
    const content = generateAttendanceHTML();
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
        printWindow.document.write(`<html><head><title>Attendance Report</title></head><body>${content}</body></html>`);
        printWindow.document.close();
        printWindow.print();
    }
  };

  const handleEmail = () => {
    const subjectName = subjects.find(s => s.id === selectedSubjectId)?.name;
    const subject = `Attendance for ${subjectName} - ${selectedDate}`;
    const body = generateAttendanceHTML();
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance Tracking</h1>

       <div className="flex flex-wrap gap-2">
        <button onClick={handleExportCSV} className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-600">
            <FileDown className="w-4 h-4 mr-2" /> Export to CSV
        </button>
        <button onClick={handlePrint} className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-600">
            <Printer className="w-4 h-4 mr-2" /> Print List
        </button>
        <button onClick={handleEmail} className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-600">
            <Mail className="w-4 h-4 mr-2" /> Email List
        </button>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label htmlFor="date-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input
              id="date-select"
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
            <select
              id="subject-select"
              value={selectedSubjectId}
              onChange={e => {
                setSelectedSubjectId(e.target.value)
                setSelectedSection('All');
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="section-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Section</label>
            <select
              id="section-select"
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              {availableSections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedStudents.map(student => {
                const status = todaysAttendance?.records.find(r => r.studentId === student.id)?.status;
                return (
                  <tr key={student.id} className="bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <div className="flex justify-center space-x-2">
                        {(Object.values(AttendanceStatus)).map(s => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(student.id, s)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-transform transform hover:scale-105
                              ${s === AttendanceStatus.Present ? (status === s ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200') : ''}
                              ${s === AttendanceStatus.Absent ? (status === s ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200') : ''}
                              ${s === AttendanceStatus.Late ? (status === s ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200') : ''}
                            `}
                          >{s}</button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Attendance Summary: {subjects.find(s=>s.id === selectedSubjectId)?.name} {selectedSection !== 'All' && `(${selectedSection})`}
        </h2>
         <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceSummary} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none' }}/>
                <Legend />
                <Bar dataKey="present" stackId="a" fill="#22c55e" name="Present" />
                <Bar dataKey="late" stackId="a" fill="#eab308" name="Late" />
                <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" />
            </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendancePage;