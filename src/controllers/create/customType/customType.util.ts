import { ICustomTypeCreationParams } from "../../../types";

export const createTextInterface = ({
  typeProps,
  typeName,
}: ICustomTypeCreationParams) => {
  const declaration = `export interface ${typeName}`;

  const interfaceBody = `{
        ${typeProps}
    }`;

  const textInterface = declaration + interfaceBody;

  return textInterface;
};
