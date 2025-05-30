"use client";

import { useState } from "react";
import { Plus, ChevronDown, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import DeleteConfirmation from "./components/DeleteConfirmation";
import { Reminder, PETS, CATEGORIES, TIME_SLOTS } from "./types/reminderTypes";
import TimeSlotSection from "./components/TimeSlotSection";
import {
  addDays,
  startOfWeek,
  format,
  isToday,
  startOfMonth,
  endOfMonth,
  getDay,
  isSameDay,
  isBefore,
  startOfToday,
  parseISO,
  differenceInCalendarDays,
} from "date-fns";
import { useReminders } from "./hooks/useReminders";
import Skeleton from "./components/Skeleton";

const CALENDAR_DAYS = [
  { label: "26", date: "2024-05-26" },
  { label: "27", date: "2024-05-27" },
  { label: "28", date: "2024-05-28" },
  { label: "29", date: "2024-05-29" },
  { label: "30", date: "2024-05-30" },
  { label: "31", date: "2024-05-31" },
  { label: "1", date: "2024-06-01" },
];

export default function Home() {
  const router = useRouter();
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { reminders, loading, updateReminder, deleteReminder, markAsDone } =
    useReminders();
  const [animating, setAnimating] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Reminder>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showAllSlots, setShowAllSlots] = useState(false);
  const [currentSlotIdx, setCurrentSlotIdx] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<
    string | null
  >(null);

  const today = new Date();
  const weekLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  function remindersForDate(dateStr: string) {
    return reminders.filter((r) => r.startDate === dateStr);
  }
  function isDayCompleted(dateStr: string) {
    const rs = remindersForDate(dateStr);
    return rs.length > 0 && rs.every((r) => r.status === "completed");
  }

  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const monthDays: Date[] = [];
  let firstDayOfWeek = getDay(monthStart) || 7;
  for (let i = 1; i < firstDayOfWeek; i++) {
    monthDays.push(addDays(monthStart, -(firstDayOfWeek - i)));
  }
  for (let d = 0; d < monthEnd.getDate() - monthStart.getDate() + 1; d++) {
    monthDays.push(addDays(monthStart, d));
  }
  let trailing = 7 - (monthDays.length % 7);
  if (trailing < 7) {
    for (let i = 1; i <= trailing; i++) {
      monthDays.push(addDays(monthEnd, i));
    }
  }

  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const completedDays = [...monthDays]
    .map((d) => format(d, "yyyy-MM-dd"))
    .filter((dateStr) => isDayCompleted(dateStr));
  const todayStr = format(today, "yyyy-MM-dd");

  let streak = 0;
  for (let i = 0; ; i++) {
    const date = addDays(today, -i);
    const dateStr = format(date, "yyyy-MM-dd");
    if (isDayCompleted(dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  const dateToShow = selectedCalendarDate || todayStr;
  const filteredReminders = reminders.filter((r: Reminder) => {
    const matchesPet = !selectedPet || r.pet === Number(selectedPet);
    const matchesCategory =
      !selectedCategory || r.category === Number(selectedCategory);
    const matchesDate = r.startDate === dateToShow;
    return matchesPet && matchesCategory && matchesDate;
  });

  const grouped: Record<
    string,
    { pending: Reminder[]; completed: Reminder[] }
  > = {};
  for (const slot of TIME_SLOTS) {
    grouped[slot] = { pending: [], completed: [] };
  }
  for (const r of filteredReminders) {
    grouped[r.slot][r.status].push(r);
  }

  const handleMarkAsDone = (id: number) => {
    setAnimating((prev: number[]) => [...prev, id]);
    setTimeout(() => {
      markAsDone(id);
      setAnimating((prev) => prev.filter((x) => x !== id));
    }, 400);
  };

  const startEdit = (reminder: Reminder) => {
    setEditingId(reminder.id);
    setEditForm({ ...reminder });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId) {
      updateReminder(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleDelete = (id: number) => {
    deleteReminder(id);
    setDeleteId(null);
    if (editingId === id) {
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleNextSlot = () =>
    setCurrentSlotIdx((i) => (i + 1) % TIME_SLOTS.length);

  function handleCalendarDateClick(dateStr: string) {
    setSelectedCalendarDate(dateStr);
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-black p-4 font-sans max-w-md mx-auto relative pb-24">
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-bold">Daily Reminders</div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
        <Zap className="w-4 h-4" />
        {streak > 0 ? (
          <span className="text-yellow-500 font-semibold">
            🔥 {streak}-day streak!
          </span>
        ) : (
          <span>Your Streaks</span>
        )}
      </div>

      <div className="bg-green-500 rounded-2xl p-4 mb-4">
        <div className="text-center text-black font-semibold text-sm mb-1 transition-all duration-300">
          {format(today, "MMMM yyyy")}
        </div>
        <div className="flex justify-between items-center text-xs text-black font-medium mb-1 transition-all duration-300">
          {weekLabels.map((label) => (
            <span key={label} className="transition-all duration-300">
              {label}
            </span>
          ))}
        </div>
        <div className="transition-all duration-500">
          {!showMonthCalendar ? (
            <div className="flex justify-between items-center mb-1 transition-all duration-500">
              {weekDays.map((d, i) => {
                const dStr = format(d, "yyyy-MM-dd");
                const isCompleted = completedDays.includes(dStr);
                const isCurrent = isToday(d);
                const isPast = isBefore(d, startOfToday());
                return (
                  <span
                    key={dStr}
                    className={clsx(
                      "w-9 h-9 flex items-center justify-center font-semibold transition-all duration-500 ease-in-out",
                      isCompleted &&
                        !isCurrent &&
                        "bg-yellow-300 text-black rounded-full",
                      isCurrent &&
                        "border-2 border-black bg-green-300 text-green-600 rounded-full shadow",
                      !isCompleted && !isCurrent && "text-green-100",
                      isPast &&
                        !isCompleted &&
                        "line-through text-green-100/60 decoration-2"
                    )}
                    style={{ position: "relative", cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCalendarDateClick(dStr);
                    }}
                  >
                    {format(d, "d")}
                    {isCurrent && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-600 rounded-full transition-all duration-300" />
                    )}
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-y-2 mb-2 transition-all duration-500">
              {monthDays.map((d, i) => {
                const dStr = format(d, "yyyy-MM-dd");
                const isCurrentMonth = d.getMonth() === today.getMonth();
                const isCompleted = completedDays.includes(dStr);
                const isCurrent = isToday(d);
                const isPast = isBefore(d, startOfToday());
                return (
                  <span
                    key={dStr + i}
                    className={clsx(
                      "w-9 h-9 flex items-center justify-center font-semibold transition-all duration-500 ease-in-out mx-auto",
                      isCurrentMonth ? "" : "opacity-30",
                      isCompleted &&
                        !isCurrent &&
                        isCurrentMonth &&
                        "bg-yellow-300 text-black rounded-full",
                      isCurrent &&
                        isCurrentMonth &&
                        "border-2 border-black bg-green-300 text-green-600 rounded-full shadow",
                      !isCompleted &&
                        !isCurrent &&
                        isCurrentMonth &&
                        "text-green-100",
                      !isCurrentMonth && "text-green-100",
                      isPast &&
                        !isCompleted &&
                        isCurrentMonth &&
                        "line-through text-green-100/60 decoration-2"
                    )}
                    style={{ position: "relative", cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCalendarDateClick(dStr);
                    }}
                  >
                    {format(d, "d")}
                    {isCurrent && isCurrentMonth && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-600 rounded-full transition-all duration-300" />
                    )}
                  </span>
                );
              })}
            </div>
          )}
          <div className="flex justify-center transition-all duration-500">
            <ChevronDown
              className={clsx(
                "w-5 h-5 text-white opacity-80 transition-all duration-500 ease-in-out hover:opacity-100",
                showMonthCalendar && "rotate-180"
              )}
              onClick={() => setShowMonthCalendar((v) => !v)}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        {selectedCalendarDate && (
          <div className="flex justify-end mb-2">
            <button
              className="text-xs text-green-700 bg-green-100 px-3 py-1 cursor-pointer rounded font-semibold hover:bg-green-200 transition"
              onClick={() => setSelectedCalendarDate(null)}
            >
              Show All Reminders
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-2">
        <select
          className="w-full cursor-pointer border rounded-lg px-3 py-2 text-sm bg-gray-50 placeholder:font-semibold placeholder:bg-gray-100"
          value={selectedPet}
          onChange={(e) => setSelectedPet(e.target.value)}
        >
          <option value="">All Pets</option>
          {PETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          className="w-full cursor-pointer border rounded-lg px-3 py-2 text-sm bg-gray-50 placeholder:font-semibold placeholder:bg-gray-100"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-700 font-semibold text-base">
          {showAllSlots ? (
            <span>All Slots</span>
          ) : (
            <>
              <span>{TIME_SLOTS[currentSlotIdx]}</span>
              <button
                onClick={handleNextSlot}
                className="ml-2 p-1 rounded cursor-pointer hover:bg-gray-200"
              >
                <ChevronDown className="w-5 h-5 rotate-270" />
              </button>
            </>
          )}
        </div>
        <button
          className="text-sm text-gray-500 cursor-pointer font-medium"
          onClick={() => setShowAllSlots((v) => !v)}
        >
          {showAllSlots ? "Show One" : "View All"}
        </button>
      </div>

      {loading ? (
        <div className="space-y-6 mt-8">
          {["Morning", "Afternoon", "Evening"].map((slot) => (
            <div key={slot}>
              <div className="flex items-center gap-2 text-gray-300 font-semibold text-base mb-2">
                <Skeleton className="w-4 h-4 mr-2" />
                <Skeleton className="w-24 h-5" />
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {showAllSlots ? (
            TIME_SLOTS.map((slot) => (
              <TimeSlotSection
                key={slot}
                slot={slot}
                grouped={grouped}
                editingId={editingId}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                editForm={editForm}
                setEditForm={setEditForm}
                startEdit={startEdit}
                saveEdit={saveEdit}
                cancelEdit={cancelEdit}
                setDeleteId={setDeleteId}
                markAsDone={handleMarkAsDone}
                pets={PETS}
                categories={CATEGORIES}
                animating={animating}
                loading={loading}
              />
            ))
          ) : (
            <TimeSlotSection
              slot={TIME_SLOTS[currentSlotIdx]}
              grouped={grouped}
              editingId={editingId}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              editForm={editForm}
              setEditForm={setEditForm}
              startEdit={startEdit}
              saveEdit={saveEdit}
              cancelEdit={cancelEdit}
              setDeleteId={setDeleteId}
              markAsDone={handleMarkAsDone}
              pets={PETS}
              categories={CATEGORIES}
              animating={animating}
              loading={loading}
            />
          )}
        </>
      )}

      <button
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors z-10"
        onClick={() => router.push("/add")}
      >
        <Plus className="w-8 h-8" />
      </button>
      <DeleteConfirmation
        open={deleteId !== null}
        onConfirm={() => handleDelete(deleteId!)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
