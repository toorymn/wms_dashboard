import { COUNT_STATUS } from "@/utils/const";
import Api from "./api";
import { ListResponse, PaginationRequest } from "./types/base";

export interface InternalCount {
  id: number;
  warehouseJournalID: string;
  batchName: string;
  warehouseCode: string;
  status: COUNT_STATUS;
  createdAt: string;
}

export interface WorkerZoneAssignments {
  userName: string;
  firstName: string;
  id: number;
  lastName: string;
  access_ware_houses: string[] | null;
  zones: {
    id: number;
    no: number;
    countId: number;
    level: number;
    workerId: number;
    status: string;
  }[];
}

export interface ZoneAssignmentOverview {
  zone: number;
  level1Total: number | null;
  level2Total: number | null;
  level1FirstName: string | null;
  level1LastName: string | null;
  level2FirstName: string | null;
  level2LastName: string | null;
}

export interface InternalJournalItem {
  l1Id: number;
  itemNo: string;
  binCode: string;
  createdAt: string;
  description: string;
  unitOfMeasureCode: string;
  level1WorkerUsername: string | null;
  level1WorkerFirstName: string | null;
  level1WorkerLastName: string | null;
  level2WorkerUsername: string | null;
  level2WorkerFirstName: string | null;
  level2WorkerLastName: string | null;
  zone: number;
  level1Quantity: number | null;
  l2Id: number;
  level2Quantity: number | null;
  level3Quantity: number | null;
}

export interface WareHouseCountJournalItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  countId: number;
  binCode: string;
  binZone: string;
  journalID: string;
  itemNo: string;
  quantity: number;
  warehouse: string;
  unitOfMeasureCode: string;
  pictureLink: string;
  description: string;
  level1Quantity: number | null;
  level2Quantity: number | null;
  level3Quantity: number | null;
}

export interface GetCountListParams extends PaginationRequest {
  status?: string;
  wareHouse?: string;
  batchName?: string;
}

export interface GetZoneAssignmentParams extends PaginationRequest {}

export interface GetCountInternalJournalParams extends PaginationRequest {}

export interface GetZoneAssignmentOverviewParams extends PaginationRequest {}

export interface WareHouseJournal {
  id: string;
  name: string;
  locationCode: string;
}

export interface Create {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  warehouse: string[];
}

export interface CreateCountParams {
  id: string;
  batchName: string;
  wareHouseLocationCode: string;
  showQuantity: boolean;
}

export interface UpdateAssignedZones {
  workerId: number;
  countZones: number[];
  confirmZones: number[];
}

const CountService = {
  getCountList: (body: GetCountListParams) =>
    Api.post<ListResponse<InternalCount>>("/admin/count/list", {
      hasAuth: true,
      body,
    }),
  getJournals: () =>
    Api.get<ListResponse<WareHouseJournal>>("/admin/count/journals", {
      hasAuth: true,
    }),
  getCountInternalJournal: (id: number, body: GetCountInternalJournalParams) =>
    Api.post<ListResponse<InternalJournalItem>>(
      `/admin/count/${id}/internal-journal`,
      {
        hasAuth: true,
        body,
      }
    ),
  getCountWareHouseJournal: (id: number, body: GetCountInternalJournalParams) =>
    Api.post<ListResponse<WareHouseCountJournalItem>>(
      `/admin/count/${id}/warehouse-journal`,
      {
        hasAuth: true,
        body,
      }
    ),
  createCount: (body: CreateCountParams) =>
    Api.post("/admin/count/create", {
      hasAuth: true,
      body,
    }),

  updateInternalJournalItem: (body: {
    countId: number;
    itemNo: string;
    binCode: string;
    quantity: number;
  }) =>
    Api.post(`/admin/count/internal-journal-final`, {
      hasAuth: true,
      body: {
        ...body,
      },
    }),
  getZones: (id: number, body: GetZoneAssignmentParams) =>
    Api.post<ListResponse<WorkerZoneAssignments>>(
      `/admin/count/${id}/assign-zone/list`,
      {
        hasAuth: true,
        body,
      }
    ),
  assignZones: (id: number, body: UpdateAssignedZones) =>
    Api.post<{
      overlap?: { no: number; level: 1 }[];
    }>(`/admin/count/${id}/assign-zone`, {
      hasAuth: true,
      body,
    }),
  zonesOverview: (id: number, body: GetZoneAssignmentOverviewParams) =>
    Api.post<ListResponse<ZoneAssignmentOverview>>(
      `/admin/count/${id}/zone-overview/list`,
      {
        hasAuth: true,
        body,
      }
    ),

  submitCount: (countId: number) =>
    Api.post<{
      errors: { message: string }[];
    }>(`/admin/count/submit`, {
      hasAuth: true,
      body: {
        countId,
      },
    }),
  cancelCount: (countId: number) =>
    Api.post(`/admin/count/cancel`, {
      hasAuth: true,
      body: {
        countId,
      },
    }),
};

export default CountService;
