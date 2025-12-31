import { BASE_URL } from "@/constants/auth";
import { tokenCache } from "@/utils/cache";
import { AuthUser } from "@/utils/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AuthError,
  AuthRequestConfig,
  DiscoveryDocument,
  makeRedirectUri,
  useAuthRequest
} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as jose from "jose";
import React from "react";
import { Platform } from "react-native";
import { GoogleSignIn } from "./sign-in";

WebBrowser.maybeCompleteAuthSession();

const GoogleAuthContext = React.createContext({
  user: null as AuthUser | null,
  signIn: () => { },
  signOut: () => { },
  fetchWithAuth: (url: string, options: RequestInit) =>
    Promise.resolve(new Response()),
  isLoading: false,
  error: null as AuthError | null,
});

const config: AuthRequestConfig = {
  clientId: "google",
  scopes: ["openid", "profile", "email"],
  redirectUri: makeRedirectUri(),
};

const discovery: DiscoveryDocument = {
  authorizationEndpoint: `${BASE_URL}/api/auth/authorize`,
  tokenEndpoint: `${BASE_URL}/api/auth/token`,
};

export const GoogleAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [refreshToken, setRefreshToken] = React.useState<string | null>(null);
  const [idToken, setIdToken] = React.useState<string | null>(null);
  const [request, response, promptAsync] = useAuthRequest(config, discovery);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<AuthError | null>(null);

  const refreshInProgressRef = React.useRef(false);

  const isWeb = Platform.OS === "web";

  React.useEffect(() => {
    handleResponse();
  }, [response]);

  React.useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    setIsLoading(true);
    try {
      const storedAccessToken = await tokenCache?.getToken("accessToken");
      const storedRefreshToken = await tokenCache?.getToken("refreshToken");

      if (storedAccessToken) {
        try {
          const decoded = jose.decodeJwt(storedAccessToken);
          const exp = (decoded as any).exp;
          const now = Math.floor(Date.now() / 1000);

          if (exp && exp > now) {
            setAccessToken(storedAccessToken);
            if (storedRefreshToken) setRefreshToken(storedRefreshToken);
            setUser(decoded as AuthUser);
          } else if (storedRefreshToken) {
            await refreshAccessToken(storedRefreshToken);
          }
        } catch {
          if (storedRefreshToken) await refreshAccessToken(storedRefreshToken);
        }
      } else if (storedRefreshToken) {
        await refreshAccessToken(storedRefreshToken);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAccessToken = async (tokenToUse?: string) => {
    if (refreshInProgressRef.current) return null;

    refreshInProgressRef.current = true;
    try {
      const currentRefreshToken = tokenToUse || refreshToken;

      if (!currentRefreshToken) {
        signOut();
        return null;
      }

      const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: "native",
          refreshToken: currentRefreshToken,
        }),
      });

      if (!res.ok) {
        if (res.status === 401) signOut();
        return null;
      }

      const tokens = await res.json();
      const newAccess = tokens.accessToken;
      const newRefresh = tokens.refreshToken;

      if (newAccess) {
        setAccessToken(newAccess);
        await tokenCache?.saveToken("accessToken", newAccess);
        const decoded = jose.decodeJwt(newAccess);
        setUser(decoded as AuthUser);
      }

      if (newRefresh) {
        setRefreshToken(newRefresh);
        await tokenCache?.saveToken("refreshToken", newRefresh);
      }

      return newAccess;
    } finally {
      refreshInProgressRef.current = false;
    }
  };

  const handleNativeTokens = async (tokens: {
    accessToken: string;
    refreshToken: string;
    idToken: string;
  }) => {
    const { accessToken: a, refreshToken: r, idToken: i } = tokens;
    setAccessToken(a);
    setRefreshToken(r);
    setIdToken(i);

    await tokenCache?.saveToken("accessToken", a);
    await tokenCache?.saveToken("refreshToken", r);
    await tokenCache?.saveToken("idToken", i);
    await GoogleSignIn(i);
    const decoded = jose.decodeJwt(a);
    setUser(decoded as AuthUser);
    await AsyncStorage.setItem("USER_EMAIL", (decoded as AuthUser)?.email ?? "");
  };

  async function handleResponse() {
    if (response?.type === "success") {
      try {
        setIsLoading(true);
        const { code } = response.params;

        const formData = new FormData();
        formData.append("code", code);

        if (isWeb) {
          formData.append("platform", "web");
        }

        if (request?.codeVerifier) {
          formData.append("code_verifier", request.codeVerifier);
        } else {
          console.warn("No code verifier found in request object");
        }

        const tokenRes = await fetch(`${BASE_URL}/api/auth/token`, {
          method: "POST",
          body: formData,
        });

        const tokens = await tokenRes.json();
        await handleNativeTokens(tokens);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    } else if (response?.type === "cancel") {
      alert("Sign in cancelled");
    } else if (response?.type === "error") {
      setError(response.error as AuthError);
    }
  }

  const fetchWithAuth = async (url: string, options: RequestInit) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      }
    }

    return res;
  };

  const signIn = async () => {
    try {
      if (!request) {
        console.log("No request");
        return;
      }
      setIsLoading(true)
      await promptAsync();
    } catch (e) {
      console.log(e);
    }
  };

  const signOut = async () => {
    await tokenCache?.deleteToken("accessToken");
    await tokenCache?.deleteToken("refreshToken");
    await tokenCache?.deleteToken("idToken");
    await tokenCache?.deleteToken("ACCESS_TOKEN");
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setIsLoading(false);
  };

  return (
    <GoogleAuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoading,
        error,
        fetchWithAuth,
      }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
};

export const useGoogleAuth = () => React.useContext(GoogleAuthContext);
