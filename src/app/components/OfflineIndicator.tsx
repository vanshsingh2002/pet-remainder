import { WifiOff } from "lucide-react";

export default function OfflineIndicator() {
  return (
    <div className="fixed bottom-20 right-6 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">Offline Mode</span>
    </div>
  );
} 