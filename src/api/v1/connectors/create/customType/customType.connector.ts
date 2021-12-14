import { createCustomType } from "../../../../../controllers/v1";

export const createCustomTypeFromAPI = async (req: Request, res: Response) => {
  // TODO: fix any
  const customTypeCreationParams: any = req.body;

  await createCustomType(customTypeCreationParams);
};

export const createCustomTypeFromJSON = async () => {};
