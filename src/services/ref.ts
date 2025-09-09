import Api from "./api";

interface WareHouse {
  name: string;
  code: string;
  description: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}
const ReferenceService = {
  warehouses: () => Api.get<WareHouse[]>("/reference/warehouse/list", {}),
};

export default ReferenceService;
