import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import styles from './styles/Step1Style';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = '';
const MAX_IMAGES = 4;
const MAX_TITLE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 500;

const Step1 = ({ navigation }) => {
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [containerType, setContainerType] = useState('grams');
    const [activeInput, setActiveInput] = useState(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        requestPermissions();
        loadSavedData();
    }, []);

    const requestPermissions = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload images!');
            }
        }
    };

    const saveData = async (newData) => {
        try {
            setLoading(true);
            const dataToSave = {
                images: newData.images || images,
                title: newData.title || title,
                description: newData.description || description,
                quantity: newData.quantity || quantity,
                containerType: newData.containerType || containerType,
            };
            await AsyncStorage.setItem('step1data', JSON.stringify(dataToSave));
            console.log('Data saved successfully:', dataToSave);
        } catch (error) {
            console.error('Error saving data:', error);
            Alert.alert('Error', 'Failed to save data');
        } finally {
            setLoading(false);
        }
    };

    const loadSavedData = async () => {
        try {
            setLoading(true);
            const savedData = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setImages(parsedData.images || []);
                setTitle(parsedData.title || '');
                setDescription(parsedData.description || '');
                setQuantity(parsedData.quantity || '');
                setContainerType(parsedData.containerType || 'grams');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            Alert.alert('Error', 'Failed to load saved data');
        } finally {
            setLoading(false);
        }
    };

    const handleTitleChange = (text) => {
        if (text.length <= MAX_TITLE_LENGTH) {
            setTitle(text);
            saveData({ title: text });
        }
    };

    const handleDescriptionChange = (text) => {
        if (text.length <= MAX_DESCRIPTION_LENGTH) {
            setDescription(text);
            saveData({ description: text });
        }
    };

    const handleQuantityChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setQuantity(numericValue);
        saveData({ quantity: numericValue });
    };

    const handleContainerTypeChange = (value) => {
        setContainerType(value);
        saveData({ containerType: value });
    };

    const pickImage = async () => {
        if (images.length >= MAX_IMAGES) {
            Alert.alert('Limit Reached', `Maximum ${MAX_IMAGES} images allowed`);
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                allowsMultipleSelection: false,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                const newImages = [...images, result.assets[0].uri];
                setImages(newImages);
                saveData({ images: newImages });
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
        saveData({ images: newImages });
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView style={styles.container}>
                <Text style={styles.sectionTitle}>{t('Step1.AddPhotos')}</Text>
                <Text style={styles.sectionSubtitle}>
                    {t('Step1.UploadUpTo')}
                </Text>
                
                <ScrollView 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.imageCarousel}
                    contentContainerStyle={styles.imageCarouselContent}
                >
                    {images.map((image, index) => (
                        <View key={index} style={styles.imageBox}>
                            <Image source={{ uri: image }} style={styles.uploadedImage} resizeMode="cover" />
                            <TouchableOpacity
                                style={styles.removeIconContainer}
                                onPress={() => removeImage(index)}
                            >
                                <Ionicons name="close-circle" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    {images.length < MAX_IMAGES && (
                        <TouchableOpacity style={[styles.imageBox, styles.addImageBox]} onPress={pickImage}>
                            <MaterialIcons name="add-photo-alternate" size={32} color="#893571" />
                            <Text style={styles.uploadText}>{t('Step1.AddPhoto')}</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>

                <View style={styles.inputSection}>
                    <View style={[styles.inputContainer, activeInput === 'title' && styles.inputContainerActive]}>
                        <MaterialIcons name="title" size={24} color={activeInput === 'title' ? '#893571' : '#666'} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('Step1.WhatFoodAreYouSharing')}
                            placeholderTextColor="#999"
                            value={title}
                            onChangeText={handleTitleChange}
                            onFocus={() => setActiveInput('title')}
                            onBlur={() => setActiveInput(null)}
                            maxLength={MAX_TITLE_LENGTH}
                        />
                        <Text style={styles.charCount}>{title.length}/{MAX_TITLE_LENGTH}</Text>
                    </View>

                    <View style={[styles.inputContainer, styles.descriptionContainer, activeInput === 'description' && styles.inputContainerActive]}>
                        <MaterialIcons name="description" size={24} color={activeInput === 'description' ? '#893571' : '#666'} />
                        <TextInput
                            style={[styles.input, styles.descriptionInput]}
                            placeholder={t('Step1.Describeyourfood')} 
                            placeholderTextColor="#999"
                            multiline
                            value={description}
                            onChangeText={handleDescriptionChange}
                            onFocus={() => setActiveInput('description')}
                            onBlur={() => setActiveInput(null)}
                            maxLength={MAX_DESCRIPTION_LENGTH}
                        />
                        <Text style={[styles.charCount, styles.descriptionCharCount]}>
                            {description.length}/{MAX_DESCRIPTION_LENGTH}
                        </Text>
                    </View>

                    <View style={[styles.inputContainer, activeInput === 'quantity' && styles.inputContainerActive]}>
                        <MaterialIcons name="format-list-numbered" size={24} color={activeInput === 'quantity' ? '#893571' : '#666'} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('Step1.Enterquantity')}
                            placeholderTextColor="#999"
                            value={quantity}
                            onChangeText={handleQuantityChange}
                            onFocus={() => setActiveInput('quantity')}
                            onBlur={() => setActiveInput(null)}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={[styles.inputContainer, styles.pickerContainer]}>
                        <MaterialIcons name="category" size={24} color="#666" />
                        <Picker
                            selectedValue={containerType}
                            style={styles.picker}
                            onValueChange={handleContainerTypeChange}
                        >
                          <Picker.Item label={t('Step1.grams')} value="grams" />
                          <Picker.Item label={t('Step1.kg')} value="kg" />
                          <Picker.Item label={t('Step1.container')} value="container" />
                          <Picker.Item label={t('Step1.box')} value="box" />
                          <Picker.Item label={t('Step1.meal')} value="meal" />
                          <Picker.Item label={t('Step1.plate')} value="plate" />
                        </Picker>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Step1;
