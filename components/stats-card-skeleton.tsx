import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

// src/components/stats-card-skeleton.tsx
export function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-[50px]" />
        <Skeleton className="h-4 w-[150px] mt-2" />
      </CardContent>
    </Card>
  );
}
