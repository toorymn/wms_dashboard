import { PageLoading } from "@ant-design/pro-components";
import { message } from "antd";
import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { AuthService } from "@/services";

export type AccountRole = 100 | 110;

export interface Account {
  username: string;
  firstName: string;
  role: AccountRole;
  managerWarehouses: string[];
  lastName: string;
}

export type AuthState = {
  user?: Account;
  setUser: (value: Account) => void;
  logOut: () => void;
};

const AuthContext = React.createContext({} as AuthState);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<Account | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkAccount = async () => {
      if (AuthService.hasToken()) {
        await AuthService.profile()
          .then((res) => {
            setAccount(res);
          })
          .catch((err) => {
            message.error(err.message);
          });
      }
    };
    checkAccount().finally(() => {
      setReady(true);
    });
  }, []);

  const setUser = (value: Account) => {
    setAccount(value);
  };
  const logOut = () => {
    AuthService.removeToken();
    setAccount(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        user: account,
        setUser,
        logOut,
      }}
    >
      {ready ? children : <PageLoading />}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
