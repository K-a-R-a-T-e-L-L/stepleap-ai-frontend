"use client";

import {
  type User,
  useUserControllerAuthenticate,
  useUserControllerGet,
} from "@/shared/api/.generated";
import { useRawInitData } from "@tma.js/sdk-react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type AuthSessionContextValue = {
  accessToken: string | null;
  user: User | null;
  isAuthenticating: boolean;
  isUserLoading: boolean;
  authError: string | null;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

const TOKEN_KEY = "sl_access_token";

export default function AuthSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const rawInitData = useRawInitData();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenHydrated, setTokenHydrated] = useState(false);
  const [authAttempted, setAuthAttempted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const devFallbackTriedRef = useRef(false);

  const authenticate = useUserControllerAuthenticate({
    mutation: {
      onSuccess: (data) => {
        setAccessToken(data.accessToken);
        setAuthError(null);
      },
      onError: () => {
        if (!devFallbackTriedRef.current) {
          devFallbackTriedRef.current = true;
          authenticate.mutate({ data: { rawInitData: "qqq-local-dev" } });
          return;
        }
        setAuthError("Не удалось пройти авторизацию через Telegram initData.");
      },
    },
  });

  useEffect(() => {
    try {
      const savedToken = window.sessionStorage.getItem(TOKEN_KEY);
      if (savedToken) {
        setAccessToken(savedToken);
      }
    } finally {
      setTokenHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!tokenHydrated) return;
    if (accessToken) {
      window.sessionStorage.setItem(TOKEN_KEY, accessToken);
      return;
    }
    window.sessionStorage.removeItem(TOKEN_KEY);
  }, [accessToken, tokenHydrated]);

  useEffect(() => {
    if (!tokenHydrated || authAttempted || accessToken) return;

    setAuthAttempted(true);
    authenticate.mutate({
      data: { rawInitData: rawInitData || "qqq-local-dev" },
    });
  }, [tokenHydrated, authAttempted, accessToken, rawInitData, authenticate]);

  const userQuery = useUserControllerGet({
    query: {
      enabled: Boolean(accessToken),
      retry: false,
    },
    client: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : {},
  });

  useEffect(() => {
    if (!userQuery.error) return;
    setAuthError("Сессия истекла или недоступна.");
  }, [userQuery.error]);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      accessToken,
      user: userQuery.data ?? null,
      isAuthenticating: authenticate.isPending,
      isUserLoading: userQuery.isLoading,
      authError,
    }),
    [
      accessToken,
      userQuery.data,
      userQuery.isLoading,
      authenticate.isPending,
      authError,
    ]
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }

  return context;
}

