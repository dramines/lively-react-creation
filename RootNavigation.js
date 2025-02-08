// RootNavigation.js
import { createNavigationContainerRef } from '@react-navigation/native';

// Create a ref for the navigation container
export const navigationRef = createNavigationContainerRef();

// A function to navigate using the reference
export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

// You can also add other navigation functions if needed, such as:
export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export function reset(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name, params }],
    });
  }
}
