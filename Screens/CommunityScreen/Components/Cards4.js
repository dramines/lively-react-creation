import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

export default function Cards4() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.actionGrid}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.gridItem}>
              <Icon name="gift" size={30} color="#893571" />
              <Text>{t('CommunityActions.Give')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem}>
              <Icon name="hand-heart" size={30} color="#893571" />
              <Text>{t('CommunityActions.Support')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.gridItem}>
              <Icon name="post" size={30} color="#893571" />
              <Text>{t('CommunityActions.Post')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridItem}>
              <Icon name="account-group" size={30} color="#893571" />
              <Text>{t('CommunityActions.Join')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  actionGrid: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  gridItem: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    width: '45%',
    elevation: 2,
  },
});
