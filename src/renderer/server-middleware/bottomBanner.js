import axios from 'axios'
const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())
app.get('/', async (req, res) => {
  try {
    const pageData = await axios.get(
      'https://notion.cystack.workers.dev/v1/table/bc0065872717477b828ec880194b2370'
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
