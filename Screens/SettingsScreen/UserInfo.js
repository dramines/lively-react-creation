import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';

const UserInfo = () => {
  const { t } = useTranslation();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  // User Information States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Address Information States
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  return (
    <View style={styles.pageContainer}>
      <TouchableOpacity style={styles.settingsItem} onPress={() => setIsAccountOpen(!isAccountOpen)}>
        <MaterialCommunityIcons name="account" size={24} color="#893571" />
        <Text style={styles.itemText}>{t('SettingsScreen.account_information')}</Text>
        <MaterialCommunityIcons name={isAccountOpen ? "chevron-up" : "chevron-down"} size={24} color="#666" />
      </TouchableOpacity>

      {isAccountOpen && (
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>{t('SettingsScreen.first_name')}</Text>
          <TextInput style={styles.input} placeholder={t('SettingsScreen.first_name')} value={firstName} onChangeText={setFirstName} />

          <Text style={styles.label}>{t('SettingsScreen.last_name')}</Text>
          <TextInput style={styles.input} placeholder={t('SettingsScreen.last_name')} value={lastName} onChangeText={setLastName} />

          <Text style={styles.label}>{t('SettingsScreen.email')}</Text>
          <TextInput style={styles.input} placeholder={t('SettingsScreen.email')} value={email} onChangeText={setEmail} keyboardType="email-address" />

          <Text style={styles.label}>{t('SettingsScreen.phone')}</Text>
          <TextInput style={styles.input} placeholder={t('SettingsScreen.phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>{t('SettingsScreen.save')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.settingsItem} onPress={() => setIsAddressOpen(!isAddressOpen)}>
        <MaterialCommunityIcons name="map-marker" size={24} color="#893571" />
        <Text style={styles.itemText}>{t('SettingsScreen.address_information')}</Text>
        <MaterialCommunityIcons name={isAddressOpen ? "chevron-up" : "chevron-down"} size={24} color="#666" />
      </TouchableOpacity>

      {isAddressOpen && (
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>{t('SettingsScreen.country')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={country}
              onValueChange={(itemValue) => setCountry(itemValue)}
              style={styles.picker}
              dropdownIconColor="#893571"
            >
              <Picker.Item label={t('SettingsScreen.select_country')} value="" />
              <Picker.Item label="United States" value="USA" />
              <Picker.Item label="Germany" value="Germany" />
              <Picker.Item label="France" value="France" />
              <Picker.Item label="United Kingdom" value="UK" />
            </Picker>
          </View>

          <Text style={styles.label}>{t('SettingsScreen.address')}</Text>
          <TextInput style={styles.input} placeholder={t('SettingsScreen.address')} value={address} onChangeText={setAddress} />

          <Text style={styles.label}>{t('SettingsScreen.postal_code')}</Text>
          <TextInput style={styles.input} placeholder={t('SettingsScreen.postal_code')} value={postalCode} onChangeText={setPostalCode} keyboardType="numeric" />

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>{t('SettingsScreen.save')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#893571',
    textAlign: 'center',
    marginBottom: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#893571',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserInfo;
