
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import StatisticsOverview from '@/components/admin/StatisticsOverview';

const AdminStatistics = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900">Statistiques et Analyses</h1>
          <p className="text-gray-600">Analyses détaillées et statistiques des visiteurs</p>
        </div>
        <StatisticsOverview />
      </div>
    </AdminLayout>
  );
};

export default AdminStatistics;
