
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
  threshold = 800 // Increased default threshold
}: UseInfiniteScrollProps) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleScroll = useCallback(() => {
    // Éviter les appels multiples si déjà en cours de chargement
    if (loading || isFetching || !hasMore) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // Déclencher le chargement plus tôt avec un seuil plus élevé
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      console.log('Déclenchement du scroll infini');
      setIsFetching(true);
      setIsLoadingMore(true);
    }
  }, [loading, isFetching, hasMore, threshold]);

  useEffect(() => {
    // Ajouter l'écouteur d'événement de défilement avec throttling
    let timeoutId: NodeJS.Timeout;
    
    const throttledScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100); // Throttle for better performance
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      clearTimeout(timeoutId);
    };
  }, [handleScroll]);

  useEffect(() => {
    // Charger plus de contenu quand isFetching devient true
    if (!isFetching) return;
    
    console.log('Chargement de plus de produits...');
    fetchMore();
    
    // Réinitialiser après un délai plus court pour une réactivité améliorée
    setTimeout(() => {
      setIsFetching(false);
      setIsLoadingMore(false);
    }, 500); // Reduced from 800ms to 500ms
  }, [isFetching, fetchMore]);

  return { isFetching, isLoadingMore };
};
