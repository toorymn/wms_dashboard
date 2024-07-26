import { Button, Card, Flex, Form, Input } from "antd";
import styles from "./styles.module.scss";

const LoginPage = () => {
  const [form] = Form.useForm();
  return (
    <Card>
      <Flex vertical gap={6} align="center">
        <img src="/logo.png" className={styles.logo} />
        <Form
          form={form}
          onFinish={(values) => {
            console.log(values);
          }}
        >
          <Form.Item name="username" rules={[{ required: true }]}>
            <Input placeholder="Username" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password
              placeholder="Password"
              size="large"
              type="password"
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <Button type="primary" block size="large">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Card>
  );
};

export default LoginPage;
