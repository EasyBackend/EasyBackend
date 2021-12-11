import { ICustomTypeCreationParams } from "../../../types";

export const createTextInterface = ({
  typeProps,
  typeName,
}: Omit<ICustomTypeCreationParams, "dbSchema">) => {
  const declaration = `export interface ${typeName}`;

  const interfaceBody = `{
        ${typeProps}
    }`;

  const textInterface = declaration + interfaceBody;

  return textInterface;
};
