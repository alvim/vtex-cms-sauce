VTEX-CMS-Sauce
==============
VTEX CMS Sauce was created to allow a better deploying experience to VTEX stores. You can use it to upload several templates and files in some seconds, as an alternative to the old VTEX portal.

### Getting started
1. `npm install vtex-cms-sauce`.


2. Create your api-sauced cms handler:
```javascript
import { create } from 'vtex-cms-sauce'
const cms = create('https://STORE_NAME.vtexcommercestable.com.br')
...
```

3. Insert your VTEX ID authentication cookie when prompted.
*NOTE: You must have access to the store you're trying to work on.*

### Methods

#### Save Template
`cms.saveTemplate(templateName, HTML, isSub = false)`
* templateName **{String}** - *From this string, the templateId will be created in background.*
* HTML **{String}** - *String containing the HTML template.*
* isSub **{Boolean}** - *Pass true if subtemplate*

###### Example
```javascript
const HTML = `<!DOCTYPE html>
<head>
  <title>VTEX</title>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
`
cms
  .saveTemplate('Home', HTML)
  .then(console.log)
  .catch(console.error)
```

#### Save Shelf Template
`cms.saveShelfTemplate(templateName, HTML, shelfClass)`
* templateName **{String}** - *From this string, the templateId will be created in background.*
* HTML **{String}** - *String containing the HTML template.*
* shelfClass **{String}** - *Classname of shelf container*

###### Example
```javascript
const HTML = `
<div class="product">
  Product
</div>
`
cms
  .saveShelfTemplate('MainShelf', HTML, 'main-shelf')
  .then(console.log)
  .catch(console.error)
```

#### Save File
`cms.saveFile(filepath)`
* filepath **{String}** - *Path of file to be uploaded*

###### Example
```javascript
cms
  .saveFile('/dist/background.png')
  .then(console.log)
  .catch(console.error)
```

### Publish script example
```javascript
const path = require('path'),
    fs = require('fs'),
    create = require('vtex-cms-sauce').create,
    pjson = require('../package.json'),
    projectVars = require('../config/variables')

const cms = create(`https://${projectVars.STORE_ID}.vtexcommercestable.com.br`)
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
const templatePrefix = projectVars.TEMPLATE_PREFIX

const templatesDir = resolveApp('dist/templates')
const subtemplatesDir = resolveApp('dist/subtemplates')
const shelvesDir = resolveApp('dist/shelves')
const filesDir = resolveApp('dist/arquivos')

const getFiles = dir => fs.readdirSync(dir).filter(str => str[0] !== '_')

const sendFiles = (dir, type = 'template') => new Promise(async (resolve, reject) => {
  try {
    let logs = ''
    const files = fs.readdirSync(dir).filter(str => str[0] !== '_')

    for (let i = 0; i < files.length; i++) {
      let log
      let file = files[i]
      let content = fs.readFileSync(`${dir}/${file}`, 'utf8')

      if (type === 'template') log = await cms.saveTemplate(templatePrefix + file.replace('.html', '').replace('index', 'Home'), content)
      else if (type === 'subtemplate') log = await cms.saveTemplate(templatePrefix + file.replace('.html', ''), content, true)
      else if (type === 'shelf') log = await cms.saveShelfTemplate(templatePrefix + file.replace('.html', ''), content, 'prateleira')
      else if (type === 'file') log = await cms.saveFile(`${dir}/${file}`)

      logs += `${log}\n`
    }

    console.log(logs)
    resolve(sendFiles)
  } catch(err) {
    console.error('Error while sending files.')
    reject(sendFiles)
  }
})

sendFiles(templatesDir, 'template')
  .then(() => sendFiles(subtemplatesDir, 'subtemplate'))
  .then(() => sendFiles(shelvesDir, 'shelf'))
  .then(() => sendFiles(filesDir, 'file'))
```

## License
MIT © [Mauricio Alvim](https://github.com/alvimm)
