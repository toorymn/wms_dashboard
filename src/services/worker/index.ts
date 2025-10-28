import { AccountRole } from "@/context/auth";
import Api from "../api";
import { ListResponse, PaginationRequest } from "../types/base";

export interface WorkerAccount {
  id: number;
  accessWareHouses: string[];
  createdAt: string;
  firstName: string;
  isActive: boolean;
  lastName: string;
  role: number;
  updatedAt: string;
  username: string;
}

export interface GetWorkerListParams extends PaginationRequest {
  firstName?: string;
  lastName?: string;
  userName?: string;
}

export interface CreateWorkerParams {
  username: string;
  firstName: string;
  lastName: string;
  role: AccountRole | null | undefined;
  password: string;
  warehouse: string[];
}

export interface UpdateWorkerParams extends Partial<CreateWorkerParams> {
  accountId: number;
  password?: string;
}

const WorkerService = {
  getWorkerList: (body: GetWorkerListParams) =>
    Api.post<ListResponse<WorkerAccount>>("/admin/worker/list", {
      hasAuth: true,
      body,
    }),
  createWorker: (body: CreateWorkerParams) =>
    Api.post("/admin/worker/register", {
      hasAuth: true,
      body: {
        ...body,
      },
    }),
  updateWorker: (body: UpdateWorkerParams) =>
    Api.post("/admin/worker/update", {
      hasAuth: true,
      body: {
        ...body,
      },
    }),
  updateWorkerStatus: (body: { accountId: number; isActive: boolean }) =>
    Api.post("/admin/worker/update/status", {
      hasAuth: true,
      body: {
        ...body,
      },
    }),
  // getOrders: (body = {}) =>
  //   Api.post<ListResponse<OrderTransaction>>('/admin/order/get', {
  //     hasAuth: true,
  //     body: {
  //       ...body,
  //     },
  //   }),
  // getReport: (body = {}) =>
  //   Api.post<ListResponse<Report>>('/admin/report', {
  //     hasAuth: true,
  //     body: {
  //       ...body,
  //     },
  //   }),
  // getTableReport: (body: TableReport = {}) =>
  //   Api.post<ListResponse<TableReportResponse>>('/admin/tables/report', {
  //     hasAuth: true,
  //     body: {
  //       ...body,
  //     },
  //   }),
  // // approveUpdate:() => {

  // // },
  // depositBalanceAll: (data: DepositBalanceAll) =>
  //   Api.post<ResponeDepositBalanceAll>('admin/balance/update', {
  //     hasAuth: true,
  //     body: data,
  //   }),
  // getBalance: () =>
  //   Api.get<{
  //     balance: ClientBalance
  //   }>('/client/balance', {
  //     hasAuth: true,
  //   }),
  // getQr: () =>
  //   Api.post<GetQrResponse>('/client/qr/generate', {
  //     hasAuth: true,
  //   }),
  // checkQr: (qr: string) =>
  //   Api.post<CheckQrResponse>('admin/order/check', {
  //     hasAuth: true,
  //     body: {
  //       qr,
  //     },
  //   }),
  // getProductsAdmin: () =>
  //   Api.get<ListResponse<Product>>('admin/products', {
  //     hasAuth: true,
  //   }),
  // getTablesAdmin: () =>
  //   Api.get<ListResponse<Table>>('admin/tables', {
  //     hasAuth: true,
  //   }),
  // getProducts: () =>
  //   Api.get<ListResponse<Product>>('client/products', {
  //     hasAuth: true,
  //   }),
  // getTables: () =>
  //   Api.get<ListResponse<Table>>('client/tables', {
  //     hasAuth: true,
  //   }),
  // acceptQr: (qr: string) =>
  //   Api.post('admin/order/accept', {
  //     hasAuth: true,
  //     body: {
  //       qr,
  //     },
  //   }),
  // makeOrder: (data: {
  //   productId: number
  //   tableId: number
  //   isPickUp: boolean
  // }) =>
  //   Api.post('client/order', {
  //     hasAuth: true,
  //     body: data,
  //   }),

  // adminMakeOrder: (data: {
  //   productId: number
  //   tableId: number
  //   phonNumber: string
  // }) =>
  //   Api.post('admin/order', {
  //     hasAuth: true,
  //     body: data,
  //   }),
  // getMyOrders: () =>
  //   Api.get<ListResponse<OrderTransaction>>('client/orders', {
  //     hasAuth: true,
  //   }),

  // updateProduct: (data: {
  //   id: number
  //   isActive: boolean
  //   name: string
  //   description: string
  // }) =>
  //   Api.post('admin/product/update', {
  //     hasAuth: true,
  //     body: data,
  //   }),

  // upsertTable: (data: {
  //   id?: number
  //   isActive: boolean
  //   name: string
  //   order?: number
  // }) =>
  //   Api.post('admin/table/update', {
  //     hasAuth: true,
  //     body: data,
  //   }),

  // approveOrder: (data: { id: number; status: boolean }) =>
  //   Api.post('admin/order/approve', {
  //     hasAuth: true,
  //     body: data,
  //   }),
  // cancelOrder: (data: { id: number }) =>
  //   Api.post('admin/order/cancel', {
  //     hasAuth: true,
  //     body: data,
  //   }),
};

export default WorkerService;
