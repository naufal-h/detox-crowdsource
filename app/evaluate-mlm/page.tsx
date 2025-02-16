"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EvaluatePage() {
  const [currentPair, setCurrentPair] = useState<any>(null);
  const [evaluation, setEvaluation] = useState({
    toxicity: "",
    content: "",
    fluency: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const fetchRandomPair = async () => {
    setLoading(true);

    const { data: pairs, error } = await supabase
      .rpc("get_next_evaluation_mlm")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    // const { data: pairs } = await supabase
    //   .from("evaluation_mlm")
    //   .select("*")
    //   .is("toxicity", null)
    //   .is("content_preservation", null)
    //   .is("fluency", null)
    //   .limit(1);

    console.log("pairs", pairs);

    setCurrentPair(pairs);
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomPair();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    const user = (await supabase.auth.getUser()).data.user;

    try {
      const { error } = await supabase
        .from("evaluation_mlm")
        .update({
          id: currentPair.id,
          user_id: user?.id,
          toxicity: evaluation.toxicity,
          content_preservation: evaluation.content,
          fluency: evaluation.fluency,
        })
        .eq("id", currentPair.id);

      console.log("error", error);

      if (!error) {
        setEvaluation({ toxicity: "", content: "", fluency: "" });
        await fetchRandomPair();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentPair && !loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl mb-4">✅ Evaluasi Selesai!</h2>
        <p className="text-muted-foreground mb-4">
          Terima kasih telah berpartisipasi dalam evaluasi.
        </p>
        <Button onClick={() => router.push("/dashboard")}>
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Panduan Evaluasi</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple">
            <AccordionItem value="toxicity">
              <AccordionTrigger>Toxicity (STAm)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <ul className="list-disc pl-6">
                    <li>
                      Agresi terselubung dan sarkasme diperbolehkan selama tidak
                      ada serangan yang jelas terhadap individu atau kelompok.
                    </li>
                    <li>
                      Ketidakteraturan dalam gaya bahasa atau formalitas tidak
                      mempengaruhi skor selama kalimat tetap tidak berbahaya.
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="content">
              <AccordionTrigger>Content (SIMm)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <ul className="list-disc pl-6">
                    <li>
                      Jika kalimat memiliki kata-kata yang sama tetapi dengan
                      niat yang berbeda, hal ini dianggap memiliki makna yang
                      berbeda.
                    </li>
                    <li>
                      Jika ada beberapa perubahan yang tidak dapat dihindari
                      maka maknanya masih termasuk sama.
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="fluency">
              <AccordionTrigger>Fluency (FLm)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <ul className="list-disc pl-6">
                    <li>
                      <strong>Non-Fluent (0):</strong> Sulit dipahami
                    </li>
                    <li>
                      <strong>Partially Fluent (0.5):</strong> Ada kesalahan
                      tapi bisa dipahami
                    </li>
                    <li>
                      <strong>Fluent (1):</strong> Fasih, tanpa kesalahan
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evaluasi Detoksifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <>
              <div className="space-y-6 mb-8">
                <div>
                  <Label className="block mb-2">Kalimat Asli</Label>
                  <div className="p-4 bg-muted rounded-lg">
                    {currentPair.toxic_text}
                  </div>
                </div>

                <div>
                  <Label className="block mb-2">Hasil Detoksifikasi</Label>
                  <div className="p-4 bg-muted rounded-lg">
                    {currentPair.detoxed_text}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Toxicity */}
                <div>
                  <Label className="block mb-4">
                    1. Apakah kalimat tersebut masih toksik?
                  </Label>
                  <RadioGroup
                    value={evaluation.toxicity}
                    onValueChange={(value) =>
                      setEvaluation({ ...evaluation, toxicity: value })
                    }
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="toxicity-0" />
                      <Label htmlFor="toxicity-0">Masih Toksik</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="toxicity-1" />
                      <Label htmlFor="toxicity-1">Tidak Toksik</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Content */}
                <div>
                  <Label className="block mb-4">
                    2. Apakah makna asli tetap terjaga?
                  </Label>
                  <RadioGroup
                    value={evaluation.content}
                    onValueChange={(value) =>
                      setEvaluation({ ...evaluation, content: value })
                    }
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="content-0" />
                      <Label htmlFor="content-0">Maknanya Berubah</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="content-1" />
                      <Label htmlFor="content-1">Maknanya Sama</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Fluency */}
                <div>
                  <Label className="block mb-4">
                    3. Bagaimana tingkat kefasihan?
                  </Label>
                  <RadioGroup
                    value={evaluation.fluency}
                    onValueChange={(value) =>
                      setEvaluation({ ...evaluation, fluency: value })
                    }
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="fluency-0" />
                      <Label htmlFor="fluency-0">Non-Fluent (0)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0.5" id="fluency-0.5" />
                      <Label htmlFor="fluency-0.5">
                        Partially Fluent (0.5)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="fluency-1" />
                      <Label htmlFor="fluency-1">Fluent (1)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                >
                  Kembali
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    submitting ||
                    !evaluation.toxicity ||
                    !evaluation.content ||
                    !evaluation.fluency
                  }
                >
                  {submitting ? "Menyimpan..." : "Simpan Evaluasi"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
