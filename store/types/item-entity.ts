export interface ItemEntity {
  value: string;
  label?: string;
  hexCode?: string;
  id?: number;
}

export interface ItemEntityWithId extends ItemEntity {
  id: number;
}
