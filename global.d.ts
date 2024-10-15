declare global {
  interface Item {
    id: string;
    name: string;
    shortName: string;
    basePrice: number;
    lastLowPrice: number;
  }
}
export {};
