'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="w-full max-w-lg rounded-xl border border-border bg-background p-0 shadow-lg backdrop:bg-black/50"
    >
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        {title && (
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        )}
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="px-6 py-4">{children}</div>
    </dialog>
  );
}
