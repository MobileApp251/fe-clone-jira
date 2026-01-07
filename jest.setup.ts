jest.mock('expo', () => ({
  requireOptionalNativeModule: jest.fn(),
}));

// Không mock toàn bộ expo (dễ phá vỡ môi trường của jest-expo)

// polyfill atob nếu cần
(global as any).atob = (data: string) =>
  Buffer.from(data, 'base64').toString('binary');

// --- Fix Expo Winter runtime in Jest ---
if (!(globalThis as any).__ExpoImportMetaRegistry) {
  Object.defineProperty(globalThis, '__ExpoImportMetaRegistry', {
    value: new Proxy(
      {},
      {
        get: () => ({}),
      }
    ),
    writable: false,
  });
}

global.setImmediate = global.setImmediate || ((fn: Function, ...args: any[]) => global.setTimeout(fn, 0, ...args));

(global as any).__ExpoImportMetaRegistry = {
  register: () => {},
  get: () => null,
};

global.structuredClone = global.structuredClone || ((obj: any) => JSON.parse(JSON.stringify(obj)));

jest.mock("@gluestack-ui/core/toast/creator", () => ({
  createToastHook: () => ({
    show: jest.fn(),
  }),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => { });
  jest.spyOn(console, "warn").mockImplementation(() => { });
  jest.spyOn(console, "log").mockImplementation(() => { });
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
  (console.warn as jest.Mock).mockRestore();
  (console.log as jest.Mock).mockRestore();
});
jest.mock("@gluestack-ui/utils/nativewind-utils", () => ({
  tva: () => ({}),
  isWeb: false,
}));

// jest.setup.js
jest.mock('expo-router', () => {
  const actual = jest.requireActual('expo-router');
  return {
    ...actual,
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      canGoBack: jest.fn(() => true),
      setParams: jest.fn(),
    }),
    useLocalSearchParams: jest.fn(() => ({})),
    useGlobalSearchParams: jest.fn(() => ({})),
    useSegments: jest.fn(() => []),
    Stack: {
      Screen: () => null,
    },
  };
});

// Mock NativeWind hoàn toàn
jest.mock('nativewind', () => {
  const React = require('react');
  
  return {
    useColorScheme: () => 'light',
    useStyle: () => ({}),
    StyleSheet: {
      create: (styles: any) => {
        // Trả về một object đơn giản, không có displayName
        const result: any = {};
        for (const key in styles) {
          result[key] = {};
        }
        return result;
      },
    },
    // Mock hooks khác nếu cần
  };
});

// Mock react-native-css-interop triệt để
jest.mock('react-native-css-interop', () => {
  return {
    cssInterop: () => {},
    StyleSheet: {
      create: (styles: any) => {
        const result: any = {};
        for (const key in styles) {
          result[key] = {};
        }
        return result;
      },
    },
  };
});
jest.mock('react-native-safe-area-context');
