
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Student, StudentGrades, GradeItem, DailyAttendance, AttendanceStatus, CalendarEvent, StudentNote } from '../types';

const API_KEY = process.env.API_KEY;

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const generateContent = async (prompt: string): Promise<string> => {
  if (!ai) return "AI service is unavailable. API key not configured.";
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
    });
    // FIX: response.text is a property, not a function.
    return response.text ?? "No response from AI.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return `An error occurred while communicating with the AI. Details: ${error instanceof Error ? error.message : String(error)}`;
  }
};


export const draftParentMessage = async (
    student: Student,
    topic: 'grades' | 'attendance' | 'general',
    details: { grades?: StudentGrades, attendance?: DailyAttendance[] }
) => {
    let prompt = `You are a helpful assistant for a teacher. Draft a professional, clear, respectful, and non-confrontational message to a student's parent/guardian.
    The message should be suitable for SMS, Facebook Messenger, or Email. Do not send the message, just draft the text.

    Student's Name: ${student.name}
    Guardian's Name: ${student.contact?.guardianName || 'Parent/Guardian'}

    Topic: ${topic}
    `;

    if (topic === 'grades' && details.grades) {
        const gradeSummary = details.grades.items.map(g => `${g.name}: ${g.score}/${g.total}`).join(', ');
        prompt += `\nDetails: The student's recent grades are as follows: ${gradeSummary}. Please draft a message to discuss their academic performance.`;
    } else if (topic === 'attendance' && details.attendance) {
        const attendanceSummary = details.attendance
            .flatMap(day => day.records)
            .filter(rec => rec.studentId === student.id && rec.status !== AttendanceStatus.Present)
            .map(rec => `${details.attendance.find(d => d.records.includes(rec))?.date}: ${rec.status}`)
            .join(', ');
        prompt += `\nDetails: The student has been marked as ${attendanceSummary} recently. Please draft a message to discuss their attendance.`;
    } else {
        prompt += `\nDetails: Please draft a general check-in message regarding the student's progress in class.`;
    }

    prompt += `\nKeep the message concise and positive in tone, offering collaboration to support the student. Start the message with "Dear ${student.contact?.guardianName || 'Parent/Guardian'},".`;

    return generateContent(prompt);
};

export const summarizeTasks = async (events: CalendarEvent[]) => {
    if (events.length === 0) return "No upcoming tasks or events.";
    const eventList = events.map(e => `- ${e.date}: ${e.title} (${e.description})`).join('\n');
    const prompt = `As a teacher's assistant, summarize the following list of upcoming tasks and events into a simple, readable paragraph.
    
    Events:\n${eventList}`;
    return generateContent(prompt);
};

export const summarizeNotes = async (notes: StudentNote[]) => {
    if (notes.length === 0) return "No notes available for this student.";
    const noteList = notes.map(n => `- ${new Date(n.date).toLocaleDateString()}: ${n.content}`).join('\n');
    const prompt = `As a teacher's assistant, summarize the following private notes about a student. Identify key patterns or recurring themes in behavior or progress. The summary is for the teacher's private use.
    
    Notes:\n${noteList}`;
    return generateContent(prompt);
};