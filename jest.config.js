module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@gluestack-ui/.*|@legendapp/motion/.*)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^expo/(.*)$': '<rootDir>/node_modules/expo/$1',
    '^expo$': '<rootDir>/node_modules/expo',
    '^@react-native-async-storage/async-storage$':
      '@react-native-async-storage/async-storage/jest/async-storage-mock',
  },
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/jest.setup.js",
    "!**/*.test.{ts,tsx}",
    "!**/index.ts",
    '!components/ui/**',
    '!**/_layout.tsx',
    '!api/**',
    '!**/*.d.ts',
    '!components/external-link.tsx',
    '!components/haptic-tab.tsx',
    '!components/parallax-scroll-view.tsx',
    '!components/themed-text.tsx',
    '!components/themed-view.tsx',
    '!components/hello-wave.tsx',
    '!hooks/**',
    '!utils/**',
    '!context/**',
    '!auth/**'
  ],
  coverageReporters: [
    "json-summary",
    "text",
    "lcov",
    "html"
  ]
};
