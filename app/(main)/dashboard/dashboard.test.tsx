import { render } from '@testing-library/react-native';
import * as ExpoRouter from 'expo-router';
import Dashboard from './index';

const MockRedirect = ({ href }: any) => {
  return <>{href}</>;
};

jest.mock('@/components/header/WorkSwitch', () => {
  return function MockWorkSwitch() {
    return null;
  };
});

jest.mock('expo-router', () => ({
  usePathname: jest.fn(),
  Redirect: ({ href }: any) => {
    return <MockRedirect href={href} />;
  },
}));

describe('<Dashboard />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('redirects when pathname ends with /dashboard', () => {
    (ExpoRouter.usePathname as jest.Mock).mockReturnValue('/(main)/dashboard');

    const { UNSAFE_queryByType } = render(<Dashboard />);

    // Redirect should be rendered
    const redirect = UNSAFE_queryByType(MockRedirect);
    expect(redirect?.props.href).toBe('/(main)/dashboard/(work)/projects');
  });

  test('does not redirect when pathname does not end with /dashboard', () => {
    (ExpoRouter.usePathname as jest.Mock).mockReturnValue(
      '/(main)/dashboard/(work)/projects'
    );

    const { UNSAFE_queryByType } = render(<Dashboard />);

    // Redirect should NOT exist
    const redirect = UNSAFE_queryByType(MockRedirect);
    expect(redirect).toBeNull();
  });
});
