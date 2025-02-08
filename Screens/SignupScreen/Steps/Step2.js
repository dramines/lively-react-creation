
import React from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';

const Step2 = ({ country, setCountry }) => {
  const { t } = useTranslation();
  
  return (
    <View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="public" size={24} color="#b8658f" />
        <Picker
          selectedValue={country}
          style={styles.input}
          onValueChange={(itemValue) => setCountry(itemValue)}
        >
          <Picker.Item label={t('SignupScreen.select_country')} value="" />
          <Picker.Item label={t('SignupScreen.united_states')} value="United States" />
          <Picker.Item label={t('SignupScreen.canada')} value="Canada" />
        </Picker>
      </View>
    </View>
  );
};

export default Step2;

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
