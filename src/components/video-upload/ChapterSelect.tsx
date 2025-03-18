
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSeasons, fetchChapters } from '@/api/chapters';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Season, Chapter } from '@/types/chapters';
import { SousChapterSelect } from './SousChapterSelect';

interface ChapterSelectProps {
  onSeasonSelect: (seasonId: string) => void;
  onChapterSelect: (chapterId: string) => void;
  onSousChapterSelect?: (sousChapterId: string) => void;
  defaultSeasonId?: string;
  defaultChapterId?: string;
  defaultSousChapterId?: string;
  onSubchapterChange?: (value: string) => void;
  onChapterChange?: (value: string) => void;
  selectedChapter?: string;
  selectedSubchapter?: string;
  selectedSousChapter?: string;
}

export const ChapterSelect: React.FC<ChapterSelectProps> = ({
  onSeasonSelect,
  onChapterSelect,
  onSousChapterSelect,
  defaultSeasonId,
  defaultChapterId,
  defaultSousChapterId,
  onSubchapterChange,
  onChapterChange,
  selectedChapter,
  selectedSubchapter,
  selectedSousChapter,
}) => {
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(defaultSeasonId || selectedChapter || '');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(defaultChapterId || selectedSubchapter || '');
  const [selectedSousChapterId, setSelectedSousChapterId] = useState<string>(defaultSousChapterId || selectedSousChapter || '');

  const { data: seasonsData, isLoading: isLoadingSeasons } = useQuery({
    queryKey: ['seasons'],
    queryFn: fetchSeasons,
  });

  const { data: chaptersData, isLoading: isLoadingChapters } = useQuery({
    queryKey: ['chapters', selectedSeasonId],
    queryFn: () => fetchChapters(selectedSeasonId),
    enabled: !!selectedSeasonId,
  });

  const filteredChapters = React.useMemo(() => {
    if (!chaptersData?.chapters) return [];
    
    return chaptersData.chapters
      .filter((chapter: Chapter) => chapter.id_saison === selectedSeasonId.toString())
      .sort((a, b) => parseInt(a.id_chapter) - parseInt(b.id_chapter));
  }, [chaptersData?.chapters, selectedSeasonId]);

  useEffect(() => {
    if (defaultSeasonId) {
      setSelectedSeasonId(defaultSeasonId);
    } else if (selectedChapter) {
      setSelectedSeasonId(selectedChapter);
    }
  }, [defaultSeasonId, selectedChapter]);

  useEffect(() => {
    if (defaultChapterId) {
      setSelectedChapterId(defaultChapterId);
    } else if (selectedSubchapter) {
      setSelectedChapterId(selectedSubchapter);
    }
  }, [defaultChapterId, selectedSubchapter]);

  useEffect(() => {
    if (defaultSousChapterId) {
      setSelectedSousChapterId(defaultSousChapterId);
    } else if (selectedSousChapter) {
      setSelectedSousChapterId(selectedSousChapter);
    }
  }, [defaultSousChapterId, selectedSousChapter]);

  const handleSeasonChange = (value: string) => {
    setSelectedSeasonId(value);
    setSelectedChapterId('');
    setSelectedSousChapterId('');
    onSeasonSelect(value);
    
    if (onChapterChange) {
      onChapterChange(value);
    }
  };

  const handleChapterChange = (value: string) => {
    setSelectedChapterId(value);
    setSelectedSousChapterId('');
    onChapterSelect(value);
    
    if (onSubchapterChange) {
      onSubchapterChange(value);
    }
  };

  const handleSousChapterChange = (value: string) => {
    setSelectedSousChapterId(value);
    if (onSousChapterSelect) {
      onSousChapterSelect(value);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="season-select">Saison</Label>
        <Select
          value={selectedSeasonId}
          onValueChange={handleSeasonChange}
          disabled={isLoadingSeasons}
        >
          <SelectTrigger id="season-select">
            <SelectValue placeholder="Sélectionnez une saison" />
          </SelectTrigger>
          <SelectContent>
            {seasonsData?.saisons?.map((season: Season) => (
              <SelectItem key={season.id_saison} value={season.id_saison}>
                {season.name_saison}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="chapter-select">Chapitre</Label>
        <Select
          value={selectedChapterId}
          onValueChange={handleChapterChange}
          disabled={isLoadingChapters || !selectedSeasonId}
        >
          <SelectTrigger id="chapter-select">
            <SelectValue placeholder="Sélectionnez un chapitre" />
          </SelectTrigger>
          <SelectContent>
            {filteredChapters.map((chapter: Chapter, index: number) => (
              <SelectItem key={chapter.id_chapter} value={chapter.id_chapter}>
                الحصة {index + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedChapterId && (
        <SousChapterSelect
          selectedChapterId={selectedChapterId}
          selectedSousChapterId={selectedSousChapterId}
          onSousChapterChange={handleSousChapterChange}
          disabled={!selectedChapterId}
        />
      )}
    </div>
  );
};
