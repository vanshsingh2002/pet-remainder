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
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await fetch(`${API_BASE}/reminders`);
        if (!response.ok) throw new Error("Failed to fetch reminders");
        const data = await response.json();
        setReminders(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching reminders:", error);
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          setReminders(JSON.parse(cached));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const syncWithServer = async () => {
    if (!isOnline) return;

    try {
      const response = await fetch(`${API_BASE}/reminders`);
      if (!response.ok) throw new Error("Failed to sync with server");
      const data = await response.json();
      setReminders(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error syncing with server:", error);
    }
  };

  const addReminder = async (reminder: Omit<Reminder, "id">) => {
    const newReminder = { ...reminder, id: Date.now() };
    setReminders((prev) => [...prev, newReminder]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...reminders, newReminder]));

    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/reminders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reminder),
        });
        if (!response.ok) throw new Error("Failed to add reminder");
        const data = await response.json();
        setReminders((prev) =>
          prev.map((r) => (r.id === newReminder.id ? data : r))
        );
      } catch (error) {
        console.error("Error adding reminder:", error);
      }
    }
  };

  const updateReminder = async (id: number, updates: Partial<Reminder>) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(reminders.map((r) => (r.id === id ? { ...r, ...updates } : r)))
    );

    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/reminders/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error("Failed to update reminder");
      } catch (error) {
        console.error("Error updating reminder:", error);
      }
    }
  };

  const deleteReminder = async (id: number) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(reminders.filter((r) => r.id !== id))
    );

    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/reminders/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete reminder");
      } catch (error) {
        console.error("Error deleting reminder:", error);
      }
    }
  };

  const markAsDone = async (id: number) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "completed" as const } : r
      )
    );
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        reminders.map((r) =>
          r.id === id ? { ...r, status: "completed" as const } : r
        )
      )
    );

    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/reminders/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        });
        if (!response.ok) throw new Error("Failed to mark reminder as done");
      } catch (error) {
        console.error("Error marking reminder as done:", error);
      }
    }
  };

  useEffect(() => {
    if (isOnline) {
      syncWithServer();
    }
  }, [isOnline]);

  return {
    reminders,
    loading,
    addReminder,
    updateReminder,
    deleteReminder,
    markAsDone,
    isOnline,
  };
}
