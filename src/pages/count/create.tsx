import CountService, { CreateCountParams } from "@/services/count";
import {
  DrawerForm,
  ProForm,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Form, message, Switch } from "antd";
import { FC } from "react";

interface Props {
  onFinish: () => void;
}

export const CreateNewCount: FC<Props> = ({ onFinish }) => {
  const [form] = Form.useForm<CreateCountParams>();

  const create = useRequest(CountService.createCount, {
    manual: true,
    onSuccess: () => message.success("Амжилттай хадгаллаа"),
    onError: (err) => message.error(err.message),
  });

  const journals = useRequest(CountService.getJournals, {
    onError: (err) => message.error(err.message),
  });

  return (
    <DrawerForm<{
      id: string;
      showQuantity: boolean;
    }>
      loading={journals.loading || create.loading}
      open
      title="Шинэ тооллого үүсгэх"
      form={form}
      autoFocusFirstInput
      initialValues={{
        showQuantity: true,
      }}
      drawerProps={{
        onClose: onFinish,
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        const selectedJournal = journals.data?.records.find(
          (r) => r.id === values.id
        );

        if (selectedJournal == null) {
          return false;
        }

        if (
          await create.runAsync({
            id: values.id,
            batchName: selectedJournal?.name,
            wareHouseLocationCode: selectedJournal?.locationCode,
            showQuantity: values.showQuantity,
          })
        ) {
          onFinish();
          return true;
        }
        return false;
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          width="md"
          label="Тооллогын дугаар"
          options={journals.data?.records.map((r) => ({
            value: r.id,
            label: r.name,
          }))}
          onChange={(__, option) => {
            const selectedJournal = journals.data?.records.find(
              (r) => r.id === (option as { value: string }).value
            );
            form.setFieldValue(
              "wareHouseLocationCode",
              selectedJournal?.locationCode
            );
          }}
          name="id"
          tooltip="Count number"
          rules={[{ required: true, message: "Please enter" }]}
          required
        />

        <ProFormText
          width="md"
          label="Байршлын нэр"
          name="wareHouseLocationCode"
          fieldProps={{ readOnly: true }}
        />
        <ProForm.Item
          name="showQuantity"
          label="Үлдэгдэл харуулах"
          valuePropName="checked"
        >
          <Switch />
        </ProForm.Item>
      </ProForm.Group>
    </DrawerForm>
  );
};

export default CreateNewCount;
