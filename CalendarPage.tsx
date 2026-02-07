import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { CalendarEvent } from '../types';
// FIX: Import date-fns functions from their specific sub-packages.
// FIX: Consolidate date-fns imports to resolve 'not callable' type errors with isSameDay and isSameMonth.
import {
    format,
    addMonths,
    endOfMonth,
    endOfWeek,
    addDays,
    isSameMonth,
    isSameDay,
    subMonths,
    startOfMonth,
    startOfWeek,
    parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Edit, Trash2, FileDown } from 'lucide-react';

const EventForm: React.FC<{ event?: CalendarEvent; date: Date; onSave: (event: CalendarEvent) => void; onCancel: () => void; onDelete: (eventId: string) => void; }> = ({ event, date, onSave, onCancel, onDelete }) => {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: event?.id || `e${Date.now()}`,
      date: format(date, 'yyyy-MM-dd'),
      title,
      description
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">{event ? 'Edit Event' : 'Add Event'} for {format(date, 'MMMM d, yyyy')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border dark:border-gray-600 rounded dark:bg-gray-700"/>
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border dark:border-gray-600 rounded dark:bg-gray-700 h-24"/>
          <div className="flex justify-end space-x-2 pt-2">
            {event && (
                <button type="button" onClick={() => onDelete(event.id)} className="px-4 py-2 bg-red-600 text-white rounded-md mr-auto flex items-center gap-2 hover:bg-red-700">
                    <Trash2 size={16} /> Delete
                </button>
            )}
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md">{event ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CalendarPage: React.FC = () => {
    const { events, setEvents } = useAppData();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>();

    const handleSaveEvent = (event: CalendarEvent) => {
        if(editingEvent) {
            setEvents(prev => prev.map(e => e.id === event.id ? event : e));
        } else {
            setEvents(prev => [...prev, event]);
        }
        setIsFormOpen(false);
        setEditingEvent(undefined);
    };

    const handleDeleteEvent = (eventId: string) => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        setIsFormOpen(false);
        setEditingEvent(undefined);
    };

    const handleExportCSV = () => {
        const sortedEvents = [...events].sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
        const headers = ["Date", "Title", "Description"];
        const csvRows = [
            headers.join(','),
            ...sortedEvents.map(e => [
                `"${e.date}"`,
                `"${e.title.replace(/"/g, '""')}"`,
                `"${e.description.replace(/"/g, '""')}"`,
            ].join(','))
        ];
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'calendar_events.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderHeader = () => (
        <div className="flex justify-between items-center mb-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronLeft /></button>
            <h2 className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronRight /></button>
        </div>
    );
    
    const renderDays = () => {
        const days = [];
        const startDate = startOfWeek(startOfMonth(currentMonth));
        for (let i = 0; i < 7; i++) {
            days.push(<div key={i} className="text-center font-semibold text-sm text-gray-600 dark:text-gray-400">{format(addDays(startDate, i), 'E')}</div>);
        }
        return <div className="grid grid-cols-7">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        
        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                const dayEvents = events.filter(e => isSameDay(parseISO(e.date), cloneDay));

                days.push(
                    <div
                        key={day.toString()}
                        className={`border dark:border-gray-700 p-2 h-32 flex flex-col relative ${!isSameMonth(day, monthStart) ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-400' : ''} ${isSameDay(day, new Date()) ? 'bg-primary-50 dark:bg-primary-900/50' : ''}`}
                        onClick={() => { setSelectedDate(cloneDay); setIsFormOpen(true); setEditingEvent(undefined); }}
                    >
                        <span className={`font-semibold ${isSameDay(day, new Date()) ? 'text-primary-600' : ''}`}>{format(day, 'd')}</span>
                        <div className="flex-grow overflow-y-auto text-xs mt-1">
                            {dayEvents.map(e => (
                                <div key={e.id} className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded px-1 mb-1 truncate"
                                    onClick={(evt) => {
                                        evt.stopPropagation();
                                        setSelectedDate(cloneDay);
                                        setEditingEvent(e);
                                        setIsFormOpen(true);
                                    }}
                                >
                                    {e.title}
                                </div>
                            ))}
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(<div className="grid grid-cols-7" key={day.toString()}>{days}</div>);
            days = [];
        }
        return <div>{rows}</div>;
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold">Calendar & Schedule</h1>
                <button 
                    onClick={handleExportCSV} 
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 whitespace-nowrap"
                >
                    <FileDown className="w-5 h-5 mr-2" /> Export Events
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>
             {isFormOpen && <EventForm event={editingEvent} date={selectedDate} onSave={handleSaveEvent} onCancel={() => setIsFormOpen(false)} onDelete={handleDeleteEvent} />}
        </div>
    );
};

export default CalendarPage;