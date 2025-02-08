
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
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
  
  const [requirements, setRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasBothCases: false
  });

  useEffect(() => {
    // Check password requirements
    setRequirements({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasBothCases: /[a-z]/.test(password) && /[A-Z]/.test(password)
    });
  }, [password]);

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

      <View style={styles.requirementsContainer}>
        <View style={styles.requirementRow}>
          <MaterialIcons 
            name={requirements.minLength ? "check-circle" : "radio-button-unchecked"} 
            size={18} 
            color={requirements.minLength ? "#b8658f" : "#666"} 
          />
          <Text style={[styles.requirementText, requirements.minLength && styles.metRequirement]}>
            At least 8 characters
          </Text>
        </View>
        
        <View style={styles.requirementRow}>
          <MaterialIcons 
            name={requirements.hasNumber ? "check-circle" : "radio-button-unchecked"} 
            size={18} 
            color={requirements.hasNumber ? "#b8658f" : "#666"} 
          />
          <Text style={[styles.requirementText, requirements.hasNumber && styles.metRequirement]}>
            At least 1 number
          </Text>
        </View>
        
        <View style={styles.requirementRow}>
          <MaterialIcons 
            name={requirements.hasBothCases ? "check-circle" : "radio-button-unchecked"} 
            size={18} 
            color={requirements.hasBothCases ? "#b8658f" : "#666"} 
          />
          <Text style={[styles.requirementText, requirements.hasBothCases && styles.metRequirement]}>
            Both upper and lower case letters
          </Text>
        </View>
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
  requirementsContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  metRequirement: {
    color: '#b8658f',
  },
};
