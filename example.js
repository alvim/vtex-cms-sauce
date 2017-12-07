const create = require('vtex-cms-sauce').create

const storeName = 'originalmedia'
const cms = create(`https://${storeName}.vtexcommercestable.com.br`)

const HTML = `<!DOCTYPE html>
<html>
  <head>
    <title>VTEX</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
`

const reqs = [1, 2]

async function Publish() {
  for (r of reqs) {
    const log = await cms.saveTemplate('Home', HTML)
    console.log(log)
  }
}

Publish()
