import axios from 'axios'
import { NOTION_WORKER_API } from './constant'
const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())
app.get('/:id', async (req, res) => {
  try {
    const pageData = await axios.get(NOTION_WORKER_API.concat(`/${req.params.id}`))
    res.json({ data: pageData.data })
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ statusCode: error.response.status })
    }
    return res.status(404).json({ statusCode: 404 })
  }
})

module.exports = app
