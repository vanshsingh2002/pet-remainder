import { useState, useEffect } from "react";
import { Reminder } from "../types/reminderTypes";

const STORAGE_KEY = "pet-reminders";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

const updateLocalStorage = (reminders: Reminder[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }
};

const getTimeSlot = (time: string): "Morning" | "Afternoon" | "Evening" => {
  const hour = parseInt(time.split(":")[0]);
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17) return "Evening";
  return "Morning";
};

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(STORAGE_KEY);
      return cached ? JSON.parse(cached) : [];
    }
    return [];
  });
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // Handle online/offline status
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

  // Load reminders from API when online
  useEffect(() => {
    const loadReminders = async () => {
      // When online, always try to fetch from the API.
      // If offline, rely on localStorage which is handled in useState initialization.
      if (!isOnline) {
         setLoading(false);
         return;
      }

      try {
        const response = await fetch(`${API_BASE}/reminders`);
        if (!response.ok) throw new Error("Failed to fetch reminders");
        const data = await response.json();
        setReminders(data);
        updateLocalStorage(data);
      } catch (error) {
        console.error("Error loading reminders from API:", error);
        // Fallback to localStorage if API fetch fails (though useState already tries this)
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          setReminders(JSON.parse(cached));
        }
      } finally {
        setLoading(false);
      }
    };

    // Only load from API when online or when component mounts (to get latest data if online)
    // The effect dependency on isOnline ensures refetch when going online.
    loadReminders();
  }, [isOnline]); // Depend on isOnline to refetch when connectivity changes

  const addReminder = async (reminder: Omit<Reminder, "id">) => {
    const newReminder = { ...reminder, id: Date.now() };
    // Optimistically update state and localStorage
    setReminders((prev) => {
      const updated = [...prev, newReminder];
      updateLocalStorage(updated);
      return updated;
    });

    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/reminders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reminder),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
           console.error("Server error adding reminder:", response.status, response.statusText, errorData);
          throw new Error("Failed to add reminder to API");
        }
        const data = await response.json();
        // Replace optimistic reminder with the one from the server (which has the real ID)
        setReminders((prev) => {
          const updated = prev.map((r) => (r.id === newReminder.id ? data : r));
           updateLocalStorage(updated);
          return updated;
        });
      } catch (error) {
        console.error("Error adding reminder to API:", error);
         // Revert state and localStorage if API call fails
         setReminders((prev) => {
             const updated = prev.filter(r => r.id !== newReminder.id); // Remove the optimistically added reminder
             updateLocalStorage(updated);
             return updated;
         });
      }
    }
  };

  const updateReminder = async (id: number, updates: Partial<Reminder>) => {
    const currentReminder = reminders.find((r) => r.id === id);
    if (!currentReminder) {
      console.error("Reminder not found:", id);
      return;
    }

    let updatedData = { ...updates };
    if (updates.time) {
      updatedData = { ...updatedData, slot: getTimeSlot(updates.time) };
    }

    const updatedReminder = { ...currentReminder, ...updatedData };
    // Optimistically update state and localStorage
    setReminders((prev) => {
      const updated = prev.map((r) => (r.id === id ? updatedReminder : r));
      updateLocalStorage(updated);
      return updated;
    });

    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/reminders/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          // Send the full updated reminder object
          body: JSON.stringify(updatedReminder),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error(
            "Server error updating reminder:",
            response.status,
            response.statusText,
            errorData
          );
          throw new Error(`Failed to update reminder: ${response.statusText}`);
        }

        // Assuming backend returns the updated reminder on success
        const data = await response.json();
        // Update state and localStorage with server response
        setReminders((prev) => {
          const updated = prev.map((r) => (r.id === id ? data : r));
          updateLocalStorage(updated);
          return updated;
        });
      } catch (error) {
        console.error("Error updating reminder via API:", error);
        // Revert local state on error if API call failed
        setReminders((prev) => {
          const updated = prev.map((r) => (r.id === id ? currentReminder : r)); // Revert to original state
          updateLocalStorage(updated);
          return updated;
        });
      }
    }
  };

  const deleteReminder = async (id: number) => {
     const reminderToDelete = reminders.find(r => r.id === id);
     if (!reminderToDelete) return;

    // Optimistically update state and localStorage
    setReminders((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      updateLocalStorage(updated);
      return updated;
    });

    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/reminders/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
             const errorData = await response.json().catch(() => null);
             console.error("Server error deleting reminder:", response.status, response.statusText, errorData);
            throw new Error("Failed to delete reminder from API");
        }
        // No state update needed here as optimistic update already happened
      } catch (error) {
        console.error("Error deleting reminder via API:", error);
        // Revert local state on error if API call failed
         setReminders((prev) => {
             const updated = [...prev, reminderToDelete]; // Add the deleted reminder back
             updateLocalStorage(updated);
             return updated;
         });
      }
    }
  };

  const markAsDone = async (id: number) => {
    const reminder = reminders.find((r) => r.id === id);
    if (!reminder) {
      console.error("Reminder not found:", id);
      return;
    }

    const updatedReminder = { ...reminder, status: "completed" as const };
    // Optimistically update state and localStorage
    setReminders((prev) => {
      const updated = prev.map((r) => (r.id === id ? updatedReminder : r));
      updateLocalStorage(updated);
      return updated;
    });

    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE}/reminders/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          // Send the full updated reminder object
          body: JSON.stringify(updatedReminder),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error(
            "Server error when marking as done:",
            response.status,
            response.statusText,
            errorData
          );
          throw new Error(`Failed to mark reminder as done: ${response.statusText}`);
        }

        // Assuming backend returns the updated reminder on success
        const data = await response.json();
        // Update state and localStorage with server response
        setReminders((prev) => {
          const updated = prev.map((r) => (r.id === id ? data : r));
          updateLocalStorage(updated);
          return updated;
        });
      } catch (error) {
        console.error("Error during markAsDone API call:", error);
        // Revert local state on error if API call failed
        setReminders((prev) => {
          const updated = prev.map((r) => (r.id === id ? reminder : r)); // Revert to original state
          updateLocalStorage(updated);
          return updated;
        });
      }
    }
  };

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
