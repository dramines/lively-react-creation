
import { CalendarIcon, Clock, DollarSign } from 'lucide-react';

interface ArtistStatsProps {
  evenementsPassés: number;
}

const ArtistStats = ({ evenementsPassés }: ArtistStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-6 w-6 text-gold-400" />
          <div>
            <h3 className="font-semibold">Événements</h3>
            <p className="text-2xl font-bold text-white">{evenementsPassés || 0}</p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-gold-400" />
          <div>
            <h3 className="font-semibold">Heures de répétition</h3>
            <p className="text-2xl font-bold text-white">0h</p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-gold-400" />
          <div>
            <h3 className="font-semibold">Revenu total</h3>
            <p className="text-2xl font-bold text-white">0 TND</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistStats;
