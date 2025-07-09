
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StatusFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

export const StatusFilter = ({ value, onValueChange, options }: StatusFilterProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Filtrer par statut" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
