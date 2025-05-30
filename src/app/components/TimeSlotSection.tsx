import ReminderCard from "./ReminderCard";
import { Reminder } from "../types/reminderTypes";
import { Check, Sun, RefreshCcw, Clock } from "lucide-react";
import clsx from "clsx";
import Skeleton from "./Skeleton";

interface Props {
  slot: string;
  grouped: Record<string, { pending: Reminder[]; completed: Reminder[] }>;
  editingId: number | null;
  expandedId: number | null;
  setExpandedId: (id: number | null) => void;
  editForm: Partial<Reminder>;
  setEditForm: React.Dispatch<React.SetStateAction<Partial<Reminder>>>;
  startEdit: (reminder: Reminder) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  setDeleteId: (id: number) => void;
  markAsDone: (id: number) => void;
  pets: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  animating: number[];
  loading?: boolean;
}

const TimeSlotSection = ({
  slot,
  grouped,
  editingId,
  expandedId,
  setExpandedId,
  editForm,
  setEditForm,
  startEdit,
  saveEdit,
  cancelEdit,
  setDeleteId,
  markAsDone,
  pets,
  categories,
  animating,
  loading = false,
}: Props) => {
  if (loading) {
    return (
      <div className="mb-6">
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
    );
  }
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-gray-700 font-semibold text-base mb-2">
        {slot === "Morning" && <Sun className="w-4 h-4" />}
        {slot === "Afternoon" && <RefreshCcw className="w-4 h-4" />}
        {slot === "Evening" && <Clock className="w-4 h-4" />}
        {slot}
      </div>
      {/* Pending */}
      {grouped[slot].pending.length > 0 && (
        <div className="mb-2">
          <div className="font-semibold text-gray-700 text-sm mb-2">Pending</div>
          <div className="space-y-3">
            {grouped[slot].pending.map((r) => (
              <ReminderCard
                key={r.id}
                r={r}
                isEditing={editingId === r.id}
                isExpanded={expandedId === r.id}
                setExpandedId={setExpandedId}
                editForm={editForm}
                setEditForm={setEditForm}
                onEdit={() => startEdit(r)}
                onSave={saveEdit}
                onCancel={cancelEdit}
                onDelete={() => setDeleteId(r.id)}
                onMarkDone={() => markAsDone(r.id)}
                pets={pets}
                categories={categories}
                animating={animating.includes(r.id)}
              />
            ))}
          </div>
        </div>
      )}
      {/* Completed */}
      {grouped[slot].completed.length > 0 && (
        <div>
          <div className="font-semibold text-gray-700 text-sm mb-2">Completed</div>
          <div className="space-y-3">
            {grouped[slot].completed.map((r) => (
              <div
                key={r.id}
                className="bg-gray-200 rounded-xl flex items-center px-4 py-3 transition-all duration-500"
              >
                <span className="flex-1 text-gray-400 font-semibold">{r.title}</span>
                <span className="bg-black rounded-full w-6 h-6 flex items-center justify-center ml-2">
                  <Check className="w-4 h-4 text-white" />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* No Reminders */}
      {grouped[slot].pending.length === 0 && grouped[slot].completed.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8">
          <span className="text-3xl mb-2">🗓️</span>
          <span className="text-gray-400 font-semibold text-base">No reminders for this time</span>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSection; 