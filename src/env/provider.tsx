"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getEnv } from "./env";

export type Env = Awaited<ReturnType<typeof getEnv>>;

export const EnvContext = createContext<Env>({} as Env);

export const EnvProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [env, setEnv] = useState({} as Env);

  useEffect(() => {
    getEnv().then((env) => {
      setEnv(env);
    });
  }, []);

  return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>;
};

export function useEnv() {
  return useContext(EnvContext);
}
