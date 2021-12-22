const primitiveTypes = [
  "string",
  "str",
  "number",
  "num",
  "int",
  "undefined",
  "null",
  "boolean",
  "bool",
  "symbol",
  "sym",
];
const objectTypes = [
  "Object",
  "Array",
  "Function",
  "Map",
  "RegExp",
  "Set",
  "Date",
];
const toArrayTypes = (types: string[]) => [
  ...types.map((type) => `${type}[]`),
  ...types.map((type) => `[${type}]`),
];
const allTypesAsArrays = [
  ...toArrayTypes(objectTypes),
  ...toArrayTypes(primitiveTypes),
];
export const allowedTypes = {
  arrayTypes: allTypesAsArrays,
  primitiveTypes,
  objectTypes,
  customTypes: [],
};
