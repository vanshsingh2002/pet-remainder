import { Trash2 } from "lucide-react";
import { Reminder } from "../types/reminderTypes";

interface Props {
  editForm: Partial<Reminder>;
  setEditForm: React.Dispatch<React.SetStateAction<Partial<Reminder>>>;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  pets: { id: number; name: string }[];
  categories: { id: number; name: string }[];
}

const ReminderEditForm = ({
  editForm,
  setEditForm,
  onSave,
  onCancel,
  onDelete,
  pets,
  categories,
}: Props) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-200 transition-all duration-200 mb-2"
          value={editForm.title || ""}
          onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
          maxLength={100}
          placeholder="Enter title"
        />
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-200 transition-all duration-200"
          type="time"
          value={editForm.time || ""}
          onChange={(e) => setEditForm((f) => ({ ...f, time: e.target.value }))}
        />
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-200 transition-all duration-200"
          value={editForm.frequency || ""}
          onChange={(e) => setEditForm((f) => ({ ...f, frequency: e.target.value }))}
        >
          <option value="Everyday">Everyday</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-200 transition-all duration-200"
          value={editForm.pet || ""}
          onChange={(e) => setEditForm((f) => ({ ...f, pet: Number(e.target.value) }))}
        >
          {pets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-200 transition-all duration-200"
          value={editForm.category || ""}
          onChange={(e) => setEditForm((f) => ({ ...f, category: Number(e.target.value) }))}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-3 mt-4 justify-end">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-medium cursor-pointer rounded-lg px-4 py-2 text-sm transition-all duration-200 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          onClick={onSave}
        >
          Save
        </button>
        <button
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium cursor-pointer rounded-lg px-4 py-2 text-sm transition-all duration-200 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="bg-red-100 hover:bg-red-200 text-red-700 font-medium cursor-pointer rounded-lg px-4 py-2 text-sm transition-all duration-200 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 inline mr-1" /> Delete
        </button>
      </div>
    </>
  );
};

export default ReminderEditForm; 