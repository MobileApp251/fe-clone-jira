// jest.mock('expo', () => ({}));

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
  register: () => { },
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