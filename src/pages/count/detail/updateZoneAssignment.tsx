import CountService, { WorkerZoneAssignments } from "@/services/count";
import { ModalForm, ProForm, ProFormSelect } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { message } from "antd";
import { FC } from "react";

interface Props {
  data: WorkerZoneAssignments & {
    countId: number;
  };
  onClose: (success: boolean) => void;
}

export const UpdateZoneAssignment: FC<Props> = ({ onClose, data }) => {
  const update = useRequest(CountService.assignZones, {
    manual: true,
    onError: (err) => message.error(err.message),
  });

  return (
    <ModalForm<{
      countZones: number[];
      confirmZones: number[];
    }>
      open
      // width={"100%"}
      title="Бүс засварлах"
      autoFocusFirstInput
      initialValues={{
        countZones: data.zones.filter((z) => z.level == 1).map((z) => z.no),
        confirmZones: data.zones.filter((z) => z.level == 2).map((z) => z.no),
      }}
      modalProps={{
        onCancel: () => onClose(false),
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        const resp = await update.runAsync(data.countId, {
          confirmZones: values.confirmZones ?? [],
          countZones: values.countZones ?? [],
          workerId: data.id,
        });
        console.log(resp.overlap);

        if (resp.overlap && resp.overlap.length > 0) {
          const overlapText =
            "Overlap:" +
            resp.overlap
              .map((o) => `${o.no}-${o.level}`)
              .join(",")
              .toString();
          message.error(overlapText);
          return false;
        }
        onClose(true);
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          mode="multiple"
          width="md"
          label="Эхний тооллого"
          name="countZones"
          tooltip="Select multiple zone numbers"
          placeholder="Zone"
          options={Array.from({ length: 100 }, (_, i) => ({
            label: `Zone ${i + 1}`,
            value: i + 1,
          }))}
        />
        <ProFormSelect
          mode="multiple"
          width="md"
          label="Давтан тооллого"
          name="confirmZones"
          tooltip="Select multiple zone numbers"
          placeholder="Zone Numbers"
          options={Array.from({ length: 100 }, (_, i) => ({
            label: `Zone ${i + 1}`,
            value: i + 1,
          }))}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default UpdateZoneAssignment;
