
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const RequestSkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="py-4 px-4"><Skeleton className="h-4 w-32" /></td>
    <td className="py-4 px-4"><Skeleton className="h-4 w-24" /></td>
    <td className="py-4 px-4"><Skeleton className="h-4 w-32" /></td>
    <td className="py-4 px-4"><Skeleton className="h-4 w-24" /></td>
    <td className="py-4 px-4"><Skeleton className="h-4 w-24" /></td>
    <td className="py-4 px-4">
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </td>
  </tr>
);
