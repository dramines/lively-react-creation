import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface AgentStatusToggleProps {
  onStatusChange?: (isOnline: boolean) => void;
}

export const AgentStatusToggle: React.FC<AgentStatusToggleProps> = ({ onStatusChange }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAgentStatus();
  }, []);

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch('https://draminesaid.com/lucci/api/agent_status.php');
      const data = await response.json();
      if (data.success) {
        setIsOnline(data.status.is_online);
      }
    } catch (error) {
      console.error('Error fetching agent status:', error);
    }
  };

  const toggleStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://draminesaid.com/lucci/api/agent_status.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_online: !isOnline
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsOnline(!isOnline);
        onStatusChange?.(!isOnline);
        toast({
          title: !isOnline ? 'Vous êtes maintenant en ligne' : 'Vous êtes maintenant hors ligne',
          description: !isOnline ? 'Vous pouvez recevoir des messages clients' : 'Les clients ne peuvent plus vous contacter',
        });
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible de changer le statut',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur de connexion',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Statut Assistant
          <Badge variant={isOnline ? 'default' : 'secondary'}>
            {isOnline ? 'EN LIGNE' : 'HORS LIGNE'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3">
          <Switch
            checked={isOnline}
            onCheckedChange={toggleStatus}
            disabled={isLoading}
          />
          <span className="text-sm">
            {isOnline ? 'Disponible pour les clients' : 'Indisponible'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {isOnline 
            ? 'Les clients peuvent démarrer une conversation avec vous' 
            : 'Les nouveaux chats sont désactivés'
          }
        </p>
      </CardContent>
    </Card>
  );
};