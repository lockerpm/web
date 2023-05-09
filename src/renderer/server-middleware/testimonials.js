import axios from 'axios'
const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())
app.get('/', async (_, res) => {
  try {
    const pageData = await axios.get(
      'https://notion.cystack.workers.dev/v1/table/cc28659eea844e54bab556bf11abdbd1'
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
