
import React from 'react';
import { View, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const Step1 = ({ firstname, setFirstname, lastname, setLastname, email, setEmail }) => {
  const { t } = useTranslation();
  
  return (
    <View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={24} color="#b8658f" />
        <TextInput
          placeholder={t('SignupScreen.first_name')}
          style={styles.input}
          value={firstname}
          onChangeText={setFirstname}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={24} color="#b8658f" />
        <TextInput
          placeholder={t('SignupScreen.last_name')}
          style={styles.input}
          value={lastname}
          onChangeText={setLastname}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="#b8658f" />
        <TextInput
          placeholder={t('SignupScreen.email')}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
    </View>
  );
};

export default Step1;

const styles = {
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
};
