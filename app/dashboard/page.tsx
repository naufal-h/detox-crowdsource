import { StatsCard } from "@/components/stats-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserContributions } from "@/components/user-contribution";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get stats data
  const { count: totalSentences } = await supabase
    .from("sentences")
    .select("*", { count: "exact", head: true });

  const { data: filledData } = await supabase
    .from("detoxed_versions")
    .select("sentence_id")
    .neq("is_undetoxifiable", true);

  const filledSentences = new Set(filledData?.map((d) => d.sentence_id)).size;

  const { count: userContributions } = await supabase
    .from("detoxed_versions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Detoxification Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Total Kalimat Toksik"
          value={totalSentences || 0}
          description="Jumlah total kalimat dalam dataset"
        />
        <StatsCard
          title="Telah Didetoks"
          value={filledSentences || 0}
          description="Kalimat yang sudah memiliki versi detoks"
        />
        <StatsCard
          title="Kontribusi Anda"
          value={userContributions || 0}
          description="Jumlah kalimat yang telah Anda detoksifikasi"
        />
      </div>

      {/* Action Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Progress Detoksifikasi</h2>
            <p className="text-sm text-muted-foreground">
              {filledSentences}/{totalSentences} kalimat telah didetoksifikasi
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/contribute">Mulai Kontribusi</Link>
            </Button>
            <Button asChild>
              <Link href="/evaluate-mlm">Evaluasi Model</Link>
            </Button>
          </div>
        </div>
        <Progress
          value={(filledSentences! / totalSentences!) * 100}
          className="h-2"
        />
      </div>

      {/* User Contributions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Kontribusi Anda</h2>
        <UserContributions userId={user!.id} />
      </div>
    </div>
  );
}
