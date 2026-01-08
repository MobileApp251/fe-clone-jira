import Index from '@/app/index';
import { tokenCache } from '@/utils/cache';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, waitFor } from '@testing-library/react-native';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('@/utils/cache', () => ({
  tokenCache: {
    getToken: jest.fn(),
    deleteToken: jest.fn(),
  },
}));

(global as any).atob = (data: string) =>
  Buffer.from(data, 'base64').toString('binary');

describe('<Index /> bootstrap flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('redirects to onboarding if not viewed', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValue(null);

    render(<Index />);

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith('/onboarding')
    );
  });

  test('redirects to dashboard when token is valid', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValue('true');

    const payload = { exp: Math.floor(Date.now() / 1000) + 1000 };
    const token = `x.${btoa(JSON.stringify(payload))}.y`;

    (tokenCache?.getToken as jest.Mock).mockResolvedValue(token);

    render(<Index />);

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith('/dashboard')
    );
  });

  test('redirects to login when token is invalid', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValue('true');

    (tokenCache?.getToken as jest.Mock).mockResolvedValue('invalid.token');

    render(<Index />);

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith('/login')
    );
  });
});
