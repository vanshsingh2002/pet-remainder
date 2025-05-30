interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation = ({ open, onConfirm, onCancel }: Props) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl shadow-xl p-6 w-80 max-w-[90vw] border border-gray-100">
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <div className="font-semibold text-lg text-gray-900">Delete Reminder</div>
            <div className="text-gray-600">Are you sure you want to delete this reminder?</div>
          </div>
          
          <div className="flex gap-3 justify-end pt-2">
            <button
              className="bg-gray-100 cursor-pointer text-gray-800 font-medium rounded-lg px-4 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="bg-red-600 cursor-pointer text-white font-medium rounded-lg px-4 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;