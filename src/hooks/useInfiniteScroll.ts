
import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollProps {
  fetchMore: () => void;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
}

export const useInfiniteScroll = ({
  fetchMore,
  hasMore,
  loading,
  threshold = 200
}: UseInfiniteScrollProps) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleScroll = useCallback(() => {
    // Éviter les appels multiples si déjà en cours de chargement
    if (loading || isFetching || !hasMore) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // Déclencher le chargement quand on approche du bas
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      console.log('Déclenchement du scroll infini');
      setIsFetching(true);
      setIsLoadingMore(true);
    }
  }, [loading, isFetching, hasMore, threshold]);

  useEffect(() => {
    // Ajouter l'écouteur d'événement de défilement
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    // Charger plus de contenu quand isFetching devient true
    if (!isFetching) return;
    
    console.log('Chargement de plus de produits...');
    fetchMore();
    
    // Réinitialiser après un délai plus long pour permettre l'animation
    setTimeout(() => {
      setIsFetching(false);
      setIsLoadingMore(false);
    }, 800);
  }, [isFetching, fetchMore]);

  return { isFetching, isLoadingMore };
};
