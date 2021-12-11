export interface IDatabaseSchemaProp {
  key: string;
  type: string;
}

export interface ISchemaCreationParams {
  schemaProps: string[];
  schemaName: string;
  uniqueProperty: string;
  requiredProps: string[];
}
