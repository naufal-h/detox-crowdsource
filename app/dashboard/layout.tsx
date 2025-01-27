// src/app/dashboard/layout.tsx
import { StatsCardSkeleton } from "@/components/stats-card-skeleton";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<div>Error loading dashboard</div>}>
      <Suspense
        fallback={
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
