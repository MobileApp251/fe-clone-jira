// __mocks__/react-native-css-interop.js
module.exports = {
  cssInterop: jest.fn(),
  StyleSheet: {
    create: (styles: any) => {
      // Return a mock that doesn't try to access displayName
      const mockStyles: any = {};
      for (const key in styles) {
        mockStyles[key] = {};
      }
      return mockStyles;
    },
  },
};