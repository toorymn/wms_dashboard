export const WAREHOUSES = [
  {
    code: "V9001",
  },
  {
    code: "WH0002",
  },
];

export enum COUNT_STATUS {
  STARTED = "STARTED",
  CANCELLED = "CANCELLED",
  DONE = "DONE",
}

export const COUNT_STATUS_LABEL: Record<COUNT_STATUS, string> = {
  [COUNT_STATUS.STARTED]: "Идвэхтэй",
  [COUNT_STATUS.CANCELLED]: "Хүчингүй болгосон",
  [COUNT_STATUS.DONE]: "Хаагдсан",
};
