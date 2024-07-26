import { FC, ReactNode } from "react";
import styles from "./styles.module.scss";
import { Layout } from "antd";

interface Props {
  children: ReactNode;
}

const AuthLayout: FC<Props> = ({ children }) => {
  return (
    <Layout className={styles.container}>
      <Layout.Content className={styles.content}>{children}</Layout.Content>
    </Layout>
  );
};

export default AuthLayout;
