'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: React.ReactNode;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={`w-full ${sizeStyles[size]} max-h-[90vh] overflow-hidden rounded-xl border border-border bg-background p-0 shadow-xl backdrop:bg-black/50`}
    >
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        {title ? (
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        ) : (
          <span />
        )}
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="max-h-[calc(90vh-60px)] overflow-y-auto px-6 py-5">
        {children}
      </div>
    </dialog>
  );
}
