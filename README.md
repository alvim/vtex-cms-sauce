VTEX-CMS-Sauce
==============
VTEX package for handling CMS requests
--------------------------------------
*This package is not official and may be deprecated as a result of any future changes to the VTEX portal. Before that, use it freely and wisely.*

## :warning: Warning! :warning:
*VTEX-CMS-Sauce was created to allow a better deploying experience for VTEX shops. Therefore, it's recommended to use it in a brand new environment, to minimize the risk of overwriting existing templates. The chances are almost null, but I thought I should warn you.*

### Getting started
To use it, first install with: `npm install vtex-cms-sauce`.

### Methods

#### Save Template
`cms.saveTemplate(templateName, HTML)`
* templateName **{String}** - *From this string, the templateId will be created in background.*
* HTML **{String}** - *String containing the HTML template.*

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
