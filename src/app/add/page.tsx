"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check, PawPrint, FileText } from "lucide-react";
import { useReminders } from "../hooks/useReminders";

const PETS = [
  {
    id: 1,
    name: "Browny",
    icon: <span className="text-2xl">🐶</span>,
  },
  {
    id: 2,
    name: "Kitty",
    icon: <span className="text-2xl">🐱</span>,
  },
  {
    id: 3,
    name: "Max",
    icon: <span className="text-2xl">🦮</span>,
  },
];
const CATEGORIES = [
  {
    id: 1,
    name: "General",
    icon: <span className="text-2xl">🦴</span>,
  },
  {
    id: 2,
    name: "Health",
    icon: <span className="text-2xl">🩺</span>,
  },
  {
    id: 3,
    name: "Lifestyle",
    icon: <span className="text-2xl">🏖️</span>,
  },
];
const FREQUENCIES = ["Everyday", "Weekly", "Monthly"];

export default function AddReminder() {
  const router = useRouter();
  const { addReminder } = useReminders();
  const [pet, setPet] = useState(PETS[0].id);
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState(FREQUENCIES[0]);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  function validate() {
    const errs: any = {};
    if (!title.trim()) errs.title = "Title is required.";
    if (title.length > 100) errs.title = "Max 100 characters.";
    if (showNotes && notes.length > 200) errs.notes = "Max 200 characters.";
    if (!date) errs.date = "Start date is required.";
    if (!time) errs.time = "Time is required.";
    if (date && time) {
      const dt = new Date(`${date}T${time}`);
      if (dt < new Date())
        errs.datetime = "Date and time must be in the future.";
    }
    return errs;
  }

  async function handleSave() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      addReminder({
        title,
        time,
        slot: getTimeSlot(time),
        pet,
        category,
        frequency,
        status: "pending",
        notes: showNotes ? notes : "",
        startDate: date,
        endDate: showEndDate ? endDate : undefined,
      });

      setSuccess(true);
      setTimeout(() => router.push("/"), 1200);
    } catch (e: any) {
      setErrors({ api: e.message || "Failed to save reminder" });
    } finally {
      setLoading(false);
    }
  }

  function getTimeSlot(time: string): "Morning" | "Afternoon" | "Evening" {
    const hour = parseInt(time.split(":")[0]);
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-black font-sans max-w-md mx-auto pb-8">
      <div className="flex items-center justify-between px-2 py-4 bg-white sticky top-0 z-10">
        <button
          className="p-1 rounded hover:bg-gray-100 "
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="font-semibold text-base">Add Reminder</div>
        <button
          className="text-green-600 cursor-pointer font-semibold text-base"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="flex gap-2 px-4 mt-4 mb-2">
        <div className="flex-1">
          <div className="text-xs font-semibold text-gray-500 mb-1">
            Select Pet
          </div>
          <div className="relative">
            <select
              className="w-full bg-white rounded-lg border px-3 py-2 text-base font-bold flex items-center appearance-none pr-8"
              value={pet}
              onChange={(e) => setPet(Number(e.target.value))}
              style={{ paddingLeft: 44 }}
            >
              {PETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {PETS.find((p) => p.id === pet)?.icon}
            </span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="#888"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex-1">
          <div className="text-xs font-semibold text-gray-500 mb-1">
            Select Category
          </div>
          <div className="relative">
            <select
              className="w-full bg-white rounded-lg border px-3 py-2 text-base font-bold flex items-center appearance-none pr-8"
              value={category}
              onChange={(e) => setCategory(Number(e.target.value))}
              style={{ paddingLeft: 44 }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {CATEGORIES.find((c) => c.id === category)?.icon}
            </span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="#888"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow px-4 pb-4 mx-4 my-6">
        <div className="bg-black text-white rounded-t-lg px-3 py-3 font-semibold text-sm -mx-4 mb-3">
          Reminder Info
        </div>
        <div className="mb-3">
          <div className="text-base font-semibold mb-3">
            Set a reminder for...
          </div>
          <div className="relative">
            <input
              type="text"
              maxLength={100}
              placeholder="Type here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-gray-100 focus:outline-none placeholder:font-semibold placeholder:text-gray-400 ${
                errors.title ? "border-red-400" : ""
              }`}
            />
            <span className="absolute right-3 top-2 text-xs text-gray-400">
              {title.length}/100
            </span>
          </div>
          {errors.title && (
            <div className="text-xs text-red-500 mt-1">{errors.title}</div>
          )}
        </div>

        <div className="mb-2">
          <div className="-mx-4 border-t border-gray-300 mb-4" />
          <div className="flex items-center justify-between gap-2 mt-4">
            <div className="text-xl font-semibold">Add Notes (Optional)</div>
            {!showNotes && (
              <button
                className="ml-2 bg-green-100 text-green-700 cursor-pointer rounded px-3 py-1 text-xs font-semibold"
                tabIndex={-1}
                type="button"
                onClick={() => setShowNotes(true)}
              >
                Add
              </button>
            )}
          </div>
          {showNotes && (
            <input
              type="text"
              maxLength={200}
              placeholder="Add notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 mt-2 text-sm bg-gray-100 focus:outline-none placeholder:font-semibold placeholder:text-gray-400 ${
                errors.notes ? "border-red-400" : ""
              }`}
            />
          )}
          {showNotes && errors.notes && (
            <div className="text-xs text-red-500 mt-1">{errors.notes}</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow px-4 mx-4 my-6 pb-4">
        <div className="bg-black text-white rounded-t-lg px-3 py-3 font-semibold text-sm -mx-4 mb-3 flex items-center justify-between cursor-pointer">
          Reminder Settings
        </div>

        <div className="mb-3">
          <div className="text-base font-semibold mb-1">Start Date</div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-1/2 border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none ${
                errors.date || errors.datetime ? "border-red-400" : ""
              }`}
            />
          </div>
          {errors.date && (
            <div className="text-xs text-red-500 mt-1">{errors.date}</div>
          )}

          {!showEndDate && (
            <button
              type="button"
              className="mt-3 cursor-pointer text-base text-gray-400 font-semibold"
              onClick={() => setShowEndDate(true)}
            >
              + Add End Date
            </button>
          )}
          
          {showEndDate && (
            <>
              <div className="text-base font-semibold mb-1 mt-2">End Date</div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-1/2 border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none"
                />
              </div>
            </>
          )}
        </div>
        <div className="-mx-4 border-b border-gray-300 mb-3" />

        <div className="mb-3">
          <div className="text-sm font-semibold mb-1">Reminder Time</div>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`w-1/2 border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none ${
                errors.time || errors.datetime ? "border-red-400" : ""
              }`}
              step="60"
            />
          </div>
          {errors.time && (
            <div className="text-xs text-red-500 mt-1">{errors.time}</div>
          )}
          {errors.datetime && (
            <div className="text-xs text-red-500 mt-1">{errors.datetime}</div>
          )}
        </div>
        <div className="-mx-4 border-b border-gray-300 mb-3" />

        <div>
          <div className="text-sm font-semibold mb-1">Reminder Frequency</div>
          <div className="text-xs text-gray-400 mb-4">
            How often should this reminder repeat?
          </div>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 placeholder:font-semibold placeholder:bg-gray-100"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            {FREQUENCIES.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {errors.api && (
        <div className="text-center text-red-500 mt-4">{errors.api}</div>
      )}
      {success && (
        <div className="text-center text-green-600 mt-4 flex items-center justify-center gap-2">
          <Check className="w-5 h-5" />
          Reminder saved!
        </div>
      )}
    </div>
  );
}
