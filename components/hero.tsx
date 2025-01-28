import { createClient } from "@/utils/supabase/client";

import { AlertTriangle, BookText, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default async function Header() {
  try {
    const supabase = createClient();

    // Parallel fetching
    const { count: totalSentences } = await supabase
      .from("sentences")
      .select("*", { count: "exact", head: true });

    const { data: filledData } = await supabase
      .from("detoxed_versions")
      .select("sentence_id")
      .neq("is_undetoxifiable", true);

    const filledSentences = new Set(filledData?.map((d) => d.sentence_id)).size;

    return (
      <div className="container max-w-6xl py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Detoxify Crowdsource</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Platform crowdsourcing untuk detoksifikasi teks bahasa Indonesia
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Total Kalimat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {totalSentences?.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Telah Didetoks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {filledSentences.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {((filledSentences / totalSentences!) * 100).toFixed(3)}%
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Disclaimer Section */}
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Peringatan!</AlertTitle>
          <AlertDescription>
            Anda akan melihat konten yang mungkin bersifat toksik/ofensif. Harap
            tidak mengambil konten ini secara pribadi.
          </AlertDescription>
        </Alert>

        {/* Instructions Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Petunjuk Detoksifikasi</h2>

          <div className="grid gap-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Tips Detoksifikasi</AlertTitle>
              <AlertDescription>
                1. Pastikan untuk tidak mengubah makna asli dari kalimat awal
                <br />
                2. Gunakan bahasa yang sopan
                <br />
                3. Hindari kata slang/ungkapan kasar
                <br />
                4. Jika mengandung SARA, netralkan tanpa menghilangkan konteks
                <br />
                5. Jika kalimat tidak mungkin didetoksifikasi, centang opsi
                "Kalimat ini tidak bisa didetoksifikasi"
              </AlertDescription>
            </Alert>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookText className="h-5 w-5" />
                  Contoh Detoksifikasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Toksik</h3>
                    <p className="text-sm text-red-500">
                      "Dasar goblok! Kerjaannya cuma bikin masalah!"
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Detoks</h3>
                    <p className="text-sm text-green-500">
                      "Perilaku tersebut hanya akan menimbulkan masalah"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="container max-w-6xl py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Gagal memuat data. Silakan coba refresh halaman.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}

export function HeaderSkeleton() {
  return (
    <div className="container max-w-6xl py-8">
      <section className="text-center mb-16">
        <Skeleton className="h-12 w-[500px] mx-auto mb-4" />
        <Skeleton className="h-6 w-[300px] mx-auto mb-8" />

        <div className="grid grid-cols-3 gap-4 mb-12">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[100px] mb-4" />
                {i === 1 && <Skeleton className="h-2 w-full mt-4" />}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Skeleton className="h-[100px] w-full mb-8" />

      <section className="mb-12">
        <Skeleton className="h-8 w-[200px] mb-6" />
        <div className="grid gap-6">
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </section>
    </div>
  );
}
