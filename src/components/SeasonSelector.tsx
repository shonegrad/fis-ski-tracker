import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SeasonSelectorProps {
  selectedSeason: '2024/2025' | '2025/2026';
  onSeasonChange: (season: '2024/2025' | '2025/2026') => void;
}

export function SeasonSelector({ selectedSeason, onSeasonChange }: SeasonSelectorProps) {
  return (
    <Select value={selectedSeason} onValueChange={(value) => onSeasonChange(value as '2024/2025' | '2025/2026')}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select season" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="2024/2025">Season 2024/2025</SelectItem>
        <SelectItem value="2025/2026">Season 2025/2026</SelectItem>
      </SelectContent>
    </Select>
  );
}