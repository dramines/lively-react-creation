import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const FAQSection = () => {
  const [faqsVisible, setFaqsVisible] = useState(false);
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('FAQ.reset_password'),
      answer: t('FAQ.reset_password_answer'),
    },
    {
      question: t('FAQ.profile_picture'),
      answer: t('FAQ.profile_picture_answer'),
    },
    {
      question: t('FAQ.dark_mode'),
      answer: t('FAQ.dark_mode_answer'),
    },
  ];

  return (
    <View style={styles.pageContainer}>
      <TouchableOpacity
        style={styles.settingsItem}
        onPress={() => setFaqsVisible(!faqsVisible)}
      >
        <View style={styles.itemIcon}>
          <MaterialCommunityIcons name="help-circle-outline" size={24} color="#893571" />
        </View>
        <Text style={styles.itemText}>{t('FAQ.title')}</Text>
        <MaterialCommunityIcons
          name={faqsVisible ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#666"
        />
      </TouchableOpacity>

      {faqsVisible && (
        <View style={styles.faqList}>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqContainer}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
              {index < faqs.length - 1 && <Divider style={styles.faqDivider} />}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    marginTop: '-10%',
    padding: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    marginVertical: 4,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemIcon: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  faqList: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  faqContainer: {
    marginVertical: 8,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  faqDivider: {
    marginVertical: 8,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
});

export default FAQSection;