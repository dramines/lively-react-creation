import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/contexts/AuthContext';
import { UserCircle, Mail, User, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, updateUserInfo, logout, deleteUserAccount, loading, error, clearError } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    password: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;

    if (!formData.nom || !formData.prenom || !formData.email) {
      setLocalError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsEditing(false);
    setLocalError(null);
    clearError();

    try {
      const updateData: Partial<typeof formData> = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await updateUserInfo(user.id, updateData);
      Alert.alert('Succès', 'Profil mis à jour avec succès!');
    } catch (e: any) {
      console.error('Erreur lors de la mise à jour du profil:', e);
      setLocalError(error || 'Erreur lors de la mise à jour du profil.');
    }
  };

  const handleDeleteAccount = () => {
    if (!user) return;

    Alert.alert(
      "Supprimer le compte",
      "Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUserAccount(user.id);
            } catch (e: any) {
              console.error('Erreur lors de la suppression du compte:', e);
              setLocalError(error || 'Erreur lors de la suppression du compte.');
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e: any) {
      console.error('Erreur lors de la déconnexion:', e);
      setLocalError(error || 'Erreur lors de la déconnexion.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <UserCircle size={72} color="#fff" />
          <Text style={styles.headerTitle}>
            {user ? `${user.prenom} ${user.nom}` : 'Profil'}
          </Text>
          <Text style={styles.headerSubtitle}>{user?.email}</Text>
        </View>

        <View style={styles.content}>
          {localError ? <Text style={styles.errorText}>{localError}</Text> : null}

          <View style={styles.inputContainer}>
            <User size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              placeholderTextColor="#666"
              value={formData.prenom}
              editable={isEditing}
              onChangeText={(text) => setFormData({ ...formData, prenom: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <User size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nom"
              placeholderTextColor="#666"
              value={formData.nom}
              editable={isEditing}
              onChangeText={(text) => setFormData({ ...formData, nom: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Mail size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              value={formData.email}
              editable={isEditing}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nouveau mot de passe"
              placeholderTextColor="#666"
              secureTextEntry={!showNewPassword}
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              editable={isEditing}
            />
            {isEditing && (
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            )}
          </View>

          {!isEditing ? (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.actionButtonText}>Modifier le profil</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  setFormData({
                    nom: user?.nom || '',
                    prenom: user?.prenom || '',
                    email: user?.email || '',
                    password: '',
                  });
                  setLocalError(null);
                  clearError();
                }}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleUpdate}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteButtonText}>Supprimer le compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#0066FF',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff',
    marginTop: 10,
    fontFamily: 'Inter-Bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
    fontFamily: 'Inter-Regular',
  },
  content: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 15,
    fontFamily: 'Inter-Regular',
  },
  eyeIcon: {
    padding: 7,
  },
  actionButton: {
    backgroundColor: '#0066FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0066FF',
  },
  cancelButtonText: {
    color: '#0066FF',
    fontFamily: 'Inter-SemiBold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  logoutButton: {
    backgroundColor: '#FF9800',
  },
  logoutButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  deleteButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  errorText: {
    color: '#F44336',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});
