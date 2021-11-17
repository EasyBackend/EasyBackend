import { ICustomTypeCreationParams } from "../../../../../types";

import { validateCustomTypeBeforeCreation } from "../../../../../cli/v2/builder/actions/customType/customType.validations/input-validations";
import { ValidationRes } from "../../../../../utils";

/**
 * @param { ICustomTypeCreationParams } ICustomTypeCreationParams
 */
export const createCustomType = async (
  customTypeCreationParams: ICustomTypeCreationParams
) => {
  const { isValid, message } = await validateCustomTypeBeforeCreation(
    customTypeCreationParams
  );
  if (isValid === ValidationRes.VALID) {
  } else {
    console.log(message);
  }
};
