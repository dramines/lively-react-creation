import { useState, useEffect, useRef } from 'react';
import { ReservationsService, type Reservation, type ReservationsResponse } from '../services/reservations.service';
import { 
  Search, 
  Calendar, 
  Filter, 
  QrCode, 
  ArrowUpDown, 
  ChevronDown, 
  X, 
  RefreshCw,
  AlertTriangle,
  Check
} from 'lucide-react';
import QrScanner from '../components/QrScanner';
import { useDebounce } from '../hooks/useDebounce';

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [highlightedOrderId, setHighlightedOrderId] = useState<string | null>(null);
  const [distinctEvents, setDistinctEvents] = useState<string[]>([]);
  const highlightTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Search and filter states
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: 'success' | 'error' | null;
    message: string;
  }>({ status: null, message: '' });

  // Debounce search input for real-time filtering
  const debouncedSearch = useDebounce(search, 300);
  
  // Fetch distinct events on component mount
  useEffect(() => {
    const getEventOptions = async () => {
      try {
        const events = await ReservationsService.getDistinctEvents();
        setDistinctEvents(events as string[]);
      } catch (err) {
        console.error('Failed to fetch event options:', err);
      }
    };
    
    getEventOptions();
  }, []);

  // Real-time filtering effect based on debounced search
  useEffect(() => {
    fetchReservations();
  }, [debouncedSearch, dateFrom, dateTo, selectedFilter, selectedEvent, currentPage, sortColumn, sortDirection]);

  // Reset highlight effect after a delay
  useEffect(() => {
    if (highlightedOrderId) {
      if (highlightTimeout.current) {
        clearTimeout(highlightTimeout.current);
      }
      
      highlightTimeout.current = setTimeout(() => {
        setHighlightedOrderId(null);
      }, 5000); // Clear highlight after 5 seconds
      
      return () => {
        if (highlightTimeout.current) {
          clearTimeout(highlightTimeout.current);
        }
      };
    }
  }, [highlightedOrderId]);

  const fetchReservations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare params for API call
      const params: Record<string, string | number> = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        sort: sortColumn,
        dir: sortDirection
      };
      
      // Add search term if exists
      if (debouncedSearch) {
        // Try to determine what the search might be (email, order_id, name)
        if (debouncedSearch.includes('@')) {
          params.email = debouncedSearch;
        } else if (/^\d+$/.test(debouncedSearch)) {
          params.order_id = debouncedSearch;
        } else {
          params.name = debouncedSearch; // This uses the OR condition in the API
        }
      }
      
      // Add date filters
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      
      // Add payment status filter
      if (selectedFilter !== 'all') {
        params.payment_status = selectedFilter;
      }
      
      // Add event filter
      if (selectedEvent !== 'all') {
        params.event_name = selectedEvent;
      }
      
      const response = await ReservationsService.getReservations(params);
      const { data, total } = response as ReservationsResponse;
      
      setReservations(data);
      setTotalCount(total);
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
      setError('Failed to load reservations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // New column, default to DESC
      setSortColumn(column);
      setSortDirection('DESC');
    }
  };

  const handleQrScanned = async (result: string) => {
    setShowScanner(false);
    
    try {
      // Check if the scanned reservation exists
      const reservation = await ReservationsService.getReservationByOrderId(result);
      
      if (reservation) {
        // Reservation found - set search to the order ID and highlight the row
        setSearch(result);
        setHighlightedOrderId(result);
        setScanResult({
          status: 'success',
          message: `Réservation trouvée: ${reservation.first_name} ${reservation.last_name} pour ${reservation.event_name}`
        });
      } else {
        // Reservation not found - show error and set search to the ID
        setSearch(result);
        setScanResult({
          status: 'error',
          message: `Aucune réservation trouvée avec l'ID: ${result}`
        });
      }
    } catch (error) {
      console.error('Error checking scanned reservation:', error);
      setScanResult({
        status: 'error',
        message: 'Erreur lors de la vérification de la réservation.'
      });
    }
  };

  const resetFilters = () => {
    setSearch('');
    setDateFrom('');
    setDateTo('');
    setSelectedFilter('all');
    setSelectedEvent('all');
    setCurrentPage(1);
    setSortColumn('created_at');
    setSortDirection('DESC');
  };

  const clearScanResult = () => {
    setScanResult({ status: null, message: '' });
  };

  const getRemainingPages = () => {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    return totalPages - currentPage;
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">Payé</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400">En attente</span>;
      case 'canceled':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">Annulé</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">{status}</span>;
    }
  };

  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Réservations</h1>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScanner(true)}
            className="btn-secondary gap-2"
          >
            <QrCode className="h-4 w-4" />
            <span className="hidden sm:inline">Scanner QR</span>
          </button>
          
          <button
            onClick={fetchReservations}
            className="btn-secondary p-2"
            title="Rafraîchir"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {scanResult.status && (
        <div className={`p-4 rounded-lg flex items-start gap-3 ${
          scanResult.status === 'success' 
            ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
            : 'bg-red-500/20 border border-red-500/30 text-red-400'
        }`}>
          {scanResult.status === 'success' 
            ? <Check className="h-5 w-5 flex-shrink-0" /> 
            : <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          }
          <div className="flex-1">
            <p>{scanResult.message}</p>
          </div>
          <button 
            onClick={clearScanResult}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr] gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Rechercher par e-mail, nom ou ID de commande..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 pr-4 w-full"
          />
        </div>
        
        <div className="relative">
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="input w-full appearance-none pr-8"
          >
            <option value="all">Tous les événements</option>
            {distinctEvents.map((event, index) => (
              <option key={index} value={event}>
                {event}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="btn-secondary gap-2 w-full"
          >
            <Filter className="h-4 w-4" />
            <span>Filtres avancés</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 w-72">
              <h3 className="font-semibold text-gray-200 mb-3 flex justify-between items-center">
                Filtres avancés
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Status de paiement</label>
                  <select 
                    value={selectedFilter} 
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="input w-full"
                  >
                    <option value="all">Tous</option>
                    <option value="paid">Payé</option>
                    <option value="pending">En attente</option>
                    <option value="canceled">Annulé</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Date de début</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="input pl-10 w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Date de fin</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="input pl-10 w-full"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-sm text-gray-400 hover:text-gold-400"
                  >
                    Réinitialiser
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="btn-primary py-1 px-3 text-sm"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800/50">
        <div className="responsive-table">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-700 text-gray-300">
              <tr>
                <th 
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => handleSort('order_id')}
                >
                  <div className="flex items-center">
                    ID Commande
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3">Client</th>
                <th 
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => handleSort('event_name')}
                >
                  <div className="flex items-center">
                    Événement
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => handleSort('places')}
                >
                  <div className="flex items-center">
                    Places
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => handleSort('total_price')}
                >
                  <div className="flex items-center">
                    Montant
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3">Statut</th>
                <th 
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    Date
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    <div className="flex justify-center items-center space-x-2">
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Chargement des réservations...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-red-400">
                    {error}
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    Aucune réservation trouvée
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr 
                    key={reservation.id} 
                    className={`border-t border-gray-700 transition-colors ${
                      highlightedOrderId === reservation.order_id 
                        ? 'bg-gold-700/30 animate-pulse' 
                        : 'hover:bg-gray-700/30'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-gold-400">
                      {reservation.order_id}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{reservation.first_name} {reservation.last_name}</div>
                        <div className="text-xs text-gray-400">{reservation.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {reservation.event_name}
                    </td>
                    <td className="px-4 py-3">
                      {reservation.places}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {parseFloat(reservation.total_price.toString()).toFixed(2)} TND
                    </td>
                    <td className="px-4 py-3">
                      {getPaymentStatusBadge(reservation.payment_status)}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(reservation.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!isLoading && !error && reservations.length > 0 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-700">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, totalCount)}
                  </span>{' '}
                  sur <span className="font-medium">{totalCount}</span> résultats
                </p>
              </div>
              <div>
                <nav className="flex items-center space-x-2" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn-secondary py-1 px-2 text-sm disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <span className="px-3 py-1 text-sm text-gold-400 bg-gray-700 rounded-md">
                    {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={getRemainingPages() <= 0}
                    className="btn-secondary py-1 px-2 text-sm disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </nav>
              </div>
            </div>
            <div className="flex sm:hidden justify-between w-full">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-secondary py-1 px-2 text-sm disabled:opacity-50"
              >
                Précédent
              </button>
              <span className="px-3 py-1 text-sm text-gold-400 bg-gray-700 rounded-md">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={getRemainingPages() <= 0}
                className="btn-secondary py-1 px-2 text-sm disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* QR Scanner Modal */}
      {showScanner && (
        <QrScanner 
          onClose={() => setShowScanner(false)} 
          onScan={handleQrScanned}
        />
      )}
    </div>
  );
};

export default Reservations;
