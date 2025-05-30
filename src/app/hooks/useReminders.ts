import { useState, useEffect } from "react";
import { Reminder } from "../types/reminderTypes";

const STORAGE_KEY = "pet-reminders";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

// Dummy data for first-time users
const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 1,
    title: "Morning Walk",
    time: "07:00",
    slot: "Morning",
    pet: 1,
    category: 1,
    frequency: "Everyday",
    status: "pending",
    notes: "Take Browny for a 30-minute walk",
    startDate: new Date().toISOString().split("T")[0],
  },
  {
    id: 2,
    title: "Breakfast",
    time: "08:00",
    slot: "Morning",
    pet: 1,
    category: 1,
    frequency: "Everyday",
    status: "pending",
    notes: "1 cup of dry food",
    startDate: new Date().toISOString().split("T")[0],
  },
  {
    id: 3,
    title: "Afternoon Play",
    time: "14:00",
    slot: "Afternoon",
    pet: 2,
    category: 1,
    frequency: "Everyday",
    status: "pending",
    notes: "Play with Kitty for 20 minutes",
    startDate: new Date().toISOString().split("T")[0],
  },
  {
    id: 4,
    title: "Vet Visit",
    time: "16:00",
    slot: "Afternoon",
    pet: 1,
    category: 2,
    frequency: "Weekly",
    status: "pending",
    notes: "Annual checkup for Browny",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    id: 5,
    title: "Evening Walk",
    time: "19:00",
    slot: "Evening",
    pet: 1,
    category: 1,
    frequency: "Everyday",
    status: "completed",
    notes: "Take Browny for a 30-minute walk",
    startDate: new Date().toISOString().split("T")[0],
  },
  {
    id: 6,
    title: "Dinner",
    time: "20:00",
    slot: "Evening",
    pet: 2,
    category: 1,
    frequency: "Everyday",
    status: "pending",
    notes: "Wet food for Kitty",
    startDate: new Date().toISOString().split("T")[0],
  },
  {
    id: 7,
    title: "Grooming",
    time: "10:00",
    slot: "Morning",
    pet: 2,
    category: 2,
    frequency: "Monthly",
    status: "pending",
    notes: "Brush Kitty's fur",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    id: 8,
    title: "Grooming",
    time: "10:00",
    slot: "Morning",
    pet: 2,
    category: 2,
    frequency: "Monthly",
    status: "completed",
    notes: "Brush Kitty's fur",
    startDate: "2025-05-29",
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    id: 9,
    title: "Grooming",
    time: "10:00",
    slot: "Morning",
    pet: 2,
    category: 2,
    frequency: "Monthly",
    status: "pending",
    notes: "Brush Kitty's fur",
    startDate: "2025-05-28",
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    id: 10,
    title: "Grooming",
    time: "10:00",
    slot: "Morning",
    pet: 2,
    category: 2,
    frequency: "Monthly",
    status: "completed",
    notes: "Brush Kitty's fur",
    startDate: "2025-05-27",
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
];

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  // Helper: Save to localStorage
  const saveToLocal = (data: Reminder[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  };

  // Helper: Load from localStorage
  const loadFromLocal = (): Reminder[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_REMINDERS;
  };

  // Fetch from API or fallback to localStorage/initial data
  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/reminders`);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setReminders(data);
        saveToLocal(data);
        setOffline(false);
      } catch {
        // Offline fallback
        setOffline(true);
        const local = loadFromLocal();
        setReminders(local);
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    const handleOnline = async () => {
      // Try to push all local reminders to the backend
      const localReminders = loadFromLocal();
      try {
        // Clear backend and re-upload all local reminders (simple one-way sync)
        // 1. Fetch all backend reminders
        const res = await fetch(`${API_BASE}/reminders`);
        if (res.ok) {
          const backendReminders = await res.json();
          // 2. Delete all backend reminders
          await Promise.all(
            backendReminders.map((r: Reminder) =>
              fetch(`${API_BASE}/reminders/${r.id}`, { method: 'DELETE' })
            )
          );
        }
        // 3. Add all local reminders to backend
        await Promise.all(
          localReminders.map((r) =>
            fetch(`${API_BASE}/reminders`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...r, id: undefined }), // Let backend assign new id
            })
          )
        );
        // 4. Fetch latest from backend
        const res2 = await fetch(`${API_BASE}/reminders`);
        if (res2.ok) {
          const synced = await res2.json();
          setReminders(synced);
          saveToLocal(synced);
          setOffline(false);
        }
      } catch {
        setOffline(true);
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  // Add reminder
  const addReminder = async (reminder: Omit<Reminder, "id">) => {
    if (!offline) {
      try {
        const res = await fetch(`${API_BASE}/reminders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reminder),
        });
        if (!res.ok) throw new Error("API error");
        const newReminder = await res.json();
        setReminders((prev) => [...prev, newReminder]);
        saveToLocal([...reminders, newReminder]);
        return newReminder;
      } catch {
        setOffline(true);
      }
    }
    // Offline fallback
    const newReminder: Reminder = { ...reminder, id: Date.now() };
    setReminders((prev) => [...prev, newReminder]);
    saveToLocal([...reminders, newReminder]);
    return newReminder;
  };

  // Update reminder
  const updateReminder = async (id: number, updates: Partial<Reminder>) => {
    if (!offline) {
      try {
        const res = await fetch(`${API_BASE}/reminders/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...reminders.find(r => r.id === id), ...updates }),
        });
        if (!res.ok) throw new Error("API error");
        const updated = await res.json();
        setReminders((prev) => prev.map(r => r.id === id ? updated : r));
        saveToLocal(reminders.map(r => r.id === id ? updated : r));
        return updated;
      } catch {
        setOffline(true);
      }
    }
    // Offline fallback
    setReminders((prev) => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    saveToLocal(reminders.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  // Delete reminder
  const deleteReminder = async (id: number) => {
    if (!offline) {
      try {
        const res = await fetch(`${API_BASE}/reminders/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("API error");
        setReminders((prev) => prev.filter(r => r.id !== id));
        saveToLocal(reminders.filter(r => r.id !== id));
        return;
      } catch {
        setOffline(true);
      }
    }
    // Offline fallback
    setReminders((prev) => prev.filter(r => r.id !== id));
    saveToLocal(reminders.filter(r => r.id !== id));
  };

  // Mark as done
  const markAsDone = async (id: number) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;
    await updateReminder(id, { ...reminder, status: "completed" });
  };

  return {
    reminders,
    loading,
    error,
    offline,
    addReminder,
    updateReminder,
    deleteReminder,
    markAsDone,
  };
}
