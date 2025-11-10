import { useAuthContext } from "@/context/auth";
import { WorkerService } from "@/services";
import { CreateWorkerParams } from "@/services/worker";
import {
  DrawerForm,
  ProForm,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Form, message } from "antd";
import { FC } from "react";

interface Props {
  onFinish: () => void;
}

export const CreateWorkerAccount: FC<Props> = ({ onFinish }) => {
  const [form] = Form.useForm<CreateWorkerParams>();

  const create = useRequest(WorkerService.createWorker, {
    manual: true,
    onSuccess: () => message.success("Амжилттай хадгаллаа"),
    onError: (err) => message.error(err.message),
  });

  const { user } = useAuthContext();

  return (
    <DrawerForm<CreateWorkerParams>
      open
      title="Шинэ ажилтан үүсгэх"
      form={form}
      autoFocusFirstInput
      drawerProps={{
        onClose: onFinish,
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        if (
          await create.runAsync({
            lastName: values.lastName,
            firstName: values.firstName,
            username: values.username,
            password: values.password,
            role: values.role,
            warehouse: values.warehouse,
          })
        ) {
          onFinish();
          return true;
        }
        return false;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          label="Нэр"
          name="firstName"
          tooltip="firstName"
          rules={[{ required: true, message: "Please enter" }]}
          required
          placeholder="Нэр"
        />

        <ProFormText
          width="md"
          label="Овог"
          required
          rules={[{ required: true, message: "Please enter" }]}
          name="lastName"
          placeholder="Овог"
        />
        <ProFormText
          width="md"
          label="Нэвтрэх нэр"
          required
          name="username"
          rules={[{ required: true, message: "Please enter", min: 6 }]}
          tooltip="username"
          placeholder="Username"
        />
        <ProFormText.Password
          width="md"
          label="Нууц үг"
          required
          name="password"
          rules={[{ required: true, message: "Please enter", min: 6 }]}
          tooltip="password"
          placeholder="password"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          mode="multiple"
          width={"md"}
          name="warehouse"
          options={user?.managerWarehouses.map((wh) => ({
            label: wh,
            value: wh,
          }))}
          label="Агуулах"
          placeholder="Please select"
          rules={[{ required: true, message: "Please select!" }]}
        />

        {user?.role === 100 && (
          <ProFormSelect
            mode="single"
            width={"md"}
            name="role"
            options={[
              {
                label: "Агуулах ажилтан",
                value: 200,
              },
              {
                label: "Менежер",
                value: 110,
              },
            ]}
            label="Үүрэг"
            placeholder="Please select"
            rules={[{ required: true, message: "Please select!" }]}
          />
        )}
      </ProForm.Group>
    </DrawerForm>
  );
};

export default CreateWorkerAccount;
