import { Clock, Repeat, PawPrint, Check, Edit2, Trash2 } from "lucide-react";
import clsx from "clsx";
import { Reminder, PETS, CATEGORIES } from "../types/reminderTypes";
import ReminderEditForm from "./ReminderEditForm";
import { useRef, useEffect } from "react";

interface Props {
  r: Reminder;
  isEditing: boolean;
  isExpanded: boolean;
  setExpandedId: (id: number | null) => void;
  editForm: Partial<Reminder>;
  setEditForm: React.Dispatch<React.SetStateAction<Partial<Reminder>>>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onMarkDone: () => void;
  pets: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  animating: boolean;
}

function formatTime(t: string) {
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "pm" : "am";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${ampm}`;
}

const ReminderCard = ({
  r,
  isEditing,
  isExpanded,
  setExpandedId,
  editForm,
  setEditForm,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onMarkDone,
  pets,
  categories,
  animating,
}: Props) => {
  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("button[data-mark-done]") ||
      isEditing
    )
      return;
    setExpandedId(isExpanded ? null : r.id);
  };

  const checkRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (animating && checkRef.current) {
      checkRef.current.animate(
        [
          { transform: "scale(1)", opacity: 1 },
          { transform: "scale(1.4)", opacity: 0.5 },
          { transform: "scale(1)", opacity: 1 },
        ],
        { duration: 350 }
      );
    }
  }, [animating]);

  return (
    <div
      className={clsx(
        "bg-white rounded-xl shadow flex flex-col px-4 py-3 transition-all duration-500 cursor-pointer",
        animating && "opacity-0 translate-x-10",
        isExpanded
          ? "ring-2 ring-green-200"
          : "hover:ring-1 hover:ring-gray-200"
      )}
      style={{
        transitionProperty:
          "box-shadow, border-radius, opacity, transform, height",
      }}
      onClick={handleCardClick}
    >
      {isEditing ? (
        <ReminderEditForm
          editForm={editForm}
          setEditForm={setEditForm}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
          pets={pets}
          categories={categories}
        />
      ) : isExpanded ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-base">{r.title}</div>
            <button
              className="bg-green-100 text-green-700 cursor-pointer rounded-full p-1 ml-2 hover:bg-green-200 transition active:scale-90 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                onMarkDone();
              }}
              aria-label="Mark as done"
              data-mark-done
            >
              <span ref={checkRef}>
                <Check className="w-5 h-5" />
              </span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700 mb-2">
            <div className="font-medium">Time:</div>
            <div>{formatTime(r.time)}</div>
            <div className="font-medium">Frequency:</div>
            <div>{r.frequency}</div>
            <div className="font-medium">Pet:</div>
            <div>{PETS.find((p) => p.id === r.pet)?.name}</div>
            <div className="font-medium">Category:</div>
            <div>{CATEGORIES.find((c) => c.id === r.category)?.name}</div>
            <div className="font-medium">Slot:</div>
            <div>{r.slot}</div>
            <div className="font-medium">Status:</div>
            <div className="capitalize">{r.status}</div>
          </div>
          <div className="flex gap-3 mt-2 justify-end">
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium cursor-pointer rounded-lg px-4 py-2 text-sm transition-all duration-200 active:scale-95 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit2 className="w-4 h-4 inline mr-1" /> Edit
            </button>
            <button
              className="bg-red-100 hover:bg-red-200 text-red-700 font-medium cursor-pointer rounded-lg px-4 py-2 text-sm transition-all duration-200 active:scale-95 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-4 h-4 inline mr-1" /> Delete
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="font-semibold text-base">{r.title}</div>
            <button
              className="bg-green-100 text-green-700 cursor-pointer rounded-full p-1 ml-2 hover:bg-green-200 transition active:scale-90 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                onMarkDone();
              }}
              aria-label="Mark as done"
              data-mark-done
            >
              <span ref={checkRef}>
                <Check className="w-5 h-5" />
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1 ml-1">
            <Clock className="w-4 h-4" />
            {formatTime(r.time)}
            <Repeat className="w-4 h-4 ml-2" />
            {r.frequency}
            <PawPrint className="w-4 h-4 ml-2" />
            {pets.find((p) => p.id === r.pet)?.name}
          </div>
        </>
      )}
    </div>
  );
};

export default ReminderCard;
