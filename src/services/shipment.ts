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
  destination: number;
  takeBin: string;
  placeBin: string;
}

export interface PreShipmentOrderItem extends ShipmentOrderItem {
  quantityInBox: number;
}

export interface GetShipmentItems extends PaginationRequest {
  itemNo?: string;
  name?: string;
}

export interface GetPreShipmentItems extends PaginationRequest {
  itemNo?: string;
  name?: string;
}

export interface GetShipmentOrders extends PaginationRequest {
  date: Date;
  gate?: string;
  destinationNo?: string;
}

export interface GetPreShipmentOrders extends PaginationRequest {
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

export interface LocationReportGate {
  locationCode: string;
  gates: ShipmentReport[];
}
export interface PreShipmentOrder {
  id: number;
  createdAt: string;
  no: string;
  gate: string;
  cbm: number;
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
  preShipmentOrders: (body: GetPreShipmentOrders) =>
    Api.post<ListResponse<PreShipmentOrder>>("/admin/pre-shipment/list", {
      hasAuth: true,
      body,
    }),
  preShipmentOrderitems: (id: number, body: GetPreShipmentItems) =>
    Api.post<ListResponse<PreShipmentOrderItem>>(
      `/admin/pre-shipment/${id}/items`,
      {
        hasAuth: true,
        body,
      }
    ),
  shipmentReport: (date: Date) =>
    Api.post<ListResponse<LocationReportGate>>("/admin/cbm/shipment/report", {
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
    Api.get<ShipmentOrder>(`/admin/shipment/${id}`, {
      hasAuth: true,
    }),
};

export default ShipmentService;
