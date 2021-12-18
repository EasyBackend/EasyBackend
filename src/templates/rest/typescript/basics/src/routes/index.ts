import express from 'express'
import v1 from './v1'

const api = express.Router()
api.use('/v1', v1)

export default api
