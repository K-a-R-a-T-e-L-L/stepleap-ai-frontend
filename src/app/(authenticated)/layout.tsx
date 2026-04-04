"use client";

import { useDidMount } from "@/hooks/useDidMount";
import AuthSessionProvider from "@/processes/providers/AuthSessionProvider";
import { CareerProfileProvider } from "@/processes/providers/career";
import ErrorNotificationProvider from "@/processes/providers/ErrorNotificationProvider";
import ReactQueryProvider from "@/processes/providers/ReactQueryProvider";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import AppShell from "@/widgets/layout/AppShell";
import Wrapper from "@/widgets/layout/Wrapper";
import { ReactNode } from "react";

const ContentView = ({ children }: { children: ReactNode }) => {
  return (
    <ReactQueryProvider>
      <ErrorNotificationProvider>
        <AuthSessionProvider>
          <CareerProfileProvider>
            <Wrapper bgColor="#0b1220">
              <AppShell>{children}</AppShell>
            </Wrapper>
          </CareerProfileProvider>
        </AuthSessionProvider>
      </ErrorNotificationProvider>
    </ReactQueryProvider>
  );
};

export default function ClientLayout({ children }: { children: ReactNode }) {
  const didMount = useDidMount();

  return didMount ? <ContentView>{children}</ContentView> : <LoadingSpinner />;
}
