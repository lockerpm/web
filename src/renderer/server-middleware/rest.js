import { ANCESTOR_ID } from './constant'
const bodyParser = require('body-parser')
const app = require('express')()
const cors = require('cors')
app.use(cors())
app.use(bodyParser.json())

const NOTION_TOKEN = process.env.NOTION_API_KEY || ''
const { Client } = require('@notionhq/client')
const notion = new Client({ auth: NOTION_TOKEN })

app.get('/articles', async (req, res) => {
  const language = req.query.language || 'en'
  try {
    const result = []
    const promise = []
    const categories = await retrieveBlockChildren(
      language === 'vi' ? ANCESTOR_ID[1] : ANCESTOR_ID[0]
    )
    for (const block of categories) {
      promise.push(retrieveBlockChildren(block.id))
    }
    const results = await Promise.all(promise)
    for (let i = 0; i < results.length; i++) {
      result.push({ ...categories[i], children: results[i] })
    }
    res.send({ data: result })
  } catch (error) {
    if (error.response) {
      return res
        .status(error.response.status)
        .json({ statusCode: error.response.status })
    }
    return res.status(404).json({ statusCode: 404 })
  }
})
app.get('/articles/:id', async (req, res) => {
  try {
    const result = await retrievePageInfo(req.params.id)
    res.json({ ...result })
  } catch (error) {
    if (error.response) {
      return res
        .status(error.response.status)
        .json({ statusCode: error.response.status })
    }
    return res.status(404).json({ statusCode: 404 })
  }
})
app.get('/categories/:id', async (req, res) => {
  try {
    const result = await retrieveBlockChildren(req.params.id)
    res.json({ ...result })
  } catch (error) {
    if (error.response) {
      return res
        .status(error.response.status)
        .json({ statusCode: error.response.status })
    }
    return res.status(404).json({ statusCode: 404 })
  }
})
const retrieveBlockChildren = async pageId => {
  try {
    const result = []
    // const blockData = await axios.get(`${NOTION_API}/blocks/${pageId}/children?page_size=100`, { headers: notionHeaders }, { timeout: 5000 })
    const blockData = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100
    })
    for (const child of blockData.results) {
      if (child.type === 'child_page') {
        result.push(child)
      }
    }
    return result
  } catch (error) {
    // console.log(error)
    return []
  }
}
const retrievePageInfo = async pageId => {
  try {
    // const pageObj = await axios.get(`${NOTION_API}/pages/${pageId}`, { headers: notionHeaders }, { timeout: 5000 })
    // const data = pageObj.data
    const data = await notion.pages.retrieve({ page_id: pageId })
    return {
      id: data.id,
      title: data.properties.title.title[0].plain_text,
      parent: data.parent.page_id
    }
  } catch (error) {
    // console.log(error)
    return {}
  }
}
module.exports = app
