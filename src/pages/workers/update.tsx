import { WorkerService } from "@/services";
import ReferenceService from "@/services/ref";
import { UpdateWorkerParams, WorkerAccount } from "@/services/worker";
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
  data: WorkerAccount;
  onFinish: () => void;
}

export const UpdateWorkerAccount: FC<Props> = ({ data, onFinish }) => {
  const [form] = Form.useForm<UpdateWorkerParams>();

  const update = useRequest(WorkerService.updateWorker, {
    manual: true,
    onSuccess: () => message.success("Амжилттай засварлагдалаа"),
    onError: (err) => message.error(err.message),
  });

  const warehouseFetch = useRequest(ReferenceService.warehouses, {
    onError: (err) => message.error(err.message),
  });
  return (
    <DrawerForm<UpdateWorkerParams>
      open
      // width={"100%"}
      title="Засварлах"
      form={form}
      initialValues={{
        firstName: data.firstName,
        lastName: data.lastName,
        warehouse:data.accessWareHouses,
        username: data.username,
      }}
      autoFocusFirstInput
      drawerProps={{
        onClose: onFinish,
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        if (
          await update.runAsync({
              lastName: values.lastName,
              firstName: values.firstName,
              username: values.username,
              warehouse: values.warehouse,
              password: values.password,  
              accountId:data.id,
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
          rules={[{ required: true, message: "Please enter", len: 6 }]}
          tooltip="username"
          placeholder="Username"
        />
        <ProFormText.Password
          width="md"
          label="Нууц үг"
          required
          name="password"
          rules={[{ required: false, message: "Please enter", len: 6 }]}
          tooltip="password"
          placeholder="password"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          mode="multiple"
          width={"md"}
          name="warehouse"
          options={warehouseFetch.data?.map((w) => ({
            label: `(${w.code})`,
            value: w.code,
          }))}
          label="Агуулах"
          placeholder="Please select"
          rules={[{ required: true, message: "Please select!" }]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};

export default UpdateWorkerAccount;
