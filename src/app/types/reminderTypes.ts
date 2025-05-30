export type Reminder = {
  id: number;
  title: string;
  time: string;
  slot: "Morning" | "Afternoon" | "Evening";
  pet: number;
  category: number;
  frequency: string;
  status: "pending" | "completed";
  notes?: string;
  startDate?: string;
  endDate?: string;
};

export const PETS = [
  { id: 1, name: "Browny" },
  { id: 2, name: "Kitty" },
];

export const CATEGORIES = [
  { id: 1, name: "General" },
  { id: 2, name: "Health" },
];

export const TIME_SLOTS = ["Morning", "Afternoon", "Evening"] as const;

export function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${ampm}`;
} 