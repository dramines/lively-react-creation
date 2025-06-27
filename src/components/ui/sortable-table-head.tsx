
import { TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortConfig } from '@/hooks/useTableSort';

interface SortableTableHeadProps {
  children: React.ReactNode;
  sortKey: string;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  className?: string;
}

export const SortableTableHead = ({ 
  children, 
  sortKey, 
  sortConfig, 
  onSort, 
  className 
}: SortableTableHeadProps) => {
  const getSortIcon = () => {
    if (sortConfig.key !== sortKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    if (sortConfig.direction === 'desc') {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <TableHead className={className}>
      <Button
        variant="ghost"
        onClick={() => onSort(sortKey)}
        className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent"
      >
        {children}
        {getSortIcon()}
      </Button>
    </TableHead>
  );
};
