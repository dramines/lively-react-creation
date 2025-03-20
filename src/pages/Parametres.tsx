
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, LogOut, Server, Info, Plus, Eye, EyeOff, Copy, Trash, AlertCircle, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { PasswordsService, UsersService, AuthService } from '../services';

interface PasswordEntry {
  id: string;
  website: string;
  email: string;
  password: string;
}

const Parametres = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [showPasswordId, setShowPasswordId] = useState<string | null>(null);
  const [isNewPasswordModalOpen, setIsNewPasswordModalOpen] = useState(false);
  const [newPasswordEntry, setNewPasswordEntry] = useState({
    website: '',
    email: '',
    password: ''
  });
  const [showResetDataModal, setShowResetDataModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = AuthService.getCurrentUser();
      if (user) {
        // Load user info
        const userData = await UsersService.getUser(user.id);
        setUserInfo({
          email: userData.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          name: userData.full_name || '',
          phone: userData.phone || ''
        });
        
        // Load passwords
        await loadPasswords(user.id);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load user data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadPasswords = async (userId: string) => {
    try {
      const passwordsData = await PasswordsService.getAllPasswords(userId);
      if (Array.isArray(passwordsData)) {
        setPasswords(passwordsData.map((pwd: any) => ({
          id: pwd.id || pwd.id_password || '',
          website: pwd.site_name || '',
          email: pwd.username || '',
          password: pwd.password || ''
        })));
      } else {
        setPasswords([]);
      }
    } catch (err) {
      console.error('Error loading passwords:', err);
      setError('Failed to load passwords. Please try again later.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const user = AuthService.getCurrentUser();
      if (user) {
        // Update user info
        const userData = {
          id: user.id,
          email: userInfo.email,
          full_name: userInfo.name,
          phone: userInfo.phone
        };
        
        // If password change is requested
        if (userInfo.currentPassword && userInfo.newPassword && userInfo.confirmPassword) {
          if (userInfo.newPassword !== userInfo.confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            setIsLoading(false);
            return;
          }
          
          // Add password update fields
          Object.assign(userData, {
            current_password: userInfo.currentPassword,
            new_password: userInfo.newPassword
          });
        }
        
        await UsersService.updateUser(userData);
        setSuccessMessage('Profil mis à jour avec succès.');
        
        // Clear password fields
        setUserInfo({
          ...userInfo,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const handleAddPassword = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }
      
      if (!newPasswordEntry.website || !newPasswordEntry.email || !newPasswordEntry.password) {
        setError('Veuillez remplir tous les champs');
        setIsLoading(false);
        return;
      }
      
      const passwordData = {
        user_id: user.id,
        site_name: newPasswordEntry.website,
        site_url: '',
        username: newPasswordEntry.email,
        password: newPasswordEntry.password,
        notes: ''
      };
      
      await PasswordsService.createPassword(passwordData);
      
      // Reload passwords
      await loadPasswords(user.id);
      
      // Reset form and close modal
      setNewPasswordEntry({ website: '', email: '', password: '' });
      setIsNewPasswordModalOpen(false);
      setSuccessMessage('Mot de passe ajouté avec succès.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error adding password:', err);
      setError('Failed to add password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    setSuccessMessage('Mot de passe copié dans le presse-papier.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeletePassword = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }
      
      await PasswordsService.deletePassword(id);
      
      // Update local state
      setPasswords(passwords.filter(p => p.id !== id));
      setSuccessMessage('Mot de passe supprimé avec succès.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting password:', err);
      setError('Failed to delete password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetData = () => {
    setShowResetDataModal(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
        >
          <Check className="h-5 w-5" />
          <span>{successMessage}</span>
        </motion.div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
        >
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </motion.div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Paramètres</h1>
        <button 
          onClick={handleLogout}
          className="btn-secondary flex items-center gap-2 text-red-400 hover:text-red-300"
          disabled={isLoading}
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Informations personnelles</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  className="input w-full"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="input w-full"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  className="input w-full"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Changer le mot de passe</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  className="input w-full"
                  value={userInfo.currentPassword}
                  onChange={(e) => setUserInfo({ ...userInfo, currentPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  className="input w-full"
                  value={userInfo.newPassword}
                  onChange={(e) => setUserInfo({ ...userInfo, newPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  className="input w-full"
                  value={userInfo.confirmPassword}
                  onChange={(e) => setUserInfo({ ...userInfo, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Gestionnaire de mots de passe</h2>
              <button
                type="button"
                onClick={() => setIsNewPasswordModalOpen(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Ajouter
              </button>
            </div>
            <div className="space-y-4">
              {passwords.length > 0 ? (
                passwords.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-700/30 rounded-lg gap-4"
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium">{entry.website}</h3>
                      <p className="text-sm text-gray-400">{entry.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 sm:flex-none">
                        <input
                          type={showPasswordId === entry.id ? 'text' : 'password'}
                          value={entry.password}
                          readOnly
                          className="input pr-20"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopyPassword(entry.password)}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowPasswordId(
                              showPasswordId === entry.id ? null : entry.id
                            )}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            {showPasswordId === entry.id ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePassword(entry.id)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">Aucun mot de passe enregistré</p>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Informations système</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Server className="h-5 w-5" />
                <span>Version: 1.0.0</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Info className="h-5 w-5" />
                <span>Environnement: Production</span>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowResetDataModal(true)}
                  className="btn-secondary text-red-400 hover:text-red-300"
                >
                  Réinitialiser toutes les données
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Save className="h-5 w-5" />
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </motion.div>

      <Modal
        isOpen={isNewPasswordModalOpen}
        onClose={() => setIsNewPasswordModalOpen(false)}
        title="Ajouter un mot de passe"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Site web
            </label>
            <input
              type="text"
              className="input w-full"
              placeholder="example.com"
              value={newPasswordEntry.website}
              onChange={(e) => setNewPasswordEntry({ ...newPasswordEntry, website: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              className="input w-full"
              placeholder="email@example.com"
              value={newPasswordEntry.email}
              onChange={(e) => setNewPasswordEntry({ ...newPasswordEntry, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              className="input w-full"
              placeholder="••••••••"
              value={newPasswordEntry.password}
              onChange={(e) => setNewPasswordEntry({ ...newPasswordEntry, password: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="btn-secondary"
              onClick={() => setIsNewPasswordModalOpen(false)}
            >
              Annuler
            </button>
            <button
              className="btn-primary flex items-center gap-2"
              onClick={handleAddPassword}
            >
              <Save className="h-4 w-4" />
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showResetDataModal}
        onClose={() => setShowResetDataModal(false)}
        title="Réinitialiser les données"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action ne peut pas être annulée.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="btn-secondary"
              onClick={() => setShowResetDataModal(false)}
            >
              Annuler
            </button>
            <button
              className="btn-secondary text-red-400 hover:text-red-300"
              onClick={handleResetData}
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Parametres;