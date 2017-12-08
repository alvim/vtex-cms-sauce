# VTEX Template

Boilerplate de projeto Rex para VTEX.

## Iniciando um novo projeto

Requisitos:

* Node.js
* NPM

## Instruções

#### 1. Faça um novo fork deste repositório.
No novo projeto, adicione `vtex-template` como um remote de nome "upstream":
```
git remote add upstream git@bitbucket.org:OriginalTechExperiences/vtex-template.git
```

#### 2. Inicie o Git Flow
Execute o comando `git flow init` e aceite as sugestões de nomenclatura de branches padrão.
A partir de agora, seu projeto tem o seguinte modelo de branches:
```
branches de releases
      __||__
     |     |
     |     |        branches de feature----------------
     |     |       /
     |     develop-------------------------------------
     |    /
     master--------------------------------------------
    /
upstream (vtex-template)-------------------------------
```

#### 3. `npm install`

#### 4. Substitua as variáveis no arquivo `config/variables.js`

#### 5. Scripts
##### Start
Para desenvolvimento local, execute: `npm run start`.
##### Build
Para gerar os arquivos finais, execute: `npm run build`.
##### Deploy
Antes de publicar um template, crie um arquivo `.vtexid` na raíz do projeto com o conteúdo:
```json
{
  "login": "seuemail@originalgtx.io",
  "password": "suasenha"
}
```

Para publicar o template diretamente no portal da VTEX, rode o comando: 
```
npm run deploy
```

### Rebase
Sempre que o Upstream (vtex-template) for atualizado, seu projeto pode executar:

```
git fetch upstream
git rebase upstream/master
```

### Pug

##### Novas rotas
Todo arquivo `.pug` criado sob o diretório `src/pug/templates` cria uma nova rota html de mesmo nome.
Por exemplo: `src/pug/templates/produto.pug` criará a rota `localhost:8080/produto.html`.

*¹ Pra cada rota nova criada, o ambiente deve ser reiniciado, caso já esteja sendo exeutado.*

*² Modificações nos arquivos Pug não estão sujeitas a _Hot Module Replacement_. Deve-se forçar o refresh da página a cada modificação dos arquivos.*

### Trabalhando com imagens
Toda imagem utilizada no projeto deve ser armazenada na pasta `src/arquivos`. Só serão compiladas para o build final as imagens que forem efetivamente usadas.
Dessa forma, caso uma imagem seja salva na pasta `src/arquivos`, mas não sofra `require` ou `import` ao longo do template, ela não será compilada no build.
Todas as imagens utilizadas serão otimizadas pelo `imagemin-webpack-plugin`.

#### Inserindo imagens no Pug
```pug
.cart
	img(src=require('../../arquivos/icon.png'))
```

### Adicionando polyfills
Polyfills devem ser adicionados no arquivo `config/polyfills.js`, pois ele é importado antes de todo o código do projeto.

### Deploy
Todos os arquivos em `src/pug/templates`, `src/pug/subtemplates` e `src/pug/shelves`, serão compilados para pastas de mesmo nome. Após compilados, quando submetidos ao deploy, cada html será salvo na loja como seu respectivo tipo (ex.: shelf, subtemplate ou template).
Se for necessário criar novos arquivos que sejam reaproveitados pelo projeto, mas que não devem ser publicados por si só, deve-se criar uma nova pasta para isso. Por exemplo: `src/pug/components`.

### Troubleshooting
