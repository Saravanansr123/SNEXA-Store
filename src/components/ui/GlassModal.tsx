import { X } from "lucide-react";

interface GlassModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function GlassModal({
  title,
  onClose,
  children,
}: GlassModalProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="
          w-full max-w-3xl
          bg-white/10 backdrop-blur-2xl
          border border-white/10
          rounded-3xl shadow-2xl
          max-h-[90vh] overflow-y-auto
        ">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-medium text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <X />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
