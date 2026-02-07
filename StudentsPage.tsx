
import React, { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Student } from '../types';
import { 
  Plus, Edit, Trash2, User, Mail, Phone, 
  Shield as GuardianIcon, Search, ArrowUpDown, 
  X, Users, BookOpen, CheckSquare, Square, Layers,
  FileDown, Printer
} from 'lucide-react';

const StudentForm: React.FC<{ student?: Student; onSave: (student: Student) => void; onCancel: () => void; }> = ({ student, onSave, onCancel }) => {
  const [name, setName] = useState(student?.name || '');
  const [section, setSection] = useState(student?.section || '');
  const [guardianName, setGuardianName] = useState(student?.contact?.guardianName || '');
  const [email, setEmail] = useState(student?.contact?.email || '');
  const [phone, setPhone] = useState(student?.contact?.phone || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: student?.id || `s${Date.now()}`,
      name,
      section,
      contact: { guardianName, email, phone },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{student ? 'Edit Student' : 'Add Student'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Student Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="block w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500" placeholder="John Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Section / Class</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Layers className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" value={section} onChange={e => setSection(e.target.value)} className="block w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500" placeholder="Grade 10-A" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Guardian Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GuardianIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" value={guardianName} onChange={e => setGuardianName(e.target.value)} className="block w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500" placeholder="Jane Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Guardian Email</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500" placeholder="jane.doe@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Guardian Phone</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="block w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500" placeholder="555-123-4567" />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmationModal: React.FC<{ onConfirm: () => void; onCancel: () => void; message: string }> = ({ onConfirm, onCancel, message }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold">Confirm Deletion</h3>
            <p className="my-4 text-gray-600 dark:text-gray-300">{message}</p>
            <div className="flex justify-end space-x-2">
                <button onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
            </div>
        </div>
    </div>
);

const BulkSubjectModal: React.FC<{
  count: number;
  onClose: () => void;
  onSave: (subjectId: string) => void;
  subjects: { id: string; name: string }[];
}> = ({ count, onClose, onSave, subjects }) => {
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 px-4">
       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
          <h3 className="text-lg font-bold mb-4">Assign {count} Students to Subject</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select a subject to enroll the selected students in.</p>
          <select 
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 mb-4"
            value={subjectId}
            onChange={e => setSubjectId(e.target.value)}
          >
            {subjects.length > 0 ? (
                subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
            ) : <option value="">No subjects available</option>}
          </select>
          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded">Cancel</button>
            <button 
                onClick={() => onSave(subjectId)} 
                disabled={!subjectId}
                className="px-4 py-2 bg-primary-600 text-white rounded disabled:bg-primary-400"
            >
                Assign
            </button>
          </div>
       </div>
    </div>
  );
};

const BulkContactModal: React.FC<{
    count: number;
    onClose: () => void;
    onSave: (contact: { guardianName: string; email: string; phone: string }) => void;
}> = ({ count, onClose, onSave }) => {
    const [guardianName, setGuardianName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ guardianName, email, phone });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 px-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-lg font-bold mb-2">Bulk Edit Contact Info</h3>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-4">Warning: This will overwrite the guardian contact information for {count} selected students.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Guardian Name" value={guardianName} onChange={e => setGuardianName(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                    <input type="email" placeholder="Guardian Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                    <input type="tel" placeholder="Guardian Phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">Update All</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const StudentsPage: React.FC = () => {
  const { students, setStudents, subjects, setSubjects } = useAppData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);
  const [deletingStudent, setDeletingStudent] = useState<Student | undefined>(undefined);
  
  // New States for Search, Sort, Bulk Actions
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'guardianName' | 'email' | 'section'; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<'subject' | 'contact' | 'delete' | null>(null);

  // Search Logic
  const filteredStudents = useMemo(() => {
    return students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.section || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.contact?.guardianName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.contact?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  // Sort Logic
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
        let valA = '';
        let valB = '';
        
        if (sortConfig.key === 'name') {
            valA = (a.name || '').toLowerCase();
            valB = (b.name || '').toLowerCase();
        } else if (sortConfig.key === 'section') {
            valA = (a.section || '').toLowerCase();
            valB = (b.section || '').toLowerCase();
        } else if (sortConfig.key === 'guardianName') {
            valA = (a.contact?.guardianName || '').toLowerCase();
            valB = (b.contact?.guardianName || '').toLowerCase();
        } else if (sortConfig.key === 'email') {
            valA = (a.contact?.email || '').toLowerCase();
            valB = (b.contact?.email || '').toLowerCase();
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
  }, [filteredStudents, sortConfig]);

  // Sorting Handler
  const handleSort = (key: 'name' | 'guardianName' | 'email' | 'section') => {
    setSortConfig(current => {
        if (current?.key === key) {
            return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
        }
        return { key, direction: 'asc' };
    });
  };

  // Selection Logic
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          setSelectedIds(new Set(sortedStudents.map(s => s.id)));
      } else {
          setSelectedIds(new Set());
      }
  };

  const handleSelectRow = (id: string) => {
      const newSelected = new Set(selectedIds);
      if (newSelected.has(id)) {
          newSelected.delete(id);
      } else {
          newSelected.add(id);
      }
      setSelectedIds(newSelected);
  };

  // Bulk Action Handlers
  const handleBulkSubjectAssign = (subjectId: string) => {
      setSubjects(prev => prev.map(sub => {
          if (sub.id === subjectId) {
              const newIds = Array.from(new Set([...sub.studentIds, ...Array.from(selectedIds)]));
              return { ...sub, studentIds: newIds };
          }
          return sub;
      }));
      setBulkAction(null);
      setSelectedIds(new Set());
  };

  const handleBulkContactUpdate = (contact: { guardianName: string; email: string; phone: string }) => {
      setStudents(prev => prev.map(s => {
          if (selectedIds.has(s.id)) {
              return {
                  ...s,
                  contact: { ...s.contact, ...contact }
              };
          }
          return s;
      }));
      setBulkAction(null);
      setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
      setStudents(prev => prev.filter(s => !selectedIds.has(s.id)));
      // Also remove from subjects
      setSubjects(prev => prev.map(sub => ({
          ...sub,
          studentIds: sub.studentIds.filter(id => !selectedIds.has(id))
      })));
      setBulkAction(null);
      setSelectedIds(new Set());
  };
    
  // Export, Print, Email Handlers
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Section", "Guardian Name", "Guardian Email", "Guardian Phone"];
    const csvRows = [
        headers.join(','),
        ...sortedStudents.map(s => [
            s.id,
            `"${s.name.replace(/"/g, '""')}"`,
            `"${(s.section || '').replace(/"/g, '""')}"`,
            `"${(s.contact?.guardianName || '').replace(/"/g, '""')}"`,
            `"${s.contact?.email || ''}"`,
            `"${s.contact?.phone || ''}"`,
        ].join(','))
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_roster.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateStudentListHTML = () => {
    const rows = sortedStudents.map(s => `
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${s.name}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${s.section || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${s.contact?.guardianName || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${s.contact?.email || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${s.contact?.phone || ''}</td>
        </tr>
    `).join('');

    return `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Name</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Section</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Guardian</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Email</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Phone</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
  };

  const handlePrint = () => {
    const content = generateStudentListHTML();
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
        printWindow.document.write(`<html><head><title>Student Roster</title></head><body><h1>Student Roster</h1>${content}</body></html>`);
        printWindow.document.close();
        printWindow.print();
    }
  };

  const handleEmail = () => {
    const subject = "Student Roster";
    const body = generateStudentListHTML();
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`<html><body>${body}</body></html>`)}`;
  };

  // Regular CRUD
  const handleSave = (student: Student) => {
    if (editingStudent) {
      setStudents(students.map(s => s.id === student.id ? student : s));
    } else {
      setStudents([...students, student]);
    }
    setIsFormOpen(false);
    setEditingStudent(undefined);
  };

  const handleDelete = () => {
    if (deletingStudent) {
      setStudents(students.filter(s => s.id !== deletingStudent.id));
      setSubjects(prev => prev.map(sub => ({ ...sub, studentIds: sub.studentIds.filter(id => id !== deletingStudent.id) })));
      setDeletingStudent(undefined);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Student Roster</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="block w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500" 
                    placeholder="Search students..." 
                />
            </div>
            <button onClick={() => { setEditingStudent(undefined); setIsFormOpen(true); }} className="flex justify-center items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 whitespace-nowrap">
            <Plus className="w-5 h-5 mr-2" /> Add Student
            </button>
        </div>
      </div>

       <div className="flex flex-wrap gap-2 mb-4">
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

      {selectedIds.size > 0 && (
          <div className="bg-primary-50 dark:bg-primary-900/40 p-3 rounded-lg mb-4 flex flex-wrap items-center justify-between border border-primary-200 dark:border-primary-800">
              <span className="text-sm font-medium text-primary-800 dark:text-primary-200 mb-2 sm:mb-0">
                  {selectedIds.size} student{selectedIds.size !== 1 && 's'} selected
              </span>
              <div className="flex space-x-2">
                  <button onClick={() => setBulkAction('subject')} className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                      <BookOpen className="w-4 h-4 mr-2" /> Assign Subject
                  </button>
                  <button onClick={() => setBulkAction('contact')} className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                      <User className="w-4 h-4 mr-2" /> Edit Guardian
                  </button>
                  <button onClick={() => setBulkAction('delete')} className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded text-sm hover:bg-red-50 dark:hover:bg-red-900/30">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </button>
                   <button onClick={() => setSelectedIds(new Set())} className="flex items-center px-3 py-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400">
                      <X className="w-4 h-4" />
                  </button>
              </div>
          </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                    checked={sortedStudents.length > 0 && selectedIds.size === sortedStudents.length}
                    onChange={handleSelectAll}
                  />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('name')}
              >
                  <div className="flex items-center group">
                    Name
                    <ArrowUpDown className={`ml-1 w-3 h-3 transition-opacity ${sortConfig?.key === 'name' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                  </div>
              </th>
               <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('section')}
              >
                  <div className="flex items-center group">
                    Section
                    <ArrowUpDown className={`ml-1 w-3 h-3 transition-opacity ${sortConfig?.key === 'section' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                  </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('guardianName')}
              >
                  <div className="flex items-center group">
                    Guardian Name
                    <ArrowUpDown className={`ml-1 w-3 h-3 transition-opacity ${sortConfig?.key === 'guardianName' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                  </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('email')}
              >
                  <div className="flex items-center group">
                    Contact Info
                    <ArrowUpDown className={`ml-1 w-3 h-3 transition-opacity ${sortConfig?.key === 'email' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                  </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedStudents.length > 0 ? sortedStudents.map(student => (
              <tr key={student.id} className={selectedIds.has(student.id) ? 'bg-primary-50 dark:bg-primary-900/20' : ''}>
                <td className="px-6 py-4">
                    <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                        checked={selectedIds.has(student.id)}
                        onChange={() => handleSelectRow(student.id)}
                    />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {student.section || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {student.contact?.guardianName || '-'}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col">
                        {student.contact?.email && <span className="flex items-center mb-0.5"><Mail className="w-3 h-3 mr-1"/> {student.contact.email}</span>}
                        {student.contact?.phone && <span className="flex items-center"><Phone className="w-3 h-3 mr-1"/> {student.contact.phone}</span>}
                        {!student.contact?.email && !student.contact?.phone && '-'}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => { setEditingStudent(student); setIsFormOpen(true); }} className="p-2 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => setDeletingStudent(student)} className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                        No students found matching your search.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {isFormOpen && <StudentForm student={editingStudent} onSave={handleSave} onCancel={() => { setIsFormOpen(false); setEditingStudent(undefined); }} />}
      {deletingStudent && <ConfirmationModal onConfirm={handleDelete} onCancel={() => setDeletingStudent(undefined)} message={`Are you sure you want to delete ${deletingStudent.name}? This action cannot be undone.`} />}
      
      {/* Bulk Action Modals */}
      {bulkAction === 'subject' && (
          <BulkSubjectModal 
            count={selectedIds.size} 
            onClose={() => setBulkAction(null)} 
            onSave={handleBulkSubjectAssign} 
            subjects={subjects} 
          />
      )}
      {bulkAction === 'contact' && (
          <BulkContactModal 
            count={selectedIds.size} 
            onClose={() => setBulkAction(null)} 
            onSave={handleBulkContactUpdate} 
          />
      )}
      {bulkAction === 'delete' && (
          <ConfirmationModal 
            onConfirm={handleBulkDelete} 
            onCancel={() => setBulkAction(null)} 
            message={`Are you sure you want to delete the ${selectedIds.size} selected students? This action cannot be undone.`} 
          />
      )}
    </div>
  );
};

export default StudentsPage;
