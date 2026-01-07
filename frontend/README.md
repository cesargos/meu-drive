Subindo no Heroku
BACKEND

add o "engines": {"node": "20"} no package.json

npm i -g heroku

heroku login  => faz login no browser

heroku apps => mostra as aplicações que vc possui nele


git init
npx gitignore node 
add past donwloads para não subir

git add .
git commit -m "v1"


heroku apps:create meu-drive-cs => nome unico => assim ele cria o repo no heroku mas não subiu 
git remote -v => para ver se add o repo no heroku e se esta sincronizado com ele

git push heroku master => master é a branch default do heroku


isso vai gerar uma url e vai ser mostrada no prompt
verificar no navegador


FRONTEND
Modificar em app.js a const API_URL com o novo endereço de url

git init
git add .
git commit -m "v1"


heroku apps:create meu-drive-frontend-cs
git push heroku master 



COMANDOS HEROKU
heroku logs => verificar logs em caso de erro
heroku logs -t => para travar a visualização dos logs
heroku run "df -h" --size=free => vai retornar quantidade de armazenamento usada e disponível

heroku ps:exec => entra dentro da instancia (maquina virtual) do heroku

heroku apps:delete depois passa o nome da aplicação