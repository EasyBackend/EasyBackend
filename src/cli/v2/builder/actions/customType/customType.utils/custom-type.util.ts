import { ICustomTypeProp } from "../../../../../../types";

// take a string[] of strings that look like 'name:type' and return : ( { "key": string, "type": string }[] )
export const getKeysAndTypes = (typeProps: string[]): ICustomTypeProp[] => {
  const keysAndTypes = typeProps?.map((prop: string) => {
    let splat = prop.split(":");
    const key = splat[0].trim();
    const type = splat[1].trim();
    return { key, type };
  });
  return keysAndTypes;
};
