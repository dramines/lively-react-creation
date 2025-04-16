import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Switch,
  Slider,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Image as ImageIcon } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { getPropertyById, updateProperty } from '../../services/propertyService';

interface EditPropertyScreenProps {
  propertyId: string;
}

/**
 * Écran de modification d'une propriété
 * Permet aux propriétaires de modifier les informations d'une propriété existante
 */
const EditPropertyScreen: React.FC<EditPropertyScreenProps> = ({ propertyId }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    price: 0,
    type: 'location',
    status: 'available',
    property_type: 'bureau',
    description: '',
    workstations: 0,
    meeting_rooms: 0,
    area: 0,
    wifi: false,
    parking: false,
    coffee: false,
    reception: false,
    kitchen: false,
    secured: false,
    accessible: false,
    printers: false,
    flexible_hours: false,
    country: 'France',
    region: 'Île-de-France',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const property = await getPropertyById(propertyId);
        
        if (property) {
          setFormData({
            title: property.title || '',
            address: property.address || '',
            price: property.price || 0,
            type: property.type || 'location',
            status: property.status || 'available',
            property_type: property.property_type || 'bureau',
            description: property.description || '',
            workstations: property.workstations || 0,
            meeting_rooms: property.meeting_rooms || 0,
            area: property.area || 0,
            wifi: property.wifi || false,
            parking: property.parking || false,
            coffee: property.coffee || false,
            reception: property.reception || false,
            kitchen: property.kitchen || false,
            secured: property.secured || false,
            accessible: property.accessible || false,
            printers: property.printers || false,
            flexible_hours: property.flexible_hours || false,
            country: property.country || 'France',
            region: property.region || 'Île-de-France',
          });
          setSelectedImage(property.image_url || null);
        } else {
          setError('Propriété non trouvée');
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de la propriété:", err);
        setError('Impossible de charger les détails de la propriété');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [propertyId]);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTakePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert("Permission refusée", "Nous avons besoin de l'accès à la caméra pour prendre des photos.");
        return;
      }
      
      // Take a photo
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert("Erreur", "Impossible de prendre une photo.");
    }
  };

  const handleLibraryPick = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert("Permission refusée", "Nous avons besoin de l'accès à la galerie pour sélectionner des images.");
        return;
      }
      
      // Pick an image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image:', error);
      Alert.alert("Erreur", "Impossible de sélectionner une image.");
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');
      
      // Vérifier que tous les champs obligatoires sont remplis
      if (!formData.title || !formData.address || !formData.price || !formData.property_type) {
        setError('Veuillez remplir tous les champs obligatoires.');
        setSubmitting(false);
        return;
      }
      
      // Ajouter l'ID du propriétaire aux données du formulaire
      const dataToSubmit = {
        ...formData,
        owner_id: user?.id,
      };
      
      // Envoyer les données et l'image si sélectionnée
      const result = await updateProperty(propertyId, dataToSubmit, selectedImage);
      
      Alert.alert(
        "Succès",
        "Propriété modifiée avec succès",
        [
          { 
            text: "OK", 
            onPress: () => router.back() 
          }
        ]
      );
    } catch (err) {
      console.error('Erreur lors de la modification de la propriété:', err);
      setError('Erreur lors de la modification de la propriété. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9b87f5" />
        <Text style={styles.loadingText}>Chargement des détails...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#333" />
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Modifier la propriété</Text>
        
        {/* Affichage de l'image sélectionnée */}
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        )}
        
        {/* Boutons de sélection d'image */}
        <View style={styles.imageButtons}>
          <TouchableOpacity style={styles.imageButton} onPress={handleTakePhoto}>
            <Camera size={20} color="#666" />
            <Text style={styles.imageButtonText}>Prendre une photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={handleLibraryPick}>
            <ImageIcon size={20} color="#666" />
            <Text style={styles.imageButtonText}>Choisir de la galerie</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Titre *</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(text) => handleChange('title', text)}
          placeholder="Nom de la propriété"
        />

        <Text style={styles.label}>Adresse *</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(text) => handleChange('address', text)}
          placeholder="Adresse de la propriété"
        />

        <Text style={styles.label}>Prix *</Text>
        <TextInput
          style={styles.input}
          value={formData.price.toString()}
          onChangeText={(text) => handleChange('price', parseFloat(text))}
          placeholder="Prix par mois"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Type *</Text>
        <View style={styles.radioButtons}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.type === 'location' && styles.radioButtonActive,
            ]}
            onPress={() => handleChange('type', 'location')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.type === 'location' && styles.radioButtonTextActive,
            ]}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.type === 'coworking' && styles.radioButtonActive,
            ]}
            onPress={() => handleChange('type', 'coworking')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.type === 'coworking' && styles.radioButtonTextActive,
            ]}>Coworking</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Statut *</Text>
        <View style={styles.radioButtons}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.status === 'available' && styles.radioButtonActive,
            ]}
            onPress={() => handleChange('status', 'available')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.status === 'available' && styles.radioButtonTextActive,
            ]}>Disponible</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.status === 'maintenance' && styles.radioButtonActive,
            ]}
            onPress={() => handleChange('status', 'maintenance')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.status === 'maintenance' && styles.radioButtonTextActive,
            ]}>Maintenance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.status === 'booked' && styles.radioButtonActive,
            ]}
            onPress={() => handleChange('status', 'booked')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.status === 'booked' && styles.radioButtonTextActive,
            ]}>Réservé</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Type de propriété *</Text>
        <View style={styles.radioButtons}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.property_type === 'bureau' && styles.radioButtonActive,
            ]}
            onPress={() => handleChange('property_type', 'bureau')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.property_type === 'bureau' && styles.radioButtonTextActive,
            ]}>Bureau</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.property_type === 'immeuble' && styles.radioButtonActive,
            ]}
            onPress={() => handleChange('property_type', 'immeuble')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.property_type === 'immeuble' && styles.radioButtonTextActive,
            ]}>Immeuble</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioButton,
              formData.property_type === 'commerce' && styles.radioButtonActive,
            ]}
            onPress={() => handleChange('property_type', 'commerce')}
          >
            <Text style={[
              styles.radioButtonText,
              formData.property_type === 'commerce' && styles.radioButtonTextActive,
            ]}>Commerce</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => handleChange('description', text)}
          placeholder="Description de la propriété"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.sliderLabel}>Nombre de postes</Text>
        <Text style={styles.sliderValue}>
          {formData.workstations !== undefined ? formData.workstations : 0} postes
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={50}
          step={1}
          value={formData.workstations !== undefined ? formData.workstations : 0}
          onValueChange={(value) => handleChange('workstations', value)}
          minimumTrackTintColor="#9b87f5"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#9b87f5"
        />

        <Text style={styles.sliderLabel}>Nombre de salles de réunion</Text>
        <Text style={styles.sliderValue}>
          {formData.meeting_rooms !== undefined ? formData.meeting_rooms : 0} salles
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={20}
          step={1}
          value={formData.meeting_rooms !== undefined ? formData.meeting_rooms : 0}
          onValueChange={(value) => handleChange('meeting_rooms', value)}
          minimumTrackTintColor="#9b87f5"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#9b87f5"
        />

        <Text style={styles.sliderLabel}>Superficie (m²)</Text>
        <Text style={styles.sliderValue}>
          {formData.area !== undefined ? formData.area : 0} m²
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={10}
          maximumValue={1000}
          step={5}
          value={formData.area !== undefined ? formData.area : 0}
          onValueChange={(value) => handleChange('area', value)}
          minimumTrackTintColor="#9b87f5"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#9b87f5"
        />

        <Text style={styles.label}>Commodités</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>WiFi</Text>
          <Switch
            value={formData.wifi}
            onValueChange={(value) => handleChange('wifi', value)}
            trackColor={{ false: '#767577', true: '#9b87f5' }}
            thumbColor={formData.wifi ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Parking</Text>
          <Switch
            value={formData.parking}
            onValueChange={(value) => handleChange('parking', value)}
            trackColor={{ false: '#767577', true: '#9b87f5' }}
            thumbColor={formData.parking ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Machine à café</Text>
          <Switch
            value={formData.coffee}
            onValueChange={(value) => handleChange('coffee', value)}
            trackColor={{ false: '#767577', true: '#9b87f5' }}
            thumbColor={formData.coffee ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Réception</Text>
          <Switch
            value={formData.reception}
            onValueChange={(value) => handleChange('reception', value)}
            trackColor={{ false: '#767577', true: '#9b87f5' }}
            thumbColor={formData.reception ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Cuisine</Text>
          <Switch
            value={formData.kitchen}
            onValueChange={(value) => handleChange('kitchen', value)}
            trackColor={{ false: '#767577', true: '#9b87f5' }}
            thumbColor={formData.kitchen ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Sécurisé</Text>
          <Switch
            value={formData.secured}
            onValueChange={(value) => handleChange('secured', value)}
            trackColor={{ false: '#767577', true: '#9b87f5' }}
            thumbColor={formData.secured ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Accessible PMR</Text>
          <Switch
            value={formData.accessible}
            onValueChange={(value) => handleChange('accessible', value)}
            trackColor={{ false: '#767577', true: '#9b87f5' }}
            thumbColor={formData.accessible ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Imprimantes</Text>
          <Switch
            value={formData.printers}
            onValueChange={(value) => handleChange('printers', value)}
            trackColor={{ false: '#767577', true: '#9b87f5' }}
            thumbColor={formData.printers ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Horaires flexibles</Text>
          <Switch
            value={formData.flexible_hours}
            onValueChange={(value) => handleChange('flexible_hours', value)}
            trackColor={{ false: '#767577', true: '#9b87f5' }}
            thumbColor={formData.flexible_hours ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Modification...' : 'Modifier la propriété'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginTop: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  radioButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    marginBottom: 10,
  },
  radioButton: {
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  radioButtonActive: {
    backgroundColor: '#9b87f5',
    borderColor: '#9b87f5',
  },
  radioButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  radioButtonTextActive: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  sliderLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginTop: 20,
  },
  sliderValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  submitButton: {
    backgroundColor: '#9b87f5',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  imageButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
});

export default EditPropertyScreen;
