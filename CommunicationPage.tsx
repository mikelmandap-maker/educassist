
import React, { useState, useEffect } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Clipboard, Mail, MessageCircle, Phone, PlusCircle, CheckCircle } from 'lucide-react';

const SyncMessengerModal: React.FC<{ onSync: () => void; onClose: () => void; }> = ({ onSync, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-blue-500" />
            <h3 className="text-lg font-bold mt-4">Sync with Facebook Messenger</h3>
            <p className="my-4 text-gray-600 dark:text-gray-300 text-sm">
                Connect your account to send messages and notices directly to guardians from within EduPro.
            </p>
            <div className="flex flex-col gap-2">
                <button 
                    onClick={onSync} 
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
                >
                    Sync Account
                </button>
                <button 
                    onClick={onClose} 
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                    Not Now
                </button>
            </div>
        </div>
    </div>
);


const CommunicationPage: React.FC = () => {
    const { students, setStudents, notes, setNotes } = useAppData();
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [messageContent, setMessageContent] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [copied, setCopied] = useState(false);
    
    // State for the new notes section
    const [newNoteContent, setNewNoteContent] = useState('');

    // State for Messenger sync
    const [isMessengerSynced, setIsMessengerSynced] = useState(false);
    const [showSyncPrompt, setShowSyncPrompt] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [showSuccess, setShowSuccess] = useState('');

    const selectedStudent = students.find(s => s.id === selectedStudentId);
    const studentNotes = notes
        .filter(n => n.studentId === selectedStudentId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    useEffect(() => {
        const student = students.find(s => s.id === selectedStudentId);
        setMessageContent('');
        setNewNoteContent('');
        setPhoneNumber(student?.contact?.phone || '');
    }, [selectedStudentId, students]);

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendSMS = () => {
        if (!phoneNumber.trim() || !messageContent.trim()) {
            alert("Guardian's phone number is missing or the message is empty.");
            return;
        }
        window.location.href = `sms:${phoneNumber.trim()}?&body=${encodeURIComponent(messageContent)}`;
    };

    const handleSendMessenger = () => {
        if (!isMessengerSynced) {
            setShowSyncPrompt(true);
            return;
        }

        if (!messageContent.trim()) {
            alert("Message is empty.");
            return;
        }

        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            setShowSuccess(`Message sent to ${selectedStudent?.contact?.guardianName || 'Guardian'} via Messenger.`);
            setMessageContent('');
            setTimeout(() => setShowSuccess(''), 4000);
        }, 2000);
    };

    const handleSync = () => {
        setShowSyncPrompt(false);
        setTimeout(() => {
            setIsMessengerSynced(true);
        }, 1500);
    };

    const handleSaveNote = () => {
        if (!newNoteContent.trim() || !selectedStudentId) return;
        const newNote = {
            id: `n${Date.now()}`,
            studentId: selectedStudentId,
            date: new Date().toISOString(),
            content: newNoteContent.trim(),
        };
        setNotes(prev => [...prev, newNote]);
        setNewNoteContent('');
    };

    const handlePhoneNumberChange = (newPhoneNumber: string) => {
        setPhoneNumber(newPhoneNumber);
        if (selectedStudentId) {
            setStudents(prevStudents => 
                prevStudents.map(student => 
                    student.id === selectedStudentId 
                    ? {
                        ...student,
                        contact: {
                            ...student.contact,
                            phone: newPhoneNumber
                        }
                      }
                    : student
                )
            );
        }
    };

    return (
        <div className="space-y-6">
            {showSyncPrompt && <SyncMessengerModal onSync={handleSync} onClose={() => setShowSyncPrompt(false)} />}
            {showSuccess && (
                <div className="fixed bottom-24 right-6 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
                    <CheckCircle size={20} />
                    <span>{showSuccess}</span>
                </div>
            )}
            <h1 className="text-3xl font-bold">Communication Center</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Message Drafting Section */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
                    <h2 className="text-xl font-semibold">Send a Message to Parent/Guardian</h2>
                    
                    <div>
                        <label className="block text-sm font-medium">Select Student</label>
                        <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                            <option value="">-- Select a student --</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Guardian's Phone Number (for SMS)</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => handlePhoneNumberChange(e.target.value)}
                                className="block w-full pl-10 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                placeholder={selectedStudentId ? "Enter phone number" : "Select a student first"}
                                disabled={!selectedStudentId}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Message</label>
                         <textarea 
                            className="w-full h-32 mt-1 p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            placeholder={selectedStudentId ? "Type your message here..." : "Select a student to begin"}
                            disabled={!selectedStudentId}
                        />
                         <div className="flex items-center justify-end pt-2">
                            <button 
                                onClick={() => handleCopyToClipboard(messageContent)} 
                                className="flex items-center text-xs px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded disabled:opacity-50"
                                disabled={!messageContent}
                            >
                                <Clipboard size={12} className="mr-1"/> {copied ? 'Copied!' : 'Copy Text'}
                            </button>
                         </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium">Communication Channels</label>
                        <div className="mt-2 p-3 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/50 space-y-3">
                            <button 
                                onClick={handleSendSMS} 
                                className="w-full flex items-center justify-center text-sm px-3 py-2 bg-green-600 text-white font-semibold rounded disabled:opacity-50"
                                disabled={!messageContent.trim() || !phoneNumber.trim()}
                                title={!phoneNumber.trim() ? "Please enter a phone number." : ""}
                            >
                                <Phone size={16} className="mr-2"/> Send via SMS
                            </button>
                            <div className="flex items-center justify-between">
                                <button 
                                    onClick={handleSendMessenger} 
                                    className="flex items-center justify-center text-sm px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed w-full font-semibold"
                                    disabled={!selectedStudentId || !messageContent.trim() || isSending}
                                >
                                    {isSending ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <MessageCircle size={16} className="mr-2"/> Send via Messenger
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-center">
                                <span className={`w-2 h-2 rounded-full ${isMessengerSynced ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {isMessengerSynced ? 'Messenger Synced' : 'Messenger Not Synced'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student Notes Section */}
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4 flex flex-col">
                    <h2 className="text-xl font-semibold">Private Student Notes</h2>
                    <input type="text" readOnly value={selectedStudent?.name || 'Select a student to view/add notes'} className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-600 cursor-not-allowed"/>
                    
                    <div className="flex-grow border rounded-md p-3 bg-gray-50 dark:bg-gray-900/50 space-y-3 overflow-y-auto h-48">
                        {selectedStudentId ? (
                            studentNotes.length > 0 ? (
                                studentNotes.map(note => (
                                    <div key={note.id} className="text-sm p-2 bg-white dark:bg-gray-800 rounded shadow-sm">
                                        <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs mb-1">{new Date(note.date).toLocaleString()}</p>
                                        <p>{note.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-center text-gray-500 dark:text-gray-400 pt-4">No notes for this student yet.</p>
                            )
                        ) : (
                             <p className="text-sm text-center text-gray-500 dark:text-gray-400 pt-4">Select a student to manage notes.</p>
                        )}
                    </div>
                    
                    <div className="flex gap-2">
                        <textarea 
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            placeholder={selectedStudentId ? "Add a new note..." : "Select a student first"}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                            rows={2}
                            disabled={!selectedStudentId}
                        />
                         <button onClick={handleSaveNote} disabled={!newNoteContent.trim()} className="px-3 py-2 bg-purple-600 text-white rounded disabled:bg-gray-400 flex items-center justify-center">
                            <PlusCircle size={18}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunicationPage;
