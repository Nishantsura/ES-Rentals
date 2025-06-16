'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

interface StatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  status: 'success' | 'error';
}

export function StatusModal({
  open,
  onOpenChange,
  title,
  description,
  status,
}: StatusModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-4">
            {status === 'success' ? (
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            ) : (
              <XCircle className="h-8 w-8 text-red-500" />
            )}
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
