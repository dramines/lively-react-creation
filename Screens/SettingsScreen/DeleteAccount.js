import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import DeleteDrag from './DeleteDrag';
import { useTranslation } from 'react-i18next';

const DeleteAccount = ({ navigation }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.container}>
        <Button
          mode="outlined"
          icon="delete"
          style={styles.deleteButton}
          labelStyle={styles.deleteText}
          onPress={() => setShowDeleteModal(true)}
        >
          {t('DeleteAccount.delete_account')}
        </Button>
      </View>
      {showDeleteModal && (
        <DeleteDrag onClose={() => setShowDeleteModal(false)} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: '3%',
    paddingHorizontal: 20,
    gap: 10,
  },
  deleteButton: {
    borderWidth: 2,
    borderColor: '#893571',
    borderRadius: 10,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#893571',
  },
});

export default DeleteAccount;