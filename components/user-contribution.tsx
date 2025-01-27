import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";
import { DeleteButton } from "./delete-button";
import { EditDialog } from "./edit-dialog";

type Contribution = {
  id: string;
  detoxed_text: string | null;
  is_undetoxifiable: boolean;
  created_at: string;
  sentences: {
    toxic_text: string;
  };
};

export async function UserContributions({ userId }: { userId: string }) {
  const supabase = createClient();

  const { data: contributions } = await supabase
    .from("detoxed_versions")
    .select(
      `
	  id,
	  detoxed_text,
	  is_undetoxifiable,
	  created_at,
	  sentences!inner(toxic_text)

	`
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!contributions?.length) {
    return <p className="text-muted-foreground">Belum ada kontribusi</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kalimat Toksik</TableHead>
          <TableHead>Versi Detoks</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(contributions as unknown as Contribution[]).map((contribution) => (
          <TableRow key={contribution.id}>
            <TableCell className="max-w-[300px] truncate">
              {contribution.sentences?.toxic_text}
            </TableCell>
            <TableCell>
              {contribution.is_undetoxifiable
                ? "Tidak bisa didetoks"
                : contribution.detoxed_text}
            </TableCell>
            <TableCell>
              {contribution.is_undetoxifiable
                ? "Tidak bisa didetoks"
                : "Sudah didetoks"}
            </TableCell>
            <TableCell>
              {new Date(contribution.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell className="flex gap-2">
              <EditDialog contribution={contribution} />
              <DeleteButton id={contribution.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
