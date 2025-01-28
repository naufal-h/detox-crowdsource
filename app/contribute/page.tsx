"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { DisclaimerDialog } from "@/components/disclaimer-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/client";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ContributePage() {
  const [currentSentence, setCurrentSentence] = useState<any>(null);
  const [detoxedText, setDetoxedText] = useState("");
  const [isUndetoxifiable, setIsUndetoxifiable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const fetchRandomSentence = async () => {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;

    // Panggil fungsi PostgreSQL
    const { data: sentence } = await supabase
      .rpc("get_next_sentence", { user_id: user?.id })
      .select("id, toxic_text")
      .limit(1)
      .single();

    if (sentence) {
      setCurrentSentence(sentence);
    } else {
      setCurrentSentence(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRandomSentence();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    const user = (await supabase.auth.getUser()).data.user;

    try {
      // Insert ke detoxed_versions
      const { error } = await supabase.from("detoxed_versions").insert({
        sentence_id: currentSentence.id,
        user_id: user?.id,
        detoxed_text: isUndetoxifiable ? null : detoxedText,
        is_undetoxifiable: isUndetoxifiable,
      });

      // Update undetoxifiable_count jika perlu
      if (isUndetoxifiable) {
        await supabase.rpc("increment_undetoxifiable", {
          sentence_id: currentSentence.id,
        });
      }

      if (!error) {
        setDetoxedText("");
        setIsUndetoxifiable(false);
        await fetchRandomSentence();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentSentence && !loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl mb-4">🎉 Seluruh kalimat telah terisi!</h2>
        <div className="text-muted-foreground mb-4">
          Terima kasih atas kontribusi Anda. Silakan kembali ke dashboard.
        </div>
        <Button onClick={() => router.push("/dashboard")}>
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <DisclaimerDialog />

      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertTitle>Panduan Detoksifikasi</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-6">
            <li>Pastikan untuk tidak mengubah makna asli dari kalimat awal</li>
            <li>Gunakan bahasa yang sopan</li>
            <li>Hindari kata slang/ungkapan kasar</li>
            <li>Jika mengandung SARA, netralkan tanpa menghilangkan konteks</li>
            <li>
              Jika kalimat tidak mungkin didetoksifikasi, centang opsi "Kalimat
              ini tidak bisa didetoksifikasi"
            </li>
          </ul>
          <h3 className="font-semibold mt-4">Contoh Detoksifikasi:</h3>
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-destructive">
              Toksik: "Dasar goblok! Kerjamu payah!"
            </div>
            <p className="text-success">
              Detoks: "Perhatikan kembali pekerjaanmu"
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="font-semibold leading-none tracking-tight">
            Kalimat yang Perlu Didetoksifikasi
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-6 w-full" />
          ) : (
            <div className="text-sm mb-6 p-4 bg-muted rounded-lg">
              {currentSentence?.toxic_text}
            </div>
          )}

          <div className="space-y-4">
            <Textarea
              value={detoxedText}
              onChange={(e) => setDetoxedText(e.target.value)}
              placeholder="Masukkan versi detoksifikasi di sini..."
              disabled={isUndetoxifiable || loading}
              className="min-h-[120px]"
            />

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isUndetoxifiable}
                onChange={(e) => setIsUndetoxifiable(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm">
                Kalimat ini tidak bisa didetoksifikasi
              </span>
            </label>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                Kembali
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={
                  submitting || loading || (!detoxedText && !isUndetoxifiable)
                }
              >
                {submitting ? "Menyimpan..." : "Simpan dan Lanjutkan"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
