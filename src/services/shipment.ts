import Api from "./api";
import { ListResponse, PaginationRequest } from "./types/base";

export interface ShipmentOrder {
  id: number;
  createdAt: string;
  gate: string;
  destinationNo: string;
  cbm: number;
}

export interface ShipmentOrderItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  shipmentOrderId: number;
  itemNo: string;
  name: string;
  cubage: number;
  quantity: number;
  takeBin: string;
  placeBin: string;
}

export interface GetShipmentItems extends PaginationRequest {
  itemNo?: string;
  name?: string;
}

export interface GetShipmentOrders extends PaginationRequest {
  date: Date;
  gate?: string;
  destinationNo?: string;
}

export interface ShipmentGateReport {
  gate: string;
  cbm: number;
}

export interface ShipmentReport {
  gate: string;
  cbm: number;
  orders: ShipmentOrder[];
}

const ShipmentService = {
  shipmentOrders: (body: GetShipmentOrders) =>
    Api.post<
      ListResponse<ShipmentOrder> & {
        report: ShipmentGateReport[];
      }
    >("/admin/shipment/list", {
      hasAuth: true,
      body,
    }),
  shipmentReport: (date: Date) =>
    Api.post<ListResponse<ShipmentReport>>("/admin/cbm/shipment/report", {
      hasAuth: true,
      body: {
        date,
      },
    }),
  shipmentItems: (id: number, body: GetShipmentItems) =>
    Api.post<ListResponse<ShipmentOrderItem>>(`/admin/shipment/${id}/items`, {
      hasAuth: true,
      body,
    }),

  shipment: (id: number) =>
    Api.get<ShipmentOrderItem>(`/admin/shipment/${id}`, {
      hasAuth: true,
    }),
};

export default ShipmentService;
