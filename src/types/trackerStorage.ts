export enum StorageType {
  typeCreationName = "typeCreationName",
  typeCreationProps = "typeCreationProps",
  confirmTypeCreation = "confirmTypeCreation",
}
export interface ITrackerStorage {
  key: StorageType;
  value: any;
}
