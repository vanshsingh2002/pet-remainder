import { useState, useEffect } from 'react';
import { Reminder } from '../types/reminderTypes';

const API_BASE = 'http://localhost:4000';

export function useRemindersApi() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all reminders
  const fetchReminders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/reminders`);
      if (!res.ok) throw new Error('Failed to fetch reminders');
      const data = await res.json();
      setReminders(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // Add a reminder
  const addReminder = async (reminder: Omit<Reminder, 'id'>) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminder),
      });
      if (!res.ok) throw new Error('Failed to add reminder');
      const newReminder = await res.json();
      setReminders((prev) => [...prev, newReminder]);
      return newReminder;
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      throw err;
    }
  };

  // Update a reminder
  const updateReminder = async (id: number, updates: Partial<Reminder>) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reminders.find(r => r.id === id), ...updates }),
      });
      if (!res.ok) throw new Error('Failed to update reminder');
      const updated = await res.json();
      setReminders((prev) => prev.map(r => r.id === id ? updated : r));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      throw err;
    }
  };

  // Delete a reminder
  const deleteReminder = async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/reminders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete reminder');
      setReminders((prev) => prev.filter(r => r.id !== id));
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      throw err;
    }
  };

  // Mark as done
  const markAsDone = async (id: number) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;
    await updateReminder(id, { ...reminder, status: 'completed' });
  };

  return {
    reminders,
    loading,
    error,
    fetchReminders,
    addReminder,
    updateReminder,
    deleteReminder,
    markAsDone,
  };
} 