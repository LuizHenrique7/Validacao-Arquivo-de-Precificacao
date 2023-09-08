README.md - Sistema de Validação e Atualização de Preços 

Este é um sistema de validação e atualização de preços de produtos. Ele consiste em duas partes: o frontend, desenvolvido em React, e o backend, construído com Node.js, Express e MySQL. O sistema permite fazer o upload de um arquivo contendo informações de produtos, validar essas informações e, se todas estiverem corretas, atualizar os preços dos produtos no banco de dados. 

Funcionalidades 

Frontend 

O frontend é uma interface web desenvolvida com React que permite aos usuários realizar as seguintes ações: 

Upload de arquivo: Os usuários podem selecionar um arquivo contendo informações de produtos para serem validadas e atualizadas. 

Validação de produtos: Após o upload do arquivo, o sistema valida as informações dos produtos. As validações incluem verificar se todos os campos obrigatórios estão preenchidos, se os preços de venda são maiores que os custos e se os reajustes de preço estão dentro dos limites permitidos. 

Exibição de produtos validados: Os produtos validados são exibidos em uma lista na interface do usuário, mostrando informações como código, nome, custo, preço de venda e quaisquer erros de validação encontrados. 

Botão de Atualização: Se todos os produtos estiverem validados com sucesso, o botão "ATUALIZAR" é habilitado. Ao clicar neste botão, os preços dos produtos são atualizados no banco de dados. 

Backend 

O backend é uma API REST construída com Node.js e Express e utiliza o banco de dados MySQL para armazenar informações de produtos. Ele oferece as seguintes funcionalidades: 

Upload de arquivo: O endpoint /products permite o upload de um arquivo contendo informações de produtos em formato CSV. O arquivo é lido linha por linha, as informações são validadas e os produtos são retornados em formato JSON com seus erros de validação, se houverem. 

Atualização de preços: O endpoint /update-prices permite a atualização dos preços de venda de produtos no banco de dados. Ele recebe uma lista de produtos a serem atualizados e verifica se o código do produto existe no banco de dados. Os registros afetados são atualizados com os novos preços de venda. 

 

Configuração 

Antes de executar o sistema, certifique-se de ter configurado o ambiente corretamente: 

 

Backend 

Certifique-se de ter o Node.js e o Yarn instalados em seu sistema. 

Instale o MySQL e crie um banco de dados com o nome shopper. Certifique-se de atualizar as configurações de conexão no arquivo backend/db.ts se necessário. 

Navegue até a pasta do backend (/backend) no terminal. 

Execute yarn install para instalar as dependências. 

Execute yarn dev para iniciar o servidor de desenvolvimento do backend. 

 

Frontend 

Certifique-se de ter o Node.js e o npm instalados em seu sistema. 

Navegue até a pasta do frontend (/frontend) no terminal. 

Execute npm install para instalar as dependências. 

Abra o arquivo frontend/src/FileUpload.js e atualize a URL da API para o endpoint correto, se necessário. 

Execute npm start para iniciar o servidor de desenvolvimento do frontend. 

Uso 

Acesse o frontend em seu navegador. O sistema deve estar em execução no endereço http://localhost:3000. 

Selecione um arquivo contendo informações de produtos no formato CSV e clique no botão "VALIDAR". 

Os produtos válidos e inválidos serão exibidos na lista. 

Se todos os produtos estiverem válidos, o botão "ATUALIZAR" será habilitado. Clique nele para atualizar os preços no banco de dados. 