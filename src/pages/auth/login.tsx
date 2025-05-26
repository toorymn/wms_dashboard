import { Button, Card, Flex, Form, Input, message } from "antd";
import styles from "./styles.module.scss";
import { useRequest } from "ahooks";
import { AuthService } from "@/services";
import { LoginParams } from "@/services/auth";
import { useAuthContext } from "@/context/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form] = Form.useForm<LoginParams>();

  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  const login = useRequest(AuthService.login, {
    manual: true,
    onSuccess: (data) => {
      setUser(data.account);
      AuthService.saveToken(data.jwtToken);
      message.success("Амжилттай нэвтэрлээ");
      navigate("/", {
        replace: true,
      });
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  return (
    <Card>
      <Flex vertical gap={6} align="center">
        <img src="/logo.png" className={styles.logo} />
        <Form
          form={form}
          style={{
            width: "300px",
          }}
          onFinish={async (data) => {
            await login.run(data);
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
            <Button
              type="primary"
              block
              htmlType="submit"
              size="large"
              onClick={() => form.submit()}
            >
              Нэвтрэх
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Card>
  );
};

export default LoginPage;
