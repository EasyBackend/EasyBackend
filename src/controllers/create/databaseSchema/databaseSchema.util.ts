import { ISchemaCreationParams } from "../../../types";
import { fromStringToKeyTypeObj } from "../../../utils/string";

export const createTextDatabaseSchema = async ({
  schemaProps,
  schemaName,
  uniqueProperty,
}: ISchemaCreationParams) => {
  const schemaVariableName = `${schemaName}MongoSchema`;
  // imhere
  const declaration = `const ${schemaVariableName}: Schema = new mongoose.Schema`;

  const body = `({
      ${await parsePropsForDatabaseSchema({
        typeProps: schemaProps,
        uniqueProperty,
      })}
    })`;

  const transformStatement = `${schemaVariableName}.set('toJSON', {
      transform: (_: any, returnedObject: any) => {
        delete returnedObject.__v;
      },
    });`;
};

const parsePropsForDatabaseSchema = async ({
  typeProps,
  uniqueProperty,
}: {
  typeProps: string[];
  uniqueProperty: string | null;
}): Promise<string[]> => {
  const keyTypeObjects = fromStringToKeyTypeObj(typeProps);

  typeProps = keyTypeObjects.map((keyTypeObj) => {
    // imhere
  });
};
