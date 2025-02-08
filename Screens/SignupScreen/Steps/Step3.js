
import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const Step3 = ({ 
  password, 
  setPassword, 
  confirmPassword, 
  setConfirmPassword,
  isPasswordVisible,
  setIsPasswordVisible,
  isConfirmPasswordVisible,
  setIsConfirmPasswordVisible
}) => {
  const { t } = useTranslation();
  
  return (
    <View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color="#b8658f" />
        <TextInput
          placeholder={t('SignupScreen.password')}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <MaterialIcons
            name={isPasswordVisible ? 'visibility' : 'visibility-off'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color="#b8658f" />
        <TextInput
          placeholder={t('SignupScreen.confirm_password')}
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!isConfirmPasswordVisible}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          <MaterialIcons
            name={isConfirmPasswordVisible ? 'visibility' : 'visibility-off'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Step3;

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
