export enum COUNT_STATUS {
  STARTED = "STARTED",
  CANCELLED = "CANCELLED",
  DONE = "DONE",
}

export const COUNT_STATUS_LABEL: Record<COUNT_STATUS, string> = {
  [COUNT_STATUS.STARTED]: "Эхэлсэн",
  [COUNT_STATUS.CANCELLED]: "Хүчингүй болгосон",
  [COUNT_STATUS.DONE]: "Илгээгдсэн",
};

const cubageConverter = (cm: number) => {
  const m3 = cm / 1000000;
  return m3;
};
export { cubageConverter };
