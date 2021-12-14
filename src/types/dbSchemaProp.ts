export type dbSchemaProp = {
  key: string;
  type: string;
  // required: boolean;
  // unique: boolean;
};

export interface ISchemaCreationParams {
  schemaProps: string[];
  schemaName: string;
  uniqueProperty: string;
  requiredProps: string[];
}
