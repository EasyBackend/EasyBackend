import Logger from '../../../../../logger/logger'
import { ISchemaCreationParams } from '../../../../../types'
import { ValidationRes } from '../../../../../utils'

export const validateSchemaBeforeCreation = async (
  schemaCreationParams: ISchemaCreationParams
): Promise<{ isValid: ValidationRes; message: string }> => {
  Logger.info('Not implemented yet, ', schemaCreationParams)

  return {
    isValid: ValidationRes.VALID,
    message: 'yay',
  }
}
