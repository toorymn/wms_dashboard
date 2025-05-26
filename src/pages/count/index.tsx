import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType } from "@ant-design/pro-components";
import { ProFormInstance, ProTable } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Button, Tag, Tooltip, message } from "antd";
import { useRef, useState } from "react";
import { CountService } from "@/services";
import CreateNewCount from "./create";
import { InternalCount } from "@/services/count";
import { COUNT_STATUS, COUNT_STATUS_LABEL } from "@/utils/const";
import { Link } from "react-router-dom";

const CountPage = () => {
  const actionRef = useRef<ActionType>();
  const [showCreate, setShowCreate] = useState(false);
  const fetch = useRequest(CountService.getCountList, {
    manual: true,
    onError: (err) => message.error(err.message),
  });
  const ref = useRef<ProFormInstance>();
  const reload = () => actionRef.current?.reload();

  return (
    <>
      <ProTable<InternalCount>
        formRef={ref}
        scroll={{ x: "auto" }}
        columns={[
          {
            dataIndex: "index",
            valueType: "index",
            width: 48,
          },
          {
            title: "Тооллогын дугаар",
            dataIndex: "batchName",
            key: "batchName",
          },
          {
            title: "Огноо",
            dataIndex: "createdAt",
            valueType: "dateTime",
            search: false,
          },
          {
            title: "Салбар",
            search: false,
            dataIndex: "warehouseCode",
            key: "warehouseCode",
          },
          {
            title: "Төлөв",
            // order: 5,
            valueType: "select",
            fieldProps: {
              options: [
                {
                  label: "Идвэхтэй",
                  value: COUNT_STATUS.STARTED,
                },
                {
                  label: "Хүчингүй болгосон",
                  value: COUNT_STATUS.CANCELLED,
                },
                {
                  label: "Хаагдсан",
                  value: COUNT_STATUS.DONE,
                },
              ],
            },
            dataIndex: "status",
            render: (_, record) => {
              return (
                <Tag
                  color={
                    record.status == COUNT_STATUS.STARTED
                      ? "success"
                      : record.status == COUNT_STATUS.CANCELLED
                      ? "default"
                      : "volcano"
                  }
                  className="m-0"
                >
                  {COUNT_STATUS_LABEL[record.status]}
                </Tag>
              );
            },
          },
          {
            title: "#",
            width: 180,
            key: "option",
            fixed: "right",
            valueType: "option",
            render: (_, record) => [
              <Tooltip title="Дэлгэрэнгүй">
                <Link to={`/count/${record.id}`}>
                  <Button icon={<EyeOutlined />} type="link" />
                </Link>
              </Tooltip>,
            ],
          },
        ]}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          console.log(sort, filter);
          const result = await fetch.runAsync({
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
        headerTitle="Тооллогын жагсаалт"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setShowCreate(true);
            }}
            type="primary"
          >
            Шинэ тооллого үүсгэх
          </Button>,
        ]}
      />
      {showCreate && (
        <CreateNewCount
          onFinish={() => {
            setShowCreate(false);
            reload();
          }}
        />
      )}
    </>
  );
};

export default CountPage;
