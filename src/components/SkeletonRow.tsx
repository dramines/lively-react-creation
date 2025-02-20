
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonRow = () => {
  return (
    <div className="flex items-center space-x-4 p-4">
      <Skeleton className="h-4 w-[10%]" />
      <Skeleton className="h-4 w-[15%]" />
      <Skeleton className="h-4 w-[15%]" />
      <Skeleton className="h-4 w-[20%]" />
      <Skeleton className="h-4 w-[15%]" />
      <Skeleton className="h-4 w-[15%]" />
      <Skeleton className="h-4 w-[10%]" />
      <Skeleton className="h-4 w-[20%]" />
    </div>
  );
};
