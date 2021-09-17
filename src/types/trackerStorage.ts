export enum StorageType {
  typeCreationName = "typeCreationName",
  typeCreationProps = "typeCreationProps",
  confirmTypeCreation = "confirmTypeCreation",
}
export interface ITrackerStorage {
  as: StorageType;
  value: any;
}
