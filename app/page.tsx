import Hero, { HeaderSkeleton } from "@/components/hero";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Hero />
      </Suspense>
      <main className="flex-1 flex flex-col gap-6 px-4"></main>
    </>
  );
}
