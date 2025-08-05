import type { ActionType } from "@ant-design/pro-components";
import { ProFormInstance, ProTable } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Flex, Input, message, Spin, Tag } from "antd";
import { FC, useRef, useState } from "react";
import { CountService } from "@/services";
import {
  CheckCircleOutlined,
  CloseOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { WareHouseCountJournalItem } from "@/services/count";

interface Props {
  countId: number;
}

const WareHouseJournalTab: FC<Props> = ({ countId }) => {
  const actionRef = useRef<ActionType>();
  const [editRow, setEditRow] = useState<number | null>();
  const [editRowValue, setEditRowValue] = useState<number | null>();
  const fetch = useRequest(CountService.getCountWareHouseJournal, {
    manual: true,
    onError: (err) => message.error(err.message),
  });

  const updateRow = useRequest(CountService.updateInternalJournalItem, {
    manual: true,
    onSuccess: () => {
      message.success("Амжилттай хадгаллаа");
      reload();
    },
    onError: (err) => message.error(err.message),
    onFinally: () => {
      setEditRow(null);
      setEditRowValue(null);
    },
  });
  const ref = useRef<ProFormInstance>();

  const reload = () => actionRef.current?.reload();

  const onSend = (record: WareHouseCountJournalItem) => {
    if (editRowValue == null) {
      message.error("Утга оруулна уу");
      return;
    }
    updateRow.run({
      countId: countId,
      quantity: editRowValue,
      itemNo: record.itemNo,
      binCode: record.binCode,
    });
  };

  return (
    <>
      <ProTable<WareHouseCountJournalItem>
        formRef={ref}
        actionRef={actionRef}
        scroll={{ x: "auto" }}
        columns={[
          {
            dataIndex: "index",
            valueType: "index",
            width: 48,
          },
          {
            title: "Барааны код",
            order: 1,
            dataIndex: "itemNo",
            key: "itemNo",
          },
          {
            title: "Огноо",
            dataIndex: "createdAt",
            valueType: "dateTime",
            key: "createdAt",
            search: false,
          },
          {
            title: "Барааны нэр",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Хэмжих нэгж",
            dataIndex: "unitOfMeasureCode",
            key: "unitOfMeasureCode",
            search: false,
          },
          {
            title: "Bin",
            dataIndex: "binCode",
            key: "binCode",
            search: false,
          },
          {
            title: "Эхний үлдэгдэл",
            dataIndex: "quantity",
            key: "quantity",
            search: false,
          },
          {
            title: "Тоолсон тоо",
            key: "calculatedQuantity",
            editable: () => {
              return true;
            },
            search: false,
            render: (_, record) => {
              let value = 0;
              let isHasLevel3 = false;
              if (record.level3Quantity != null) {
                value = record.level3Quantity;
                isHasLevel3 = true;
              } else if (record.level2Quantity != null) {
                value = record.level2Quantity;
              } else if (record.level1Quantity != null) {
                value = record.level1Quantity;
              }
              if (editRow !== record.id) {
                return (
                  <Flex gap={10}>
                    {isHasLevel3 && (
                      <ExclamationCircleOutlined style={{ color: "orange" }} />
                    )}
                    {value}
                    {!updateRow.loading && (
                      <EditOutlined
                        onClick={() => {
                          setEditRowValue(value);
                          setEditRow(record.id);
                        }}
                      />
                    )}
                  </Flex>
                );
              }

              if (updateRow.loading) {
                return <Spin />;
              }

              return (
                <Input
                  disabled={editRow !== record.id}
                  value={editRowValue || 0}
                  onPressEnter={() => onSend(record)}
                  suffix={
                    <Flex gap={10}>
                      <CloseOutlined
                        onClick={() => {
                          setEditRowValue(null);
                          setEditRow(null);
                        }}
                      />
                      <CheckCircleOutlined
                        onClick={() => {
                          onSend(record);
                        }}
                      />
                    </Flex>
                  }
                  onChange={(e) => {
                    setEditRowValue(
                      isNaN(parseInt(e.target.value))
                        ? 0
                        : parseInt(e.target.value)
                    );
                  }}
                />
              );
            },
          },
          {
            title: "Зөрүү",
            search: false,
            key: "diff",
            render: (_, record) => {
              let total = 0;
              if (record.level3Quantity != null) {
                total = record.level3Quantity;
              } else if (record.level2Quantity != null) {
                total = record.level2Quantity;
              } else if (record.level1Quantity != null) {
                total = record.level1Quantity;
              }
              const diff = record.quantity - total;
              return <Tag color={diff !== 0 ? "red" : "success"}>{diff}</Tag>;
            },
          },
        ]}
        cardBordered
        request={async (params = {}, sort, filter) => {
          console.log(sort, filter);
          const result = await fetch.runAsync(countId, {
            limit: params.pageSize || 40,
            offset: ((params.current || 1) - 1) * (params.pageSize || 40),
            ...params,
          });
          return {
            data: result.records,
            total: result.count,
            success: true,
          };
        }}
        columnsState={{
          persistenceKey: "client-list-table",
          persistenceType: "localStorage",
        }}
        rowKey="id"
        search={{
          labelWidth: "auto",
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSizeOptions: [20, 100, 200, 1000, 2000, 30000],
        }}
        dateFormatter="string"
        toolBarRender={() => []}
      />
    </>
  );
};

export default WareHouseJournalTab;
