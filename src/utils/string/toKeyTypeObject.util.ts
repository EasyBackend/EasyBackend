import { capitalizeFirstLetter } from ".";

type keyTypeObj = {
  key: string;
  type: string;
};

const fromStringToKeyTypeObj = (
  typeProps: string[],
  capitalizeTypes?: boolean
): {
  key: string;
  type: string;
}[] => {
  return typeProps.map((typeProp: string) => {
    const splatTypeProp = typeProp.split(":");

    const key = splatTypeProp[0];
    const type = splatTypeProp[1].trim();

    return capitalizeTypes
      ? { key, type: capitalizeFirstLetter(type) }
      : { key, type };
  });
};

const fromKeyTypeObjToString = (typeProps: keyTypeObj[]): string[] => {
  return typeProps.map((typeProp: keyTypeObj) => {
    return `${typeProp.key} : ${typeProp.type}`;
  });
};

export const fromTypePropsToSchemaProps = (typeProps: string[]): string[] => {
  const keyTypeObjs = fromStringToKeyTypeObj(typeProps, true);
  return fromKeyTypeObjToString(keyTypeObjs);
};
