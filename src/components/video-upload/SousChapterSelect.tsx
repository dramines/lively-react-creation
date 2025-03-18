
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SousChapter } from '@/types/chapters';

interface SousChapterSelectProps {
  selectedChapterId: string;
  selectedSousChapterId: string;
  onSousChapterChange: (value: string) => void;
  disabled?: boolean;
}

export const fetchSousChapters = async (chapterId: string): Promise<SousChapter[]> => {
  if (!chapterId) return [];
  
  try {
    const response = await axios.get(`https://plateform.draminesaid.com/app/get_souschapters.php?id_chapter=${chapterId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sous-chapters:', error);
    throw new Error('Failed to fetch sous-chapters');
  }
};

export const SousChapterSelect: React.FC<SousChapterSelectProps> = ({
  selectedChapterId,
  selectedSousChapterId,
  onSousChapterChange,
  disabled = false
}) => {
  const { data: sousChapters, isLoading } = useQuery({
    queryKey: ['sousChapters', selectedChapterId],
    queryFn: () => fetchSousChapters(selectedChapterId),
    enabled: !!selectedChapterId,
  });

  return (
    <div>
      <Label htmlFor="souschapter-select">Sous Chapitre</Label>
      <Select
        value={selectedSousChapterId}
        onValueChange={onSousChapterChange}
        disabled={disabled || isLoading || !selectedChapterId || !sousChapters?.length}
      >
        <SelectTrigger id="souschapter-select">
          <SelectValue placeholder="Sélectionnez un sous-chapitre" />
        </SelectTrigger>
        <SelectContent>
          {sousChapters?.map((sousChapter) => (
            <SelectItem 
              key={sousChapter.id_souschapter} 
              value={sousChapter.id_souschapter}
            >
              {sousChapter.name_souschapter || `Sous-chapitre ${sousChapter.id_souschapter}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
