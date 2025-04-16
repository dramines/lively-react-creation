import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  Switch,
  Image,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import { ArrowLeft, Camera, Image as ImageIcon } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { createProperty } from '../../services/propertyService';

/**
 * Écran de création de propriété
 * Permet aux propriétaires d'ajouter une nouvelle propriété
 */
const CreatePropertyScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  // Formulaire d'état local
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    price: '',
    type: 'office',
    status: 'available',
    property_type: 'coworking',
    description: '',
    workstations: 1,
    meeting_rooms: 0,
    area: 50,
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
  
  // Fix the image selector state definition to handle string values
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Gestion de la modification des champs du formulaire
  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fix the type issue with setting image
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

  // Fix the type issue with setting image
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

  // Fix the router reference error
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
      const result = await createProperty(dataToSubmit, selectedImage);
      
      Alert.alert(
        "Succès",
        "Propriété ajoutée avec succès",
        [
          { 
            text: "OK", 
            onPress: () => useRouter().back() 
          }
        ]
      );
    } catch (err) {
      console.error('Erreur lors de la création de la propriété:', err);
      setError('Erreur lors de la création de la propriété. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Ajouter une propriété</Text>
        
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
            <Text style={styles.imageButtonText}>Choisir une image</Text>
          </TouchableOpacity>
        </View>
        
        {/* Nom de la propriété */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nom de la propriété *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={formData.title}
            onChangeText={(text) => handleChange('title', text)}
          />
        </View>
        
        {/* Adresse */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Adresse *</Text>
          <TextInput
            style={styles.input}
            placeholder="Adresse"
            value={formData.address}
            onChangeText={(text) => handleChange('address', text)}
          />
        </View>
        
        {/* Prix */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Prix (€/mois) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Prix"
            keyboardType="numeric"
            value={formData.price}
            onChangeText={(text) => handleChange('price', text)}
          />
        </View>
        
        {/* Type de propriété */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Type de propriété *</Text>
          <View style={styles.radioButtons}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                formData.property_type === 'coworking' && styles.radioButtonSelected,
              ]}
              onPress={() => handleChange('property_type', 'coworking')}
            >
              <Text style={[
                styles.radioButtonText,
                formData.property_type === 'coworking' && styles.radioButtonTextSelected,
              ]}>Coworking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                formData.property_type === 'bureau_prive' && styles.radioButtonSelected,
              ]}
              onPress={() => handleChange('property_type', 'bureau_prive')}
            >
              <Text style={[
                styles.radioButtonText,
                formData.property_type === 'bureau_prive' && styles.radioButtonTextSelected,
              ]}>Bureau privé</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Description"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => handleChange('description', text)}
          />
        </View>
        
        {/* Nombre de postes */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre de postes</Text>
          
          {/* Fix the potential undefined values */}
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
        </View>
        
        {/* Nombre de salles de réunion */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre de salles de réunion</Text>
          
          {/* Fix the potential undefined values */}
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
        </View>
        
        {/* Surface en m² */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Surface (m²)</Text>
          
          {/* Fix the potential undefined values */}
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
        </View>
        
        {/* Commodités */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Commodités</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>WiFi</Text>
            <Switch
              value={formData.wifi}
              onValueChange={(value) => handleChange('wifi', value)}
              trackColor={{ false: '#767577', true: '#9b87f5' }}
              thumbColor={formData.wifi ? '#fff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Parking</Text>
            <Switch
              value={formData.parking}
              onValueChange={(value) => handleChange('parking', value)}
              trackColor={{ false: '#767577', true: '#9b87f5' }}
              thumbColor={formData.parking ? '#fff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Machine à café</Text>
            <Switch
              value={formData.coffee}
              onValueChange={(value) => handleChange('coffee', value)}
              trackColor={{ false: '#767577', true: '#9b87f5' }}
              thumbColor={formData.coffee ? '#fff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Réception</Text>
            <Switch
              value={formData.reception}
              onValueChange={(value) => handleChange('reception', value)}
              trackColor={{ false: '#767577', true: '#9b87f5' }}
              thumbColor={formData.reception ? '#fff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Cuisine</Text>
            <Switch
              value={formData.kitchen}
              onValueChange={(value) => handleChange('kitchen', value)}
              trackColor={{ false: '#767577', true: '#9b87f5' }}
              thumbColor={formData.kitchen ? '#fff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Sécurisé</Text>
            <Switch
              value={formData.secured}
              onValueChange={(value) => handleChange('secured', value)}
              trackColor={{ false: '#767577', true: '#9b87f5' }}
              thumbColor={formData.secured ? '#fff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Accessible PMR</Text>
            <Switch
              value={formData.accessible}
              onValueChange={(value) => handleChange('accessible', value)}
              trackColor={{ false: '#767577', true: '#9b87f5' }}
              thumbColor={formData.accessible ? '#fff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Imprimantes</Text>
            <Switch
              value={formData.printers}
              onValueChange={(value) => handleChange('printers', value)}
              trackColor={{ false: '#767577', true: '#9b87f5' }}
              thumbColor={formData.printers ? '#fff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Horaires flexibles</Text>
            <Switch
              value={formData.flexible_hours}
              onValueChange={(value) => handleChange('flexible_hours', value)}
              trackColor={{ false: '#767577', true: '#9b87f5' }}
              thumbColor={formData.flexible_hours ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
        
        {/* Bouton de soumission */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              Ajouter la propriété
            </Text>
          )}
        </TouchableOpacity>
        
        {/* Affichage des erreurs */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  textArea: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  radioButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  radioButtonSelected: {
    backgroundColor: '#9b87f5',
    borderColor: '#9b87f5',
  },
  radioButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  radioButtonTextSelected: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#9b87f5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  errorText: {
    color: '#C62828',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CreatePropertyScreen;
