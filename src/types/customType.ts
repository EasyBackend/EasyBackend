export interface ICustomTypeProp {
  key: string;
  type: string;
}

export interface ICustomTypeCreationParams {
  typeProps: string[];
  typeName: string;
  dbSchema: boolean;
}
