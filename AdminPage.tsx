import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAppData } from '../hooks/useAppData';
import { 
    Lock, CreditCard, DollarSign, Users, Plus, Trash2, ArrowUpDown, Search, Printer, Filter, FileText, Mail, Edit, 
    X, XCircle, CheckCircle, Smartphone, Globe, Book, TrendingUp, User as UserIcon, Shield, ArrowDownLeft, ArrowUpRight, Key,
    FileDown, Eye, EyeOff
} from 'lucide-react';
import { Student, GradeItem, FinanceHistoryAction, ManualTransaction } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
// FIX: Import date-fns functions from their specific sub-packages.
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import subDays from 'date-fns/subDays';
import subHours from 'date-fns/subHours';

const StudentFormModal: React.FC<{ student?: Student; onSave: (student: Student) => void; onCancel: () => void; }> = ({ student, onSave, onCancel }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{student ? 'Edit Student' : 'Add Student'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" placeholder="Student Name" />
          <input type="text" value={section} onChange={e => setSection(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" placeholder="Section (e.g., Grade 10-A)" />
          <input type="text" value={guardianName} onChange={e => setGuardianName(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" placeholder="Guardian Name" />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" placeholder="Guardian Email" />
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" placeholder="Guardian Phone" />
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmationModal: React.FC<{ onConfirm: () => void; onCancel: () => void; message: string; confirmText?: string; }> = ({ onConfirm, onCancel, message, confirmText = "Confirm" }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold">Confirmation Required</h3>
            <p className="my-4 text-gray-600 dark:text-gray-300">{message}</p>
            <div className="flex justify-end space-x-2">
                <button onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md">{confirmText}</button>
            </div>
        </div>
    </div>
);

const HistoryLogIcon: React.FC<{ action: FinanceHistoryAction }> = ({ action }) => {
    const iconProps = { className: "w-5 h-5 text-gray-600 dark:text-gray-300" };
    switch (action) {
        case 'bill_printed': return <FileText {...iconProps} />;
        case 'bulk_bills_printed': return <FileText {...iconProps} />;
        case 'finance_report_printed': return <Printer {...iconProps} />;
        default: return <Users {...iconProps} />;
    }
};

const FinancialsLogin: React.FC<{
    onSubmit: (e: React.FormEvent) => void;
    username: string;
    onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    password: string;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isAuthenticating: boolean;
    loginError: string;
}> = React.memo(({
    onSubmit,
    username,
    onUsernameChange,
    password,
    onPasswordChange,
    isAuthenticating,
    loginError
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mt-4">
            <div className="flex flex-col items-center text-center">
                <Shield className="h-10 w-10 text-primary-500" />
                <h2 className="mt-2 text-xl font-bold">Unlock Financial Section</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Please re-authenticate to access sensitive settings.</p>
            </div>
            <form className="mt-4 max-w-sm mx-auto" onSubmit={onSubmit}>
                <div className="space-y-3">
                    <div>
                        <label htmlFor="admin-username-sec" className="sr-only">Username</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-gray-400 transition-colors duration-200 group-focus-within:text-primary-500" />
                            </div>
                            <input
                                id="admin-username-sec"
                                type="text"
                                required
                                value={username}
                                onChange={onUsernameChange}
                                className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-colors duration-200"
                                placeholder="Username"
                                aria-label="Financials Section Username"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="admin-password-sec" className="sr-only">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Key className="h-5 w-5 text-gray-400 transition-colors duration-200 group-focus-within:text-primary-500" />
                            </div>
                            <input
                                id="admin-password-sec"
                                type="password"
                                required
                                value={password}
                                onChange={onPasswordChange}
                                className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-colors duration-200"
                                placeholder="Password"
                                aria-label="Financials Section Password"
                            />
                        </div>
                    </div>
                </div>
                {loginError && <p className="mt-2 text-center text-sm text-red-600">{loginError}</p>}
                <div className="mt-4">
                    <button type="submit" disabled={isAuthenticating} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400">
                        {isAuthenticating ? (
                            <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div> Authenticating...</>
                        ) : (
                            'Authenticate & Unlock'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
});

const AdminPage: React.FC = () => {
    const { 
        students, setStudents, subjects, setSubjects, appUsers, setAppUsers, grades,
        financeHistory, addFinanceHistory, currentUser, manualTransactions, setManualTransactions
    } = useAppData();

    const [isPanelUnlocked, setIsPanelUnlocked] = useState(false);
    const [panelUsername, setPanelUsername] = useState('');
    const [panelPassword, setPanelPassword] = useState('');
    const [panelLoginError, setPanelLoginError] = useState('');

    const [isFinancialsUnlocked, setIsFinancialsUnlocked] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [financeLoginHistory, setFinanceLoginHistory] = useState([
        { timestamp: subHours(new Date(), 2).toISOString(), user: 'admin' },
        { timestamp: subDays(new Date(), 1).toISOString(), user: 'admin' },
    ]);
    const [financeUsername, setFinanceUsername] = useState('Finance');
    const [financePassword, setFinancePassword] = useState('Finance123');

    // Credential Change Modal State
    const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);
    const [credentialChangeType, setCredentialChangeType] = useState<'username' | 'password' | null>(null);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    const [newUserUsername, setNewUserUsername] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState<'admin' | 'teacher'>('teacher');
    
    const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | undefined>();
    const [deletingStudent, setDeletingStudent] = useState<Student | undefined>();
    
    const [paymentMethods, setPaymentMethods] = useState([
        { id: 'stripe', name: 'Credit/Debit Card (Stripe)', icon: CreditCard, connected: true },
        { id: 'bank', name: 'Online Banking', icon: Globe, connected: false },
        { id: 'gcash', name: 'GCash', icon: Smartphone, connected: true },
    ]);

    const [studentSortConfig, setStudentSortConfig] = useState<{ key: 'name' | 'section'; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
    const [studentSearchTerm, setStudentSearchTerm] = useState('');
    const [studentFilterSection, setStudentFilterSection] = useState('All');
    const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());

    // Manual transaction state
    const [newTransactionDesc, setNewTransactionDesc] = useState('');
    const [newTransactionAmount, setNewTransactionAmount] = useState('');
    const [newTransactionType, setNewTransactionType] = useState<'incoming' | 'outgoing'>('incoming');
    const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);

    const availableSections = useMemo(() => {
        const sections = new Set(students.map(s => s.section).filter(Boolean));
        return ['All', ...Array.from(sections).sort()];
    }, [students]);

    const tuitionPerStudent = 1500; 
    const totalRevenue = students.length * tuitionPerStudent;
    const collectionRate = 0.85; // Simulate that 85% of total revenue is collected
    const collectedAmount = Math.floor(totalRevenue * collectionRate);
    const pendingAmount = totalRevenue - collectedAmount;

    const studentFinancials = useMemo(() => {
        const financials = new Map<string, { payments: { date: string; amount: number }[], balance: number, totalDue: number }>();
        students.forEach(student => {
            const totalDue = tuitionPerStudent;
            const targetPaidAmount = totalDue * (Math.random() * (0.95 - 0.6) + 0.6); // each student paid between 60% and 95%
            let amountPaid = 0;
            const payments = [];
            const numPayments = Math.floor(Math.random() * 3) + 1;

            for (let i = 0; i < numPayments; i++) {
                let paymentAmount;
                if (i === numPayments - 1) {
                    paymentAmount = targetPaidAmount - amountPaid;
                } else {
                    paymentAmount = Math.floor(Math.random() * (targetPaidAmount / numPayments));
                }
                amountPaid += paymentAmount;
                payments.push({
                    date: format(subDays(new Date(), Math.floor(Math.random() * 90)), 'yyyy-MM-dd'),
                    amount: paymentAmount,
                });
            }
            
            financials.set(student.id, {
                totalDue,
                payments,
                balance: totalDue - amountPaid,
            });
        });
        return financials;
    }, [students, tuitionPerStudent]);

    const financialData = [
        { name: 'Projected', value: totalRevenue, fill: '#3b82f6' },
        { name: 'Collected', value: collectedAmount, fill: '#22c55e' },
        { name: 'Pending', value: pendingAmount, fill: '#ef4444' },
    ];
    
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

    const schoolAverageGrade = useMemo(() => {
        const allOverallGrades = grades.map(g => calculateOverallGrade(g.items)).filter(grade => grade > 0);
        if (allOverallGrades.length === 0) return 0;
        return allOverallGrades.reduce((sum, grade) => sum + grade, 0) / allOverallGrades.length;
    }, [grades]);

    const studentDistribution = useMemo(() => {
        const sectionCounts: { [key: string]: number } = {};
        students.forEach(student => {
            const section = student.section || 'Unassigned';
            sectionCounts[section] = (sectionCounts[section] || 0) + 1;
        });
        return Object.entries(sectionCounts).map(([name, value]) => ({ name, value }));
    }, [students]);

    const handlePrint = (title: string, contentHtml: string) => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head><title>${title}</title><style>body {font-family: sans-serif;} table {width: 100%; border-collapse: collapse;} th, td {border: 1px solid #ddd; padding: 8px;} th { background-color: #f2f2f2; } ul {padding-left: 20px; margin: 0;} .no-print { display: none; }</style></head>
                    <body>${contentHtml}</body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };
    
    const generateBillingStatementHTML = (student: Student) => {
        const financials = studentFinancials.get(student.id);
        if (!financials) return '<p>No financial data available.</p>';
        const paymentHistory = financials.payments.map(p => `<tr><td>${p.date}</td><td>Payment Received</td><td style="text-align: right;">₱${p.amount.toFixed(2)}</td></tr>`).join('');
        return `
            <h2>Billing Statement for ${student.name}</h2>
            <p><strong>Date:</strong> ${format(new Date(), 'yyyy-MM-dd')}</p>
            <p><strong>Student ID:</strong> ${student.id}</p>
            <hr style="margin: 1rem 0;" />
            <table style="width: 100%;">
                <thead><tr><th>Date</th><th>Description</th><th style="text-align: right;">Amount</th></tr></thead>
                <tbody>
                    <tr><td>${format(subDays(new Date(), 90), 'yyyy-MM-dd')}</td><td>Tuition Fee</td><td style="text-align: right;">₱${financials.totalDue.toFixed(2)}</td></tr>
                    ${paymentHistory}
                </tbody>
                <tfoot>
                    <tr><td colspan="2" style="text-align: right; font-weight: bold; border-top: 2px solid #333;">Balance Due:</td><td style="text-align: right; font-weight: bold; border-top: 2px solid #333;">₱${financials.balance.toFixed(2)}</td></tr>
                </tfoot>
            </table>
        `;
    };

    const printFinanceStatement = () => {
        const studentRows = students.map(student => {
            const financials = studentFinancials.get(student.id);
            if (!financials) return '';
            const paymentHistory = financials.payments.map(p => `<li>${p.date}: ₱${p.amount.toFixed(2)}</li>`).join('');
            return `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.section || 'N/A'}</td>
                    <td style="text-align: right;">₱${financials.totalDue.toFixed(2)}</td>
                    <td><ul>${paymentHistory || 'No payments'}</ul></td>
                    <td style="text-align: right; color: ${financials.balance > 0 ? 'red' : 'green'};">₱${financials.balance.toFixed(2)}</td>
                </tr>
            `;
        }).join('');
    
        const contentHtml = `
            <h1>Detailed Financial Statement</h1>
            <p>Generated on: ${format(new Date(), 'yyyy-MM-dd')}</p>
            <h3>Overall Summary</h3>
            <p><strong>Projected Revenue:</strong> ₱${totalRevenue.toLocaleString()}</p>
            <p><strong>Total Collected:</strong> ₱${collectedAmount.toLocaleString()}</p>
            <p><strong>Total Outstanding:</strong> ₱${pendingAmount.toLocaleString()}</p>
            <hr style="margin: 1rem 0;" />
            <h3>Student Breakdown</h3>
            <table>
                <thead>
                    <tr><th>Student</th><th>Section</th><th style="text-align: right;">Total Due</th><th>Payment History</th><th style="text-align: right;">Balance</th></tr>
                </thead>
                <tbody>${studentRows}</tbody>
            </table>
        `;
        addFinanceHistory('finance_report_printed', 'Printed detailed financial statement.');
        handlePrint("Detailed Financial Statement", contentHtml);
    };

    const printBillingStatement = (student: Student) => {
        addFinanceHistory('bill_printed', `Printed billing statement for ${student.name}.`);
        handlePrint(`Billing Statement - ${student.name}`, generateBillingStatementHTML(student));
    };

    const handleBulkPrintBilling = () => {
        const selectedStudents = students.filter(s => selectedStudentIds.has(s.id));
        const allStatements = selectedStudents.map(s => `<div style="page-break-after: always;">${generateBillingStatementHTML(s)}</div>`).join('');
        addFinanceHistory('bulk_bills_printed', `Printed billing statements for ${selectedStudentIds.size} students.`);
        handlePrint("Bulk Billing Statements", allStatements);
    };

    const handleBulkEmail = () => {
        const selectedStudents = students.filter(s => selectedStudentIds.has(s.id));
        const emails = selectedStudents
            .map(s => s.contact?.email)
            .filter((email): email is string => !!email);
        if (emails.length > 0) {
            window.location.href = `mailto:?bcc=${emails.join(',')}`;
        } else {
            alert("No email addresses found for the selected students.");
        }
    };
    
    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserUsername || !newUserPassword) return;
        setAppUsers([...appUsers, { id: `u${Date.now()}`, username: newUserUsername, password: newUserPassword, role: newUserRole }]);
        setNewUserUsername(''); setNewUserPassword('');
    };
    
    const handleSaveStudent = (studentData: Student) => {
        if (editingStudent) {
            setStudents(prev => prev.map(s => s.id === studentData.id ? studentData : s));
        } else {
            setStudents(prev => [...prev, studentData]);
        }
        setIsStudentFormOpen(false);
        setEditingStudent(undefined);
    };

    const handleConfirmDelete = () => {
        if (deletingStudent) {
            setStudents(prev => prev.filter(s => s.id !== deletingStudent.id));
            setSubjects(prev => prev.map(sub => ({
                ...sub,
                studentIds: sub.studentIds.filter(id => id !== deletingStudent.id)
            })));
            setDeletingStudent(undefined);
        }
    };
    
    const handleDeleteUser = (id: string) => setAppUsers(appUsers.filter(u => u.id !== id));
    const toggleConnection = (id: string) => setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, connected: !m.connected } : m));
    const handleSortStudents = (key: 'name' | 'section') => setStudentSortConfig(current => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }));

    const filteredStudents = useMemo(() => students.filter(s => 
        (s.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) || (s.contact?.guardianName || '').toLowerCase().includes(studentSearchTerm.toLowerCase())) &&
        (studentFilterSection === 'All' || s.section === studentFilterSection)
    ), [students, studentSearchTerm, studentFilterSection]);

    const sortedStudents = useMemo(() => [...filteredStudents].sort((a, b) => {
        const key = studentSortConfig.key;
        const dir = studentSortConfig.direction === 'asc' ? 1 : -1;
        const valA = (key === 'section' ? (a.section || '') : a.name).toLowerCase();
        const valB = (key === 'section' ? (b.section || '') : b.name).toLowerCase();
        return valA.localeCompare(valB) * dir;
    }), [filteredStudents, studentSortConfig]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedStudentIds(new Set(sortedStudents.map(s => s.id)));
        } else {
            setSelectedStudentIds(new Set());
        }
    };

    const handleSelectRow = (id: string) => {
        const newSelected = new Set(selectedStudentIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedStudentIds(newSelected);
    };

    const handlePanelLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setPanelLoginError('');
        const user = appUsers.find(u => u.username === panelUsername && u.password === panelPassword);

        if (user && user.role === 'admin') {
            setIsPanelUnlocked(true);
        } else {
            setPanelLoginError('Invalid admin credentials.');
        }
    };

    const handlePanelLock = () => {
        setIsPanelUnlocked(false);
        setPanelUsername('');
        setPanelPassword('');
        setPanelLoginError('');
    };
    
    const handleFinancialsLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setIsAuthenticating(true);

        setTimeout(() => {
            if (adminUsername === financeUsername && adminPassword === financePassword) {
                setIsFinancialsUnlocked(true);
                setAdminUsername('');
                setAdminPassword('');
                setFinanceLoginHistory(prev => [
                    { timestamp: new Date().toISOString(), user: currentUser?.username || 'Unknown Admin' }, 
                    ...prev
                ]);
            } else {
                setLoginError('Invalid credentials or insufficient permissions.');
                setAdminPassword('');
            }
            setIsAuthenticating(false);
        }, 1000);
    };

    const handleFinancialsLock = () => {
        setIsFinancialsUnlocked(false);
        setAdminUsername('');
        setAdminPassword('');
        setLoginError('');
    };

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTransactionDesc.trim() || !newTransactionAmount) return;

        const newTransaction: ManualTransaction = {
            id: `mt-${Date.now()}`,
            timestamp: new Date().toISOString(),
            description: newTransactionDesc.trim(),
            amount: parseFloat(newTransactionAmount),
            type: newTransactionType,
        };

        setManualTransactions(prev => [newTransaction, ...prev]);

        // Reset form
        setNewTransactionDesc('');
        setNewTransactionAmount('');
        setNewTransactionType('incoming');
    };
    
    const handleDeleteTransaction = () => {
        if (deletingTransactionId) {
            setManualTransactions(prev => prev.filter(t => t.id !== deletingTransactionId));
            setDeletingTransactionId(null);
        }
    };


    const generateFinancialsHTML = () => {
        const historyRows = financeHistory.map(event => `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${new Date(event.timestamp).toLocaleString()}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${event.action.replace(/_/g, ' ')}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${event.details}</td>
            </tr>
        `).join('');
    
        const transactionRows = manualTransactions.map(tx => `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${format(new Date(tx.timestamp), 'MMMM d, yyyy h:mm a')}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${tx.description}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right; color: ${tx.type === 'incoming' ? 'green' : 'red'};">
                    ${tx.type === 'outgoing' ? '-' : '+'}₱${tx.amount.toFixed(2)}
                </td>
            </tr>
        `).join('');
    
        return `
            <h2 style="font-size: 1.5rem; font-weight: bold;">Financial Activity Log</h2>
            <h3 style="font-size: 1.2rem; margin-top: 1rem;">System History</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Timestamp</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Action</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Details</th>
                    </tr>
                </thead>
                <tbody>${historyRows}</tbody>
            </table>
            <h3 style="font-size: 1.2rem; margin-top: 2rem;">Manual Transactions</h3>
            <table style="width: 100%; border-collapse: collapse;">
                 <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Date</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f3f4f6;">Description</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right; background-color: #f3f4f6;">Amount</th>
                    </tr>
                </thead>
                <tbody>${transactionRows}</tbody>
            </table>
        `;
    };
    
    const handlePrintFinancials = () => {
        const content = generateFinancialsHTML();
        handlePrint("Financial Activity Report", content);
    };
    
    const handleSaveFinancialsCSV = () => {
        const headers = ["Timestamp", "Action/Description", "Details", "Amount", "Type"];
        const rows = [headers.join(',')];
    
        financeHistory.forEach(event => {
            rows.push([
                `"${new Date(event.timestamp).toISOString()}"`,
                `"${event.action}"`,
                `"${event.details.replace(/"/g, '""')}"`,
                "", "System"
            ].join(','));
        });
    
        manualTransactions.forEach(tx => {
            rows.push([
                `"${new Date(tx.timestamp).toISOString()}"`,
                `"${tx.description.replace(/"/g, '""')}"`,
                "",
                tx.type === 'incoming' ? tx.amount : -tx.amount,
                `"${tx.type}"`
            ].join(','));
        });
        
        const csvString = rows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'financial_activity_log.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleSendFinancialsEmail = () => {
        const subject = "Financial Activity Report";
        const body = generateFinancialsHTML();
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`<html><body>${body}</body></html>`)}`;
    };

    const CredentialChangeModal = () => {
        const [showPassword, setShowPassword] = useState(false);
        const firstInputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            firstInputRef.current?.focus();
        }, []);

        const closeAndReset = () => {
            setIsCredentialModalOpen(false);
            setCredentialChangeType(null);
            setNewUsername('');
            setNewPassword('');
        };

        const passwordLengthError = newPassword && newPassword.length > 0 && newPassword.length < 8;
        const isPasswordValid = newPassword.length >= 8;
        const usernameLengthError = newUsername && newUsername.length > 0 && newUsername.length < 3;

        const isSaveDisabled = useMemo(() => {
            if (credentialChangeType === 'username') {
                return !newUsername || !!usernameLengthError;
            }
            if (credentialChangeType === 'password') {
                return !newPassword || !!passwordLengthError;
            }
            return true;
        }, [credentialChangeType, newUsername, newPassword, usernameLengthError, passwordLengthError]);

        const handleSaveCredentials = () => {
            if (isSaveDisabled) return;

            if (credentialChangeType === 'username') {
                setFinanceUsername(newUsername);
            } else if (credentialChangeType === 'password') {
                setFinancePassword(newPassword);
            }
            closeAndReset();
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold capitalize">Change {credentialChangeType}</h3>
                        <button onClick={closeAndReset}><X className="w-6 h-6"/></button>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Please enter the new credentials.</p>
                    {credentialChangeType === 'username' ? (
                        <div className="space-y-2">
                            <label htmlFor="desired-username" className="text-sm font-medium text-gray-700 dark:text-gray-300">Desired Username</label>
                            <input 
                                ref={firstInputRef}
                                id="desired-username" 
                                type="text" 
                                value={newUsername} 
                                onChange={e => setNewUsername(e.target.value)} 
                                placeholder="Enter Desired Username"
                                className={`w-full p-2 border rounded dark:bg-gray-700 ${usernameLengthError ? 'border-red-500' : 'dark:border-gray-600'}`}
                                aria-invalid={!!usernameLengthError}
                                aria-describedby="username-length-error"
                            />
                            {usernameLengthError && <p id="username-length-error" className="text-xs text-red-500 mt-1">Username must be at least 3 characters.</p>}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="desired-password"  className="text-sm font-medium text-gray-700 dark:text-gray-300">Desired Password</label>
                                <div className="relative">
                                    <input 
                                        ref={firstInputRef}
                                        id="desired-password" 
                                        type={showPassword ? 'text' : 'password'} 
                                        value={newPassword} 
                                        onChange={e => setNewPassword(e.target.value)} 
                                        placeholder="Enter Desired Password"
                                        className={`w-full p-2 pr-16 border rounded dark:bg-gray-700 ${passwordLengthError ? 'border-red-500' : isPasswordValid ? 'border-green-500' : 'dark:border-gray-600'}`}
                                        aria-invalid={!!passwordLengthError}
                                        aria-describedby="password-length-error"
                                    />
                                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                                        {passwordLengthError && <XCircle size={20} className="text-red-500" />}
                                        {isPasswordValid && <CheckCircle size={20} className="text-green-500" />}
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
                                            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                        </button>
                                    </div>
                                </div>
                                {passwordLengthError && <p id="password-length-error" className="text-xs text-red-500 mt-1">Password must be at least 8 characters.</p>}
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end space-x-2 pt-4 mt-4 border-t dark:border-gray-600">
                        <button onClick={closeAndReset} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                        <button 
                            onClick={handleSaveCredentials} 
                            className="px-4 py-2 bg-primary-600 text-white rounded-md disabled:bg-primary-400 dark:disabled:bg-primary-800 disabled:cursor-not-allowed"
                            disabled={isSaveDisabled}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    
    if (currentUser?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
                    <Shield className="mx-auto h-12 w-12 text-red-500" />
                    <h2 className="mt-6 text-2xl font-bold">Access Denied</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">You do not have permission to view this page. Please contact an administrator if you believe this is an error.</p>
                </div>
            </div>
        );
    }
    
    if (!isPanelUnlocked) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <div className="text-center">
                        <Shield className="mx-auto h-12 w-12 text-primary-500" />
                        <h2 className="mt-6 text-2xl font-bold">Administrative Panel Access</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Please authenticate to manage the administrative panel.</p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handlePanelLogin}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="panel-username" className="sr-only">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="panel-username"
                                        type="text"
                                        required
                                        value={panelUsername}
                                        onChange={(e) => setPanelUsername(e.target.value)}
                                        className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Username"
                                        aria-label="Admin Panel Username"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="panel-password"className="sr-only">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Key className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="panel-password"
                                        type="password"
                                        required
                                        value={panelPassword}
                                        onChange={(e) => setPanelPassword(e.target.value)}
                                        className="appearance-none rounded-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Password"
                                        aria-label="Admin Panel Password"
                                    />
                                </div>
                            </div>
                        </div>
                        {panelLoginError && <p className="mt-2 text-center text-sm text-red-600">{panelLoginError}</p>}
                        <div>
                            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Authenticate
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {isCredentialModalOpen && <CredentialChangeModal />}
            {isStudentFormOpen && <StudentFormModal student={editingStudent} onSave={handleSaveStudent} onCancel={() => setIsStudentFormOpen(false)} />}
            {deletingStudent && <ConfirmationModal onConfirm={handleConfirmDelete} onCancel={() => setDeletingStudent(undefined)} message={`Are you sure you want to delete ${deletingStudent.name}? This will remove them from all records.`} confirmText="Delete"/>}
            {deletingTransactionId && <ConfirmationModal onConfirm={handleDeleteTransaction} onCancel={() => setDeletingTransactionId(null)} message="Are you sure you want to delete this transaction? This action cannot be undone." confirmText="Delete"/>}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h1 className="text-3xl font-bold">Administrative Panel</h1>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <button onClick={printFinanceStatement} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        <Printer className="w-4 h-4 mr-2" /> Print Finance Report
                    </button>
                    {isFinancialsUnlocked && (
                         <button onClick={handleFinancialsLock} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                            <Lock className="w-4 h-4 mr-2" /> Lock Financial Section
                        </button>
                    )}
                     <button onClick={handlePanelLock} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        <Lock className="w-4 h-4 mr-2" /> Lock Panel
                    </button>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">School Analytics</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-1"><Users size={20} className="mr-2"/> Total Students</div>
                        <p className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">{students.length}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-1"><Book size={20} className="mr-2"/> Total Subjects</div>
                        <p className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">{subjects.length}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-center text-green-500 mb-1"><CheckCircle size={20} className="mr-2"/> Collected Revenue</div>
                        <p className="text-2xl font-bold text-center text-green-500">₱{collectedAmount.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-center text-primary-500 mb-1"><TrendingUp size={20} className="mr-2"/> Avg. Grade</div>
                        <p className="text-2xl font-bold text-center text-primary-500">{schoolAverageGrade.toFixed(1)}%</p>
                    </div>
                </div>

                <div className="mt-6 border-t dark:border-gray-700 pt-4">
                    <h3 className="text-lg font-semibold mb-2">Record a New Transaction</h3>
                    <form onSubmit={handleAddTransaction} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                            <div className="md:col-span-2">
                                <label className="text-xs font-medium">Description</label>
                                <input type="text" placeholder="e.g., Book Fair Revenue" value={newTransactionDesc} onChange={e => setNewTransactionDesc(e.target.value)} className="w-full mt-1 p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div>
                                <label className="text-xs font-medium">Amount</label>
                                <input type="number" step="0.01" placeholder="0.00" value={newTransactionAmount} onChange={e => setNewTransactionAmount(e.target.value)} className="w-full mt-1 p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-medium">Type</label>
                                <div className="flex items-center gap-4 mt-2">
                                    <label className="flex items-center text-sm"><input type="radio" name="type" value="incoming" checked={newTransactionType === 'incoming'} onChange={() => setNewTransactionType('incoming')} className="mr-1" /> Incoming</label>
                                    <label className="flex items-center text-sm"><input type="radio" name="type" value="outgoing" checked={newTransactionType === 'outgoing'} onChange={() => setNewTransactionType('outgoing')} className="mr-1" /> Outgoing</label>
                                </div>
                            </div>
                            <button type="submit" className="w-full md:w-auto justify-self-end px-4 flex justify-center items-center py-2 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"><Plus className="w-4 h-4 mr-2"/> Add Entry</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 flex items-center"><Users className="mr-2"/>User Credentials</h2>
                <form onSubmit={handleAddUser} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input type="text" placeholder="Username" value={newUserUsername} onChange={e => setNewUserUsername(e.target.value)} className="p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" required/>
                        <input type="text" placeholder="Password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} className="p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600" required/>
                        <select value={newUserRole} onChange={e => setNewUserRole(e.target.value as 'admin' | 'teacher')} className="p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600">
                            <option value="teacher">Teacher</option><option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="mt-3 w-full flex justify-center items-center py-2 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"><Plus className="w-4 h-4 mr-2"/> Add User</button>
                </form>
                <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700"><tr>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">Username</th><th className="px-4 py-2 text-left text-xs font-medium uppercase">Role</th><th className="px-4 py-2 text-right text-xs font-medium uppercase">Action</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{appUsers.map(user => (<tr key={user.id}>
                        <td className="px-4 py-2 text-sm font-medium">{user.username}</td><td className="px-4 py-2 text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'}`}>{user.role}</span></td>
                        <td className="px-4 py-2 text-right"><button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900" title="Delete"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>))}</tbody>
                </table></div>
            </div>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isFinancialsUnlocked ? 'max-h-0 opacity-0' : 'max-h-80 opacity-100'}`}>
                <FinancialsLogin
                    onSubmit={handleFinancialsLogin}
                    username={adminUsername}
                    onUsernameChange={(e) => setAdminUsername(e.target.value)}
                    password={adminPassword}
                    onPasswordChange={(e) => setAdminPassword(e.target.value)}
                    isAuthenticating={isAuthenticating}
                    loginError={loginError}
                />
            </div>
            
            <div className={`transition-all duration-500 ease-in-out ${isFinancialsUnlocked ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 flex items-center"><DollarSign className="mr-2"/>Manual Transaction Log</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Timestamp</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Description</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium uppercase">Amount</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Type</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {manualTransactions.map(t => (
                                    <tr key={t.id}>
                                        <td className="px-4 py-2 text-sm whitespace-nowrap">{format(new Date(t.timestamp), 'MMM d, yyyy h:mm a')}</td>
                                        <td className="px-4 py-2 text-sm">{t.description}</td>
                                        <td className={`px-4 py-2 text-sm text-right font-semibold ${t.type === 'incoming' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {t.type === 'incoming' ? '+' : '-'}₱{t.amount.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 text-sm capitalize">{t.type}</td>
                                        <td className="px-4 py-2 text-right">
                                            <button onClick={() => setDeletingTransactionId(t.id)} className="text-red-600 hover:text-red-900" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 flex items-center"><CreditCard className="mr-2"/>Payment Methods</h2>
                        <div className="space-y-4">{paymentMethods.map(method => (<div key={method.id} className="border dark:border-gray-700 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3"><method.icon className="w-6 h-6 text-gray-500" /><span className="font-medium">{method.name}</span></div>
                            <button onClick={() => toggleConnection(method.id)} className={`px-3 py-1 text-sm rounded-full flex items-center ${method.connected ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {method.connected ? <><XCircle size={14} className="mr-1"/>Disconnect</> : <><CheckCircle size={14} className="mr-1"/>Connect</>}
                            </button>
                        </div>))}</div>
                    </div>

                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center"><DollarSign className="mr-2"/>Financial Activity Log</h2>
                            <div className="flex items-center gap-2">
                                <button onClick={handlePrintFinancials} className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600" title="Print Log">
                                    <Printer size={14} className="mr-2"/> Print
                                </button>
                                <button onClick={handleSaveFinancialsCSV} className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600" title="Save as CSV">
                                    <FileDown size={14} className="mr-2"/> Save
                                </button>
                                <button onClick={handleSendFinancialsEmail} className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600" title="Send via Email">
                                    <Mail size={14} className="mr-2"/> Send
                                </button>
                            </div>
                        </div>
                        <ul className="space-y-4 max-h-72 overflow-y-auto pr-2 mb-4">
                            {financeHistory.map(event => (
                                <li key={event.id} className="flex items-start">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-full mr-4 mt-1">
                                        <HistoryLogIcon action={event.action} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{event.details}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 flex items-center"><Shield className="mr-2"/> Security Settings</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span>Finance Username:</span>
                                <span className="font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{financeUsername}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Finance Password:</span>
                                <span className="font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{'*'.repeat(financePassword.length)}</span>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={() => { setNewUsername(financeUsername); setCredentialChangeType('username'); setIsCredentialModalOpen(true); }} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500">Change Username</button>
                                <button onClick={() => { setCredentialChangeType('password'); setIsCredentialModalOpen(true); }} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500">Change Password</button>
                            </div>
                        </div>
                    </div>
                     <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <Key className="mr-2"/> Financials Access Log
                        </h2>
                        <ul className="space-y-3 max-h-72 overflow-y-auto pr-2">
                            {financeLoginHistory.map((log, index) => (
                                <li key={index} className="flex items-center">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-full mr-3">
                                        <UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            User <span className="font-bold text-primary-600 dark:text-primary-400">{log.user}</span> unlocked the financial section.
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {format(new Date(log.timestamp), 'MMM d, yyyy, h:mm a')}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-xl font-semibold"><Users className="inline mr-2"/>Master Student Registry</h2>
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="text" placeholder="Search..." value={studentSearchTerm} onChange={(e) => setStudentSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 w-full"/></div>
                        <div className="relative"><Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><select value={studentFilterSection} onChange={(e) => setStudentFilterSection(e.target.value)} className="pl-9 pr-4 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 w-full">{availableSections.map(s => (<option key={s} value={s}>{s === 'All' ? 'All Sections' : s}</option>))}</select></div>
                        <button onClick={() => setIsStudentFormOpen(true)} className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm whitespace-nowrap"><Plus className="w-4 h-4 mr-2" /> Add Student</button>
                    </div>
                </div>
                {selectedStudentIds.size > 0 && (
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/30 border-b dark:border-gray-700 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-medium text-primary-800 dark:text-primary-200">{selectedStudentIds.size} student{selectedStudentIds.size > 1 && 's'} selected</span>
                        <div className="flex items-center gap-2">
                            <button onClick={handleBulkPrintBilling} className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-600"><Printer size={14} className="mr-2"/>Print Bills</button>
                            <button onClick={handleBulkEmail} className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-600"><Mail size={14} className="mr-2"/>Email Guardians</button>
                            <button onClick={() => setSelectedStudentIds(new Set())} className="p-1.5 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"><X size={16}/></button>
                        </div>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 w-4"><input type="checkbox" className="rounded" onChange={handleSelectAll} checked={sortedStudents.length > 0 && selectedStudentIds.size === sortedStudents.length} /></th>
                                <th onClick={() => handleSortStudents('name')} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"><div className="flex items-center">Name <ArrowUpDown className="ml-1 w-3 h-3"/></div></th>
                                <th onClick={() => handleSortStudents('section')} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"><div className="flex items-center">Section <ArrowUpDown className="ml-1 w-3 h-3"/></div></th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Guardian</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {sortedStudents.map(student => (
                                <tr key={student.id} className={selectedStudentIds.has(student.id) ? 'bg-primary-50 dark:bg-primary-900/40' : ''}>
                                    <td className="px-6 py-4"><input type="checkbox" className="rounded" checked={selectedStudentIds.has(student.id)} onChange={() => handleSelectRow(student.id)}/></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="px-2.5 py-0.5 rounded-full text-xs bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">{student.section || 'N/A'}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{student.contact?.guardianName || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{student.contact?.email || student.contact?.phone || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                                        <button onClick={() => printBillingStatement(student)} className="p-1 text-gray-500 hover:text-primary-600" title="Print Bill"><FileText size={16}/></button>
                                        <button onClick={() => { setEditingStudent(student); setIsStudentFormOpen(true); }} className="p-1 text-gray-500 hover:text-green-600" title="Edit"><Edit size={16}/></button>
                                        <button onClick={() => setDeletingStudent(student)} className="p-1 text-gray-500 hover:text-red-600" title="Delete"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;