"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const supabase = createClient();
    const { error } = await supabase
      .from("detoxed_versions")
      .delete()
      .eq("id", id);

    if (!error) {
      router.refresh();
    }
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete}>
      Hapus
    </Button>
  );
}
