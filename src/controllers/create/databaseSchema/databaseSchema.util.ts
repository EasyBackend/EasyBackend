import { ISchemaCreationParams } from "../../../types";
import { fromTypePropsToSchemaProps } from "../../../utils/string";

export const createTextDatabaseSchema = async ({
  schemaProps,
  schemaName,
  uniqueProperty,
  requiredProps,
}: ISchemaCreationParams) => {
  const schemaVariableName = `${schemaName}MongoSchema`;
  // imhere
  const declaration = `const ${schemaVariableName}: Schema = new mongoose.Schema`;

  schemaProps;
  const test = await parsePropsForDatabaseSchema({
    typeProps: schemaProps,
    uniqueProperty,
    requiredProps,
  });

  const body = `({
      ${schemaProps}
    })`;

  const transformStatement = `${schemaVariableName}.set('toJSON', {
      transform: (_: any, returnedObject: any) => {
        delete returnedObject.__v;
      },
    });`;
};

const parsePropsForDatabaseSchema = async ({
  typeProps,
  requiredProps,
  uniqueProperty,
}: {
  typeProps: string[];
  requiredProps: string[];
  uniqueProperty: string | null;
}) =>
  // : Promise<string[]>
  {
    const schemaProps = fromTypePropsToSchemaProps(typeProps);

    console.log("finished the walk, schemaProps are:::: ", schemaProps);
  };
