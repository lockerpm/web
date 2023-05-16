import axios from 'axios'
const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())
app.get('/', async (_, res) => {
  try {
    const pageData = await axios.get(
      'https://notion.cystack.workers.dev/v1/table/49d6e649b29f41d9991ad5cda91329c8'
    )
    res.json({ data: pageData.data })
  } catch (error) {
    if (error.response) {
      return res
        .status(error.response.status)
        .json({ statusCode: error.response.status })
    }
    return res.status(404).json({ statusCode: 404 })
  }
})

module.exports = app
