import { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function ModalComponent({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-transparent p-1 rounded-lg shadow-lg w-96">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
