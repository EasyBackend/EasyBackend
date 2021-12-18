import { Request, Response } from 'express'
import { createCustomType } from '../../../../../controllers/v1'
import Logger from '../../../../../logger/logger'
import { ICustomTypeCreationParams } from '../../../../../types'

export const createCustomTypeFromAPI = async (req: Request, res: Response) => {
  const customTypeCreationParams: ICustomTypeCreationParams = req.body
  Logger.info(res)

  await createCustomType(customTypeCreationParams)
}

export const createCustomTypeFromJSON = async () => {}
