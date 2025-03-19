import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isSameMonth,
  isSameDay,
  isSameWeek,
  parseISO,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, CheckSquare, FileText, Eye, DollarSign } from 'lucide-react';
import Modal from '../Modal';
import { getFromLocalStorage } from '../../utils/localStorage';

type ViewType = 'day' | 'week' | 'month' | 'year';

interface CalendarProps {
  events?: Array<{
    id: string;
    title: string;
    date: Date;
    type: string;
  }>;
  onDateClick?: (date: Date) => void;
  onAddEvent?: (date: Date) => void;
  onAddTask?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events = [], onDateClick, onAddEvent, onAddTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedActionDate, setSelectedActionDate] = useState<Date | null>(null);
  const [dateDetails, setDateDetails] = useState<{
    events: any[];
    tasks: any[];
    invoices: any[];
    expenses: any[];
  }>({
    events: [],
    tasks: [],
    invoices: [],
    expenses: []
  });

  const onDateSelect = (day: Date) => {
    setSelectedDate(day);
    setSelectedActionDate(day);
    setShowActionModal(true);
    if (onDateClick) {
      onDateClick(day);
    }
  };

  const handleAddEvent = () => {
    if (selectedActionDate && onAddEvent) {
      onAddEvent(selectedActionDate);
      setShowActionModal(false);
    }
  };

  const handleAddTask = () => {
    if (selectedActionDate && onAddTask) {
      onAddTask(selectedActionDate);
      setShowActionModal(false);
    }
  };

  const handleViewDetails = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent date selection when clicking the details button
    
    // Get all data for the selected date
    const allEvents = getFromLocalStorage('evenements', []);
    const allTasks = getFromLocalStorage('tasks', []);
    const allInvoices = getFromLocalStorage('invoices', []);
    const allTransactions = getFromLocalStorage('transactions', []);

    const dateStr = format(date, 'yyyy-MM-dd');
    
    const filteredEvents = allEvents.filter((event: any) => 
      format(new Date(event.date), 'yyyy-MM-dd') === dateStr
    );
    
    const filteredTasks = allTasks.filter((task: any) => 
      format(new Date(task.dateEchéance), 'yyyy-MM-dd') === dateStr
    );
    
    const filteredInvoices = allInvoices.filter((invoice: any) => 
      format(new Date(invoice.dateFacture), 'yyyy-MM-dd') === dateStr
    );

    const filteredExpenses = allTransactions.filter((transaction: any) => 
      format(new Date(transaction.date), 'yyyy-MM-dd') === dateStr
    );

    setDateDetails({
      events: filteredEvents,
      tasks: filteredTasks,
      invoices: filteredInvoices,
      expenses: filteredExpenses
    });

    setShowDetailsModal(true);
  };

  const nextDate = () => {
    switch (view) {
      case 'year':
        setCurrentDate(addMonths(currentDate, 12));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const previousDate = () => {
    switch (view) {
      case 'year':
        setCurrentDate(subMonths(currentDate, 12));
        break;
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
    }
  };

  const renderHeader = () => {
    const dateFormat = {
      year: 'yyyy',
      month: 'MMMM yyyy',
      week: "'Semaine du' d MMMM yyyy",
      day: 'EEEE d MMMM yyyy'
    }[view];
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setView('day')}
            className={`btn-secondary whitespace-nowrap ${view === 'day' ? 'bg-gray-600' : ''}`}
          >
            Jour
          </button>
          <button
            onClick={() => setView('week')}
            className={`btn-secondary whitespace-nowrap ${view === 'week' ? 'bg-gray-600' : ''}`}
          >
            Semaine
          </button>
          <button
            onClick={() => setView('month')}
            className={`btn-secondary whitespace-nowrap ${view === 'month' ? 'bg-gray-600' : ''}`}
          >
            Mois
          </button>
          <button
            onClick={() => setView('year')}
            className={`btn-secondary whitespace-nowrap ${view === 'year' ? 'bg-gray-600' : ''}`}
          >
            Année
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={previousDate} className="calendar-nav-button">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold whitespace-nowrap">
            {format(currentDate, dateFormat, { locale: fr })}
          </h2>
          <button onClick={nextDate} className="calendar-nav-button">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = 'EEEE';
    const days = [];
    let startDate = startOfWeek(currentDate, { locale: fr });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="font-semibold text-center text-gray-400 text-xs sm:text-sm">
          {format(addDays(startDate, i), dateFormat, { locale: fr })}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: fr });
    const endDate = endOfWeek(monthEnd, { locale: fr });
    const dateFormat = 'd';
    const rows = [];

    let days = eachDayOfInterval({ start: startDate, end: endDate });
    let formattedDays = [];

    days.forEach((day) => {
      const dayEvents = events.filter((event) =>
        isSameDay(event.date, day)
      );

      formattedDays.push(
        <div
          key={day.toString()}
          className={`calendar-cell group${
            !isSameMonth(day, monthStart) ? ' text-gray-500' : ''
          }${isSameDay(day, new Date()) ? ' today' : ''} ${
            selectedDate && isSameDay(day, selectedDate) ? ' selected' : ''
          }`}
        >
          <div 
            className="calendar-date"
            onClick={() => onDateSelect(day)}
          >
            {format(day, dateFormat)}
          </div>
          {dayEvents.length > 0 && (
            <div className="mt-1 space-y-1 overflow-y-auto max-h-[60px]">
              {dayEvents.map((event, idx) => (
                <div key={event.id} className="text-xs px-1 py-0.5 rounded bg-gold-500/20 text-gold-300 truncate">
                  {event.title}
                </div>
              ))}
            </div>
          )}
          <div className="calendar-action-button-group">
            <button 
              className="calendar-action-button"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(day, e);
              }}
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm">Détails</span>
            </button>
            <button 
              className="calendar-action-button"
              onClick={(e) => {
                e.stopPropagation();
                onDateSelect(day);
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">Ajouter</span>
            </button>
          </div>
        </div>
      );
    });

    for (let i = 0; i < formattedDays.length; i += 7) {
      rows.push(
        <div key={i} className="grid grid-cols-7 gap-1">
          {formattedDays.slice(i, i + 7)}
        </div>
      );
    }

    return <div className="space-y-1">{rows}</div>;
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { locale: fr });
    const weekEnd = endOfWeek(currentDate, { locale: fr });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid grid-cols-1 gap-2">
        {days.map((day) => {
          const dayEvents = events.filter((event) =>
            isSameDay(event.date, day)
          );

          return (
            <div
              key={day.toString()}
              className={`p-4 rounded-lg bg-gray-800 hover:bg-gray-700/50 transition-colors ${
                isSameDay(day, new Date()) ? 'border border-gold-500' : ''
              }`}
              onClick={() => onDateSelect(day)}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm sm:text-base">
                  {format(day, 'EEEE d MMMM', { locale: fr })}
                </div>
                <div className="flex gap-2">
                  <button 
                    className="calendar-action-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(day, e);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    <span>Détails</span>
                  </button>
                  <button 
                    className="calendar-action-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDateSelect(day);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="mt-2 p-2 bg-gray-700 rounded text-sm"
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = events.filter((event) =>
      isSameDay(event.date, currentDate)
    );

    return (
      <div className="space-y-4">
        <div className="flex justify-end gap-2">
          <button 
            className="calendar-action-button"
            onClick={(e) => handleViewDetails(currentDate, e)}
          >
            <Eye className="h-4 w-4" />
            <span>Détails</span>
          </button>
          <button 
            className="calendar-action-button"
            onClick={() => onDateSelect(currentDate)}
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter</span>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {Array.from({ length: 24 }).map((_, hour) => {
            const hourEvents = dayEvents.filter(
              (event) => new Date(event.date).getHours() === hour
            );

            return (
              <div
                key={hour}
                className="flex items-start p-4 rounded-lg bg-gray-800 hover:bg-gray-700/50 transition-colors"
                onClick={() => onDateSelect(new Date(currentDate.setHours(hour)))}
              >
                <div className="w-16 font-semibold text-sm">
                  {format(new Date().setHours(hour), 'HH:mm')}
                </div>
                <div className="flex-1">
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-2 bg-gray-700 rounded mb-2 text-sm"
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const yearStart = startOfYear(currentDate);
    const yearEnd = endOfYear(currentDate);
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {months.map((month) => {
          const monthEvents = events.filter((event) =>
            isSameMonth(event.date, month)
          );

          return (
            <div
              key={month.toString()}
              className={`p-4 rounded-lg bg-gray-800 hover:bg-gray-700/50 transition-colors ${
                isSameMonth(month, new Date()) ? 'border border-gold-500' : ''
              }`}
              onClick={() => {
                setCurrentDate(month);
                setView('month');
              }}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">
                  {format(month, 'MMMM', { locale: fr })}
                </div>
                <div className="flex gap-2">
                  <button 
                    className="calendar-action-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(month, e);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    <span>Détails</span>
                  </button>
                  <button 
                    className="calendar-action-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDateSelect(month);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                {monthEvents.length} événements
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4">
      {renderHeader()}
      {view === 'month' && (
        <>
          {renderDays()}
          {renderMonthView()}
        </>
      )}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
      {view === 'year' && renderYearView()}

      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={`Actions pour le ${selectedActionDate ? format(selectedActionDate, 'dd MMMM yyyy', { locale: fr }) : ''}`}
      >
        <div className="space-y-4">
          <button
            className="w-full btn-primary flex items-center justify-center gap-2"
            onClick={handleAddEvent}
          >
            <CalendarIcon className="h-5 w-5" />
            Ajouter un événement
          </button>
          <button
            className="w-full btn-secondary flex items-center justify-center gap-2"
            onClick={handleAddTask}
          >
            <CheckSquare className="h-5 w-5" />
            Ajouter une tâche
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Détails du ${selectedActionDate ? format(selectedActionDate, 'dd MMMM yyyy', { locale: fr }) : ''}`}
      >
        <div className="space-y-6">
          {/* Events Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-gold-400" />
              Événements
            </h3>
            <div className="space-y-2">
              {dateDetails.events.length > 0 ? (
                dateDetails.events.map((event: any) => (
                  <div key={event.id} className="bg-gray-700/30 p-3 rounded-lg">
                    <div className="font-medium">{event.titre}</div>
                    <div className="text-sm text-gray-400 mt-1">{event.lieu}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Aucun événement pour cette date</p>
              )}
            </div>
          </div>

          {/* Tasks Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-gold-400" />
              Tâches
            </h3>
            <div className="space-y-2">
              {dateDetails.tasks.length > 0 ? (
                dateDetails.tasks.map((task: any) => (
                  <div key={task.id} className="bg-gray-700/30 p-3 rounded-lg">
                    <div className="font-medium">{task.titre}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Assigné à: {task.assignéÀ}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Aucune tâche pour cette date</p>
              )}
            </div>
          </div>

          {/* Invoices Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gold-400" />
              Factures
            </h3>
            <div className="space-y-2">
              {dateDetails.invoices.length > 0 ? (
                dateDetails.invoices.map((invoice: any) => (
                  <div key={invoice.id} className="bg-gray-700/30 p-3 rounded-lg">
                    <div className="font-medium">Facture #{invoice.numeroFacture}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Client: {invoice.clientName}
                    </div>
                    <div className="text-sm font-medium text-gold-400 mt-1">
                      {invoice.total.toLocaleString('fr-FR')} TND
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Aucune facture pour cette date</p>
              )}
            </div>
          </div>

          {/* Expenses Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gold-400" />
              Transactions
            </h3>
            <div className="space-y-2">
              {dateDetails.expenses.length > 0 ? (
                dateDetails.expenses.map((expense: any) => (
                  <div key={expense.id} className="bg-gray-700/30 p-3 rounded-lg">
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {expense.type === 'dépense' ? 'Dépense' : 'Revenu'}
                    </div>
                    <div className={`text-sm font-medium mt-1 ${
                      expense.type === 'dépense' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {expense.type === 'dépense' ? '-' : '+'}{expense.montant.toLocaleString('fr-FR')} TND
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Aucune transaction pour cette date</p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;