
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DateFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const DateFilter = ({ value, onValueChange }: DateFilterProps) => {
  const dateOptions = [
    { value: 'all', label: 'Toutes les dates' },
    { value: 'today', label: "Aujourd'hui" },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' }
  ];

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Filtrer par date" />
      </SelectTrigger>
      <SelectContent>
        {dateOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
