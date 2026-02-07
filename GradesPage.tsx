import React, { useState, useMemo } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Student, GradeItem } from '../types';
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, AlertCircle, Percent, Printer, Mail, ArrowUpDown, FileDown } from 'lucide-react';

const GradeItemForm: React.FC<{
    item?: GradeItem;
    onSave: (item: GradeItem) => void;
    onCancel: () => void;
}> = ({ item, onSave, onCancel }) => {
    const [name, setName] = useState(item?.name || '');
    const [score, setScore] = useState<string>(item?.score.toString() || '');
    const [total, setTotal] = useState<string>(item?.total.toString() || '100');
    const [weight, setWeight] = useState<string>((item?.weight * 100 || 0).toString());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: item?.id || `g${Date.now()}`,
            name,
            score: parseFloat(score),
            total: parseFloat(total),
            weight: parseFloat(weight) / 100,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">{item ? 'Edit Grade' : 'Add Grade'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Item Name (e.g., Quiz 1)" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border dark:border-gray-600 rounded dark:bg-gray-700"/>
                    <div className="flex gap-2">
                        <input type="number" placeholder="Score" value={score} onChange={e => setScore(e.target.value)} required className="w-full p-2 border dark:border-gray-600 rounded dark:bg-gray-700"/>
                        <input type="number" placeholder="Total" value={total} onChange={e => setTotal(e.target.value)} required className="w-full p-2 border dark:border-gray-600 rounded dark:bg-gray-700"/>
                    </div>
                     <div className="relative">
                        <input type="number" placeholder="Weight (%)" value={weight} onChange={e => setWeight(e.target.value)} className="w-full p-2 border dark:border-gray-600 rounded dark:bg-gray-700"/>
                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const GradesPage: React.FC = () => {
    const { students, subjects, grades, setGrades } = useAppData();
    const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
    const [selectedSection, setSelectedSection] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'grade'; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<{ studentId: string; item?: GradeItem }>({ studentId: '' });
    
    const studentsInSubject = useMemo(() => 
        students.filter(s => subjects.find(sub => sub.id === selectedSubjectId)?.studentIds.includes(s.id)),
        [students, subjects, selectedSubjectId]
    );

    const availableSections = useMemo(() => {
        const sections = new Set(studentsInSubject.map(s => s.section).filter(Boolean));
        return ['All', ...Array.from(sections).sort()];
    }, [studentsInSubject]);

    const calculateOverallGrade = (items: GradeItem[]): number => {
        if (items.length === 0) return 0;
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        if (totalWeight === 0) {
            if (items.length === 0) return 0;
            const simpleAvg = items.reduce((sum, item) => sum + (item.score / item.total), 0) / items.length;
            return simpleAvg * 100;
        }
        const weightedSum = items.reduce((sum, item) => sum + (item.score / item.total) * item.weight, 0);
        return (weightedSum / totalWeight) * 100;
    };

    const studentsWithGrades = useMemo(() => 
        studentsInSubject
            .filter(s => selectedSection === 'All' || s.section === selectedSection)
            .map(student => ({
                ...student,
                gradeItems: grades.find(g => g.studentId === student.id && g.subjectId === selectedSubjectId)?.items || [],
                overallGrade: calculateOverallGrade(grades.find(g => g.studentId === student.id && g.subjectId === selectedSubjectId)?.items || [])
            })),
        [studentsInSubject, grades, selectedSubjectId, selectedSection]
    );

    const sortedStudents = useMemo(() => {
        return [...studentsWithGrades].sort((a, b) => {
            if (sortConfig.key === 'name') {
                return a.name.localeCompare(b.name) * (sortConfig.direction === 'asc' ? 1 : -1);
            } else {
                return (a.overallGrade - b.overallGrade) * (sortConfig.direction === 'asc' ? 1 : -1);
            }
        });
    }, [studentsWithGrades, sortConfig]);

    const handleSort = (key: 'name' | 'grade') => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };
    
    const handleSaveItem = (item: GradeItem) => {
        const { studentId } = editingItem;
        setGrades(prev => {
            const studentGradesExist = prev.some(g => g.studentId === studentId && g.subjectId === selectedSubjectId);
            if (!studentGradesExist) {
                return [...prev, { studentId, subjectId: selectedSubjectId, items: [item] }];
            }
            return prev.map(g => {
                if (g.studentId === studentId && g.subjectId === selectedSubjectId) {
                    const itemExists = g.items.some(i => i.id === item.id);
                    const newItems = itemExists ? g.items.map(i => i.id === item.id ? item : i) : [...g.items, item];
                    return { ...g, items: newItems };
                }
                return g;
            });
        });
        setIsFormOpen(false);
        setEditingItem({ studentId: '' });
    };

    const handleDeleteItem = (studentId: string, itemId: string) => {
        setGrades(prev => prev.map(g => {
            if (g.studentId === studentId && g.subjectId === selectedSubjectId) {
                return { ...g, items: g.items.filter(i => i.id !== itemId) };
            }
            return g;
        }));
    };

    const generateReportHTML = () => {
        const subjectName = subjects.find(s => s.id === selectedSubjectId)?.name;
        const rows = sortedStudents.map(student => `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${student.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${student.overallGrade.toFixed(1)}%</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${student.gradeItems.map(i => `${i.name}: ${i.score}/${i.total}`).join('<br>')}</td>
            </tr>
        `).join('');

        return `
            <h2 style="font-size: 1.5rem; font-weight: bold;">Grade Report</h2>
            <p><strong>Subject:</strong> ${subjectName}</p>
            <p><strong>Section:</strong> ${selectedSection}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Student</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right; background-color: #f3f4f6;">Overall</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Details</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    };

    const handlePrint = () => {
        const content = generateReportHTML();
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write(`<html><head><title>Grade Report</title></head><body>${content}</body></html>`);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const handleEmail = () => {
        const subjectName = subjects.find(s => s.id === selectedSubjectId)?.name;
        const subject = `Grade Report for ${subjectName} - Section ${selectedSection}`;
        const body = generateReportHTML();
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const handleExportCSV = () => {
        const subjectName = subjects.find(s => s.id === selectedSubjectId)?.name || 'grades';
        const headers = ["Student Name", "Section", "Overall Grade (%)", "Grade Item", "Score", "Total", "Weight (%)"];
        
        const csvRows = [headers.join(',')];
    
        sortedStudents.forEach(student => {
            if (student.gradeItems.length === 0) {
                csvRows.push([
                    `"${student.name.replace(/"/g, '""')}"`,
                    `"${student.section || ''}"`,
                    student.overallGrade.toFixed(1),
                    "No items", "", "", ""
                ].join(','));
            } else {
                student.gradeItems.forEach(item => {
                    csvRows.push([
                        `"${student.name.replace(/"/g, '""')}"`,
                        `"${student.section || ''}"`,
                        student.overallGrade.toFixed(1),
                        `"${item.name.replace(/"/g, '""')}"`,
                        item.score,
                        item.total,
                        (item.weight * 100).toFixed(0)
                    ].join(','));
                });
            }
        });
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `grades_${subjectName}_${selectedSection}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold">Grades & Performance</h1>
                <div className="flex flex-col sm:flex-row gap-2">
                    <select
                        value={selectedSubjectId}
                        onChange={e => { setSelectedSubjectId(e.target.value); setSelectedSection('All'); }}
                        className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <select
                        value={selectedSection}
                        onChange={e => setSelectedSection(e.target.value)}
                        className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                        {availableSections.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={handleExportCSV} className="flex items-center justify-center p-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"><FileDown className="w-5 h-5"/></button>
                    <button onClick={handlePrint} className="flex items-center justify-center p-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"><Printer className="w-5 h-5"/></button>
                    <button onClick={handleEmail} className="flex items-center justify-center p-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"><Mail className="w-5 h-5"/></button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th onClick={() => handleSort('name')} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"><div className="flex items-center">Student Name <ArrowUpDown size={14} className="ml-1"/></div></th>
                                <th onClick={() => handleSort('grade')} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"><div className="flex items-center">Overall Grade <ArrowUpDown size={14} className="ml-1"/></div></th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Grade Items</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {sortedStudents.map(student => {
                                const { overallGrade, gradeItems } = student;
                                const gradeColor = overallGrade >= 85 ? 'text-green-500' : overallGrade >= 70 ? 'text-yellow-500' : 'text-red-500';

                                return (
                                    <tr key={student.id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{student.name}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap font-semibold ${gradeColor}`}>{overallGrade.toFixed(1)}%</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {gradeItems.length > 0 ? (
                                                gradeItems.map(item => (
                                                    <div key={item.id} className="flex justify-between items-center py-0.5">
                                                        <span>{item.name} <span className="text-xs">({item.score}/{item.total})</span></span>
                                                        <div className="flex items-center gap-2 ml-4">
                                                            <button onClick={() => { setEditingItem({ studentId: student.id, item }); setIsFormOpen(true); }} className="p-1 hover:text-primary-500" aria-label="Edit grade item"><Edit size={14}/></button>
                                                            <button onClick={() => handleDeleteItem(student.id, item.id)} className="p-1 hover:text-red-500" aria-label="Delete grade item"><Trash2 size={14}/></button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : <span>No grades entered.</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button onClick={() => { setEditingItem({ studentId: student.id }); setIsFormOpen(true); }} className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline">
                                                <Plus size={16} className="mr-1"/> Add Item
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {isFormOpen && <GradeItemForm item={editingItem.item} onSave={handleSaveItem} onCancel={() => setIsFormOpen(false)} />}
        </div>
    );
};

export default GradesPage;