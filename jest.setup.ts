// Jest setup file for React Native testing with Expo
// Type definitions for jest are provided by @types/jest package

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Expo Camera
jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn(() =>
      Promise.resolve({ status: 'granted', granted: true, canAskAgain: true, expires: 'never' })
    ),
  },
}));

// Mock Expo Image Picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [
        {
          uri: 'file:///test-image.jpg',
          base64: 'mockBase64ImageData',
          width: 1080,
          height: 1920,
        },
      ],
    })
  ),
  launchCameraAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [
        {
          uri: 'file:///test-camera-image.jpg',
          base64: 'mockBase64CameraData',
          width: 1080,
          height: 1920,
        },
      ],
    })
  ),
  MediaTypeOptions: {
    Images: 'Images',
  },
  PermissionStatus: {
    GRANTED: 'granted',
    DENIED: 'denied',
    UNDETERMINED: 'undetermined',
  },
}));

// Mock Expo Clipboard
jest.mock('expo-clipboard', () => ({
  hasImageAsync: jest.fn(() => Promise.resolve(true)),
  getImageAsync: jest.fn(() =>
    Promise.resolve({
      data: 'mockBase64ClipboardData',
    })
  ),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Ionicons: (props: { name: string }) => React.createElement(Text, null, props.name),
  };
});

// Mock expo-image
jest.mock('expo-image', () => {
  const { Image: RNImage } = require('react-native');
  return {
    Image: RNImage,
  };
});

// Silence console warnings and errors in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
