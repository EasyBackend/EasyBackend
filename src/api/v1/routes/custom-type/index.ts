import { Router } from 'express'

import customTypeCreateR from './custom-type-create'

const customTypeRouter = Router()

customTypeRouter.use('/create', customTypeCreateR)

export default customTypeRouter
