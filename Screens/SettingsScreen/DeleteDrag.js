import React, { useRef, useEffect } from 'react';
import {
  Animated,
  PanResponder,
  View,
  StyleSheet,
  Keyboard,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { Colors, Typography } from '../../common/design';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAGGABLE_HEIGHT = SCREEN_HEIGHT * 0.3;

const DeleteDrag = ({ onClose }) => {
  const translateY = useRef(new Animated.Value(DRAGGABLE_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: false,
        damping: 20,
        stiffness: 90
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      })
    ]).start();

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: false,
        damping: 20,
        stiffness: 90
      }).start();
    });

    return () => {
      keyboardDidShowListener.remove();
    };
  }, [translateY]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: DRAGGABLE_HEIGHT,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      })
    ]).start(() => onClose());
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "This action cannot be undone. Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            // Handle delete logic here
            handleClose();
          },
          style: "destructive"
        }
      ]
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;
        if (dy > DRAGGABLE_HEIGHT * 0.3 || vy > 0.5) {
          handleClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: false,
            damping: 20,
            stiffness: 90
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
      <TouchableOpacity style={styles.overlayTouch} onPress={handleClose} activeOpacity={1}>
        <Animated.View
          style={[
            styles.draggableContent,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handleBarContainer}>
            <View style={styles.handleBar} />
          </View>
          
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Delete Account</Text>
            <Text style={styles.description}>
            This action cannot be undone and all your data will be permanently deleted.
            </Text>
            
            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={handleDelete}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmText}>Delete My Account</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleClose}
              activeOpacity={0.6}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '-7%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 999998,
    elevation: 999998,
  },
  overlayTouch: {
    flex: 1,
  },
  draggableContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: DRAGGABLE_HEIGHT,
    backgroundColor: '#ffffff',
    zIndex: 999999,
    elevation: 999999,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOffset: {
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
  },
  handleBarContainer: {
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleBar: {
    width: 30,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  contentContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 5,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: Colors.textSecondary,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  confirmButton: {
    width: '100%',
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom:1,
    shadowColor: "#FF3B30",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.textPrimary,
    fontWeight: '500',
    fontSize: 16,
  },
});

export default DeleteDrag;