VTEX-CMS-Sauce
==============
VTEX package for handling CMS requests
--------------------------------------
*This package is not official and may be deprecated as a result of any future changes to the VTEX portal. Before that, use it freely and wisely.*

## :warning: Warning! :warning:
*VTEX-CMS-Sauce was created to allow a better deploying experience for VTEX shops. Therefore, it's recommended to use it in a brand new environment, to minimize the risk of overwriting existing templates. The chances are almost null, but I thought I should warn you.*

### Getting started
1. `npm install vtex-cms-sauce`.

2. Create a `.vtexid` config file in project root with the following content:
```
{
  "login": "your-email@something.com",
  "password": "your-password"
}
```
*NOTE: You must have access to the store you're trying to work on.*

3. Create your api-sauced cms handler:
```
import { create } from 'vtex-cms-sauce'
const cms = create('https://STORE_NAME.vtexcommercestable.com.br')
...
```

### Methods

#### Save Template
`cms.saveTemplate(templateName, HTML, isSub = false)`
* templateName **{String}** - *From this string, the templateId will be created in background.*
* HTML **{String}** - *String containing the HTML template.*
* isSub **{Boolean}** - *Pass true if subtemplate*

###### Example
```
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
```
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

#### Save file
**To do** :pencil2: