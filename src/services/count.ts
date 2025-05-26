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

export interface InternalJournalItem {
  l1Id: number;
  itemNo: string;
  binCode: string;
  createdAt: string;
  description: string;
  unitOfMeasureCode: string;
  level1WorkerUsername: string;
  level1WorkerFirstName: string;
  level1WorkerLastName: string;
  level2WorkerUsername: string;
  level2WorkerFirstName: string;
  level2WorkerLastName: string;
  zone: number;
  level1Quantity: number | null;
  l2Id: number;
  level2Quantity: number | null;
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
  
}


export interface GetCountListParams extends PaginationRequest {
  status?: string;
  wareHouse?: string;
  batchName?: string;
}

export interface GetCountInternalJournalParams extends PaginationRequest {}

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
    Api.post<ListResponse<InternalJournalItem>>(`/admin/count/${id}/internal-journal`, {
      hasAuth: true,
      body,
    }),
  getCountWareHouseJournal: (id: number, body: GetCountInternalJournalParams) =>
    Api.post<ListResponse<WareHouseCountJournalItem>>(`/admin/count/${id}/warehouse-journal`, {
      hasAuth: true,
      body,
    }),
  createCount: (body: CreateCountParams) =>
    Api.post("/admin/count/create", {
      hasAuth: true,
      body,
    }),
};

export default CountService;
