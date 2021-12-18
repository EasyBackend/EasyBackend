export enum DatabaseStorageType {
  schemaName = 'schemaName',
  schemaProps = 'schemaProps',
  requiredProps = 'requiredProps',
  confirmSchemaCreation = 'confirmSchemaCreation',
  uniqueProperty = 'uniqueProperty',
}

export enum InterfaceStorageType {
  typeName = 'typeCreationName',
  typeCreationProps = 'typeCreationProps',
  confirmTypeCreation = 'confirmTypeCreation',
  includeDBSchema = 'includeDBSchema',
  uniqueProperty = 'uniqueProperty',
}

export type TrackerStorageTypes = InterfaceStorageType | DatabaseStorageType
export interface ITrackerStorage {
  key: TrackerStorageTypes
  value: any
}
