
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DateFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const DateFilter = ({ value, onValueChange }: DateFilterProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Toutes les dates" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Toutes les dates</SelectItem>
        <SelectItem value="today">Aujourd'hui</SelectItem>
        <SelectItem value="week">Cette semaine</SelectItem>
        <SelectItem value="month">Ce mois-ci</SelectItem>
        <SelectItem value="year">Cette année</SelectItem>
      </SelectContent>
    </Select>
  );
};
