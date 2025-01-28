"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export function DisclaimerDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("disclaimer-accepted");
    if (!hasAccepted) setOpen(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("disclaimer-accepted", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>⚠️ Peringatan: Konten Sensitif</DialogTitle>
          <div className="text-sm text-muted-foreground space-y-4">
            <p className="mt-4">
              Anda akan melihat berbagai kalimat yang mungkin mengandung konten:
            </p>
            <ul className="list-disc pl-6">
              <li>Kata-kata kasar atau umpatan</li>
              <li>Konten sensitif atau SARA</li>
              <li>Bahasa yang tidak pantas</li>
            </ul>
            <p>
              Penulis menyadari bahwa konten seperti ini bisa jadi tidak nyaman
              untuk dilihat atau dibaca. Terima kasih atas pengertian Anda.
            </p>
          </div>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={handleAccept}>Saya Mengerti dan Setuju</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
