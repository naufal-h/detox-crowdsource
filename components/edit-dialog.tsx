"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function EditDialog({ contribution }: { contribution: any }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(contribution.detoxed_text || "");
  const router = useRouter();

  const handleSave = async () => {
    const supabase = createClient();
    const { error } = await supabase
      .from("detoxed_versions")
      .update({ detoxed_text: input })
      .eq("id", contribution.id);

    if (!error) {
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Detoksifikasi</DialogTitle>
          <DialogDescription>
            Kalimat asli: {contribution.sentences?.toxic_text}
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={contribution.is_undetoxifiable}
        />

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={contribution.is_undetoxifiable}
          >
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
