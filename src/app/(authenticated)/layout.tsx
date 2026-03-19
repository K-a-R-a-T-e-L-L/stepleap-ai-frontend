"use client";

import { useDidMount } from "@/hooks/useDidMount";
import ReactQueryProvider from "@/processes/providers/ReactQueryProvider";
import { setLocale } from "@/shared/lib/i18n/locale";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import Wrapper from "@/widgets/layout/Wrapper";
import AppShell from "@/widgets/layout/AppShell";
import ErrorNotificationProvider from "@/processes/providers/ErrorNotificationProvider";
import { initData, useSignal } from "@tma.js/sdk-react";
import { ReactNode, useEffect } from "react";

const ContentView = ({ children }: { children: ReactNode }) => {
  const initDataUser = useSignal(initData.user);

  useEffect(() => {
    if (initDataUser?.language_code) {
      void setLocale(initDataUser.language_code);
    }
  }, [initDataUser]);

  return (
    <ReactQueryProvider>
      <ErrorNotificationProvider>
        <Wrapper bgColor="#0b1220">
          <AppShell>{children}</AppShell>
        </Wrapper>
      </ErrorNotificationProvider>
    </ReactQueryProvider>
  );
};

export default function ClientLayout({ children }: { children: ReactNode }) {
  const didMount = useDidMount();

  return didMount ? <ContentView>{children}</ContentView> : <LoadingSpinner />;
}
