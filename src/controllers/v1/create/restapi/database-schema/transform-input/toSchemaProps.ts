import { dbSchemaProp } from "../../../../../../types";
import { capitalizeFirstLetter } from "../../../../../../utils/string";

export const fromTypePropsToSchemaProps = ({
  typeProps,
  requiredProps,
  uniqueProperty,
}: {
  typeProps: string[];
  requiredProps: string[];
  uniqueProperty: string | null;
}): string[] => {
  const keyTypeObjs = fromStringToKeyTypeObj(typeProps);

  const schemaProps: string[] = keyTypeObjs.map((prop: dbSchemaProp) => {
    let propAsString = `${prop.key}: ${prop.type.toLowerCase()}`;

    const isRequiredProperty = requiredProps.includes(propAsString);
    const isUniqueProperty = uniqueProperty === propAsString;

    return `${prop.key?.trim()}: { type: ${
      prop.type
    }, unique: ${isUniqueProperty}, required: ${isRequiredProperty} }`;
  });

  return schemaProps;
};

const fromStringToKeyTypeObj = (typeProps: string[]): dbSchemaProp[] => {
  return typeProps.map((typeProp: string) => {
    const splatTypeProp = typeProp.split(":");

    const key = splatTypeProp[0].trim();
    const type = splatTypeProp[1].trim();

    const parsedType = parseType(type);

    return { key, type: parsedType };
  });
};

const parseType = (type: string) => {
  const isArrayType = type.includes("]");

  if (type === "Int") {
    // mongo DB schemas use Number not Int
    type = "Number";
  } else if (isArrayType) {
    const typeWithoutBrackets = type.replace("[", "").replace("]", "");

    let capitalizedTypeWithoutBrackets =
      capitalizeFirstLetter(typeWithoutBrackets);

    if (capitalizedTypeWithoutBrackets === "Int") {
      capitalizedTypeWithoutBrackets = "Number";
    }

    type = `[${capitalizedTypeWithoutBrackets}]`;
  }

  return type;
};
