
import { CalendarIcon, Plus } from 'lucide-react';
import EventCalendar from '../Calendar/Calendar';

interface OverviewProps {
  events: any[];
  onAddProject: () => void;
}

const Overview = ({ events, onAddProject }: OverviewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Calendrier des événements</h2>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={onAddProject}
        >
          <Plus className="h-5 w-5" />
          Nouveau projet
        </button>
      </div>
      <div className="card">
        <EventCalendar events={events} />
      </div>
    </div>
  );
};

export default Overview;
