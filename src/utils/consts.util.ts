// TODO: add workflow to full version
// TODO: add changelog to full version
// TODO: consider adding options for "record" types and stuff like that...
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
const toArrayTypes = (types: string[]) => {
  return [
    ...types.map((type) => `${type}[]`),
    ...types.map((type) => `[${type}]`),
  ];
};
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
