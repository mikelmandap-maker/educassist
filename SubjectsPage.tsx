import React, { useState, useRef, useEffect } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Subject, Student } from '../types';
import { Plus, Edit, Trash2, X, BookOpen, MoreVertical, FileDown, Printer, Mail } from 'lucide-react';

const SubjectForm: React.FC<{ subject?: Subject; onSave: (subject: Subject) => void; onCancel: () => void; allStudents: Student[]; }> = ({ subject, onSave, onCancel, allStudents }) => {
  const [name, setName] = useState(subject?.name || '');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(subject?.studentIds || []);

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: subject?.id || `sub${Date.now()}`,
      name,
      studentIds: selectedStudentIds,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{subject ? 'Edit Subject' : 'Add Subject'}</h2>
          <button onClick={onCancel} aria-label="Close"><X className="w-6 h-6"/></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700" />
          </div>
          <div className="mb-4 flex-grow overflow-y-auto">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Enrolled Students</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto border dark:border-gray-600 rounded-md p-2">
              {[...allStudents].sort((a, b) => a.name.localeCompare(b.name)).map(student => (
                <div key={student.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`student-${student.id}`}
                    checked={selectedStudentIds.includes(student.id)}
                    onChange={() => handleStudentToggle(student.id)}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor={`student-${student.id}`} className="ml-3 text-sm text-gray-700 dark:text-gray-200">{student.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t dark:border-gray-600">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const SubjectsPage: React.FC = () => {
  const { subjects, setSubjects, students } = useAppData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined);
  const [deletingSubject, setDeletingSubject] = useState<Subject | undefined>(undefined);
  const [actionMenuSubjectId, setActionMenuSubjectId] = useState<string | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
            setActionMenuSubjectId(null);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuContainerRef]);

  const handleSave = (subject: Subject) => {
    if (editingSubject) {
      setSubjects(subjects.map(s => s.id === subject.id ? subject : s));
    } else {
      setSubjects([...subjects, subject]);
    }
    setIsFormOpen(false);
    setEditingSubject(undefined);
  };
  
  const handleDelete = () => {
    if (deletingSubject) {
        setSubjects(subjects.filter(s => s.id !== deletingSubject.id));
        setDeletingSubject(undefined);
    }
  };

  const getEnrolledStudents = (subject: Subject): Student[] => {
    return students.filter(s => subject.studentIds.includes(s.id)).sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleExportCSV = (subject: Subject) => {
    setActionMenuSubjectId(null);
    const enrolledStudents = getEnrolledStudents(subject);
    const headers = ["ID", "Name", "Section", "Guardian Name", "Guardian Email", "Guardian Phone"];
    const csvRows = [
        headers.join(','),
        ...enrolledStudents.map(s => [
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
    link.setAttribute('download', `${subject.name.replace(/\s+/g, '_')}_students.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateStudentListHTML = (subject: Subject) => {
    const enrolledStudents = getEnrolledStudents(subject);
    const rows = enrolledStudents.map(s => `
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${s.name}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${s.section || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${s.contact?.guardianName || ''}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${s.contact?.email || ''}</td>
        </tr>
    `).join('');

    return `
        <h1>Student List for ${subject.name}</h1>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Name</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Section</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Guardian</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Email</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
  };

  const handlePrint = (subject: Subject) => {
    setActionMenuSubjectId(null);
    const content = generateStudentListHTML(subject);
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
        printWindow.document.write(`<html><head><title>Student List - ${subject.name}</title></head><body>${content}</body></html>`);
        printWindow.document.close();
        printWindow.print();
    }
  };

  const handleEmail = (subject: Subject) => {
    setActionMenuSubjectId(null);
    const emailSubject = `Student List for ${subject.name}`;
    const body = generateStudentListHTML(subject);
    window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(`<html><body>${body}</body></html>`)}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Subjects & Classes</h1>
        <button onClick={() => { setEditingSubject(undefined); setIsFormOpen(true); }} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <Plus className="w-5 h-5 mr-2" /> Add Subject
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => (
          <div key={subject.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col">
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                  <div className="flex items-center mb-2">
                    <BookOpen className="w-6 h-6 mr-3 text-primary-500"/>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{subject.name}</h2>
                  </div>
                  <div className="relative" ref={actionMenuSubjectId === subject.id ? menuContainerRef : null}>
                    <button onClick={() => setActionMenuSubjectId(actionMenuSubjectId === subject.id ? null : subject.id)} className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="More options">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                     {actionMenuSubjectId === subject.id && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border dark:border-gray-700 py-1">
                            <button onClick={() => { setEditingSubject(subject); setIsFormOpen(true); setActionMenuSubjectId(null); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </button>
                            <button onClick={() => { setDeletingSubject(subject); setActionMenuSubjectId(null); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </button>
                            <div className="my-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                            <button onClick={() => handleExportCSV(subject)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <FileDown className="w-4 h-4 mr-2" /> Export CSV
                            </button>
                            <button onClick={() => handlePrint(subject)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Printer className="w-4 h-4 mr-2" /> Print List
                            </button>
                            <button onClick={() => handleEmail(subject)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Mail className="w-4 h-4 mr-2" /> Email List
                            </button>
                        </div>
                    )}
                  </div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">{subject.studentIds.length} students enrolled</p>
              <ul className="text-sm text-gray-500 dark:text-gray-300 space-y-1">
                {subject.studentIds.slice(0, 5).map(id => {
                  const student = students.find(s => s.id === id);
                  return <li key={id}>{student?.name}</li>;
                })}
                {subject.studentIds.length > 5 && <li className="text-xs">...and {subject.studentIds.length - 5} more.</li>}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && <SubjectForm subject={editingSubject} onSave={handleSave} onCancel={() => setIsFormOpen(false)} allStudents={students} />}
      {deletingSubject && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
                    <h3 className="text-lg font-bold">Confirm Deletion</h3>
                    <p className="my-4 text-gray-600 dark:text-gray-300">Are you sure you want to delete the subject "{deletingSubject.name}"?</p>
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setDeletingSubject(undefined)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default SubjectsPage;