# Casos de Testes e Testes automatizados

- [**Testes de API para Gerenciamento de Receitas**](#1-testes-de-autenticação)
- [**Testes de Sistema**](#testes-de-sistema)
- [**Testes unitários automatizados**](#testes-unitários-automatizados)


## **Jest:**
Para conferir os testes automatizados, no terminal, execute:
```
  npm run test
```


## **1. Testes de Autenticação**
Estes testes verificam se o sistema de autenticação funciona corretamente ao registrar e fazer login de usuários.

### **1.1 Registrar um Novo Usuário**
- **Objetivo:** Garantir que um usuário possa se registrar com sucesso.
- **Requisição:**
  - Método: `POST`
  - Endpoint: `/api/auth/register`
  - Corpo da Requisição:
    ```json
    {
      "name": "Usuário Teste",
      "email": "usuarioteste@email.com",
      "password": "senhaSegura123"
    }
    ```
- **Resposta Esperada:**
  - Status: `201 Created`
  - Corpo da Resposta:
    ```json
    {
      "id": 1,
      "name": "Usuário Teste",
      "email": "usuarioteste@email.com"
    }
    ```

### **1.2 Fazer Login de um Usuário Existente**
- **Objetivo:** Validar a funcionalidade de login do usuário.
- **Requisição:**
  - Método: `POST`
  - Endpoint: `/api/auth/login`
  - Corpo da Requisição:
    ```json
    {
      "email": "usuarioteste@email.com",
      "password": "senhaSegura123"
    }
    ```
- **Resposta Esperada:**
  - Status: `200 OK`
  - Corpo da Resposta:
    ```json
    {
      "token": "<jwt_token>"
    }
    ```

---

## **2. Testes de Gerenciamento de Receitas**
Estes testes garantem que a criação, recuperação e exclusão de receitas funcionem corretamente, mantendo a autenticação e a integridade dos dados.

### **2.1 Criar uma Nova Receita**
- **Objetivo:** Verificar se um usuário autenticado pode criar uma receita.
- **Requisição:**
  - Método: `POST`
  - Endpoint: `/api/recipes`
  - Cabeçalhos:
    ```json
    {
      "Authorization": "Bearer <jwt_token>"
    }
    ```
  - Corpo da Requisição:
    ```json
    {
      "title": "Bolo de Cenoura",
      "ingredients": "Cenoura, Farinha, Açúcar...",
      "instructions": "Misture tudo e asse por 40 minutos."
    }
    ```
- **Resposta Esperada:**
  - Status: `201 Created`
  - Corpo da Resposta:
    ```json
    {
      "id": 1,
      "title": "Bolo de Cenoura",
      "ingredients": "Cenoura, Farinha, Açúcar...",
      "instructions": "Misture tudo e asse por 40 minutos.",
      "userId": 1
    }
    ```

### **2.2 Recuperar Receitas do Usuário Autenticado**
- **Objetivo:** Garantir que apenas usuários autenticados possam recuperar suas próprias receitas.
- **Requisição:**
  - Método: `GET`
  - Endpoint: `/api/recipes`
  - Cabeçalhos:
    ```json
    {
      "Authorization": "Bearer <jwt_token>"
    }
    ```
- **Resposta Esperada:**
  - Status: `200 OK`
  - Corpo da Resposta:
    ```json
    [
      {
        "id": 1,
        "title": "Bolo de Cenoura",
        "ingredients": "Cenoura, Farinha, Açúcar...",
        "instructions": "Misture tudo e asse por 40 minutos.",
        "userId": 1
      }
    ]
    ```

### **2.3 Impedir a Criação de Receita sem Autenticação**
- **Objetivo:** Garantir que usuários não autenticados não possam criar receitas.
- **Requisição:**
  - Método: `POST`
  - Endpoint: `/api/recipes`
  - Corpo da Requisição:
    ```json
    {
      "title": "Receita Não Autorizada",
      "ingredients": "Desconhecido",
      "instructions": "Sem instruções disponíveis."
    }
    ```
- **Resposta Esperada:**
  - Status: `401 Unauthorized`
  - Corpo da Resposta:
    ```json
    {
      "message": "Token não fornecido"
    }
    ```

### **2.4 Excluir uma Receita**
- **Objetivo:** Garantir que um usuário autenticado possa excluir sua própria receita.
- **Requisição:**
  - Método: `DELETE`
  - Endpoint: `/api/recipes/{id}`
  - Cabeçalhos:
    ```json
    {
      "Authorization": "Bearer <jwt_token>"
    }
    ```
- **Resposta Esperada:**
  - Status: `200 OK`
  - Corpo da Resposta:
    ```json
    {
      "message": "Receita excluída com sucesso"
    }
    ```

---
## Testes de Sistema

**Título:** ListUserIngredients qualquer  
**Nível:** Teste de sistema  

### Descrição:
A assistente de receitas espera como entrada os ingredientes separados por ponto e vírgula (;).  
Testar entrada qualquer que não seja um ingrediente real.  

**Entrada:** `"  ; ASDas ; lápis"`  

**Saída esperada:** Receita com título aleatório criada pela IA, seguida das 10 primeiras imagens do Google Images sobre o título da receita gerada.  

**Saída real:** "Receita" com título aleatório criada pela IA, seguida das 10 primeiras imagens do Google Images sobre o título da receita gerada e uma "tabela nutricional" com os "ingredientes listados".  

**Comentários:** O teste mostrou que o sistema mantém o comportamento esperado mesmo numa situação de entrada inesperada/absurda.  

---


**Título:** ListUserIngredients vazia  
**Nível:** Teste de sistema  

### Descrição:
A assistente de receitas espera como entrada os ingredientes separados por ponto e vírgula (;).  
Testar entrada vazia.  

**Entrada:** string vazia  

**Saída esperada:** Receita com título aleatório criada pela IA, seguida das 10 primeiras imagens do Google Images sobre o título da receita gerada.  

**Saída real:** Receita não foi gerada, log no console de erro indicando o erro de leitura de uma string vazia.  

**Comentários:** O teste mostrou a necessidade de implementar uma resposta ao usuário quando a solicitação não foi bem-sucedida.  

---

## Testes Unitários automatizados

**Título:** ClearJson "bem formado"  
**Nível:** Teste unitário  

### Descrição:
A função `clearJson()` recebe como parâmetro uma string que contém uma substring que é um JSON, então ela "limpa" a string inicial e retorna um JSON com essa substring.  
Executar `clearJson()` com um JSON "bem formado" e conferir o resultado esperado.  

**Entrada:** `" {\"nome\": \"João\", \"idade\": 25} "`  

**Saída esperada:** `{ nome: "João", idade: 25 }`  

**Saída real:** _[Preencher resultado real]_  

**Comentários:** _[Preencher comentários sobre o teste]_  

---


**Título:** ClearJson "mal formado"  
**Nível:** Teste unitário  

### Descrição:
A função `clearJson()` recebe como parâmetro uma string que contém uma substring que é um JSON, então ela "limpa" a string inicial e retorna um JSON com essa substring.  
Executar `clearJson()` com um JSON "mal formado" e conferir o resultado esperado.  

**Entrada:** `" {\"nome\": \"Maria\", \"idade\": "`  

**Saída esperada:** Lançamento de um erro `"Erro ao analisar o JSON"`  

**Saída real:** Lançamento de um erro `"Erro ao analisar o JSON"`  

**Comentários:** O teste demonstrou que a função tem o comportamento esperado em situações de entrada inesperada; tal comportamento é tratado de maneira apropriada.  

**Título:** Salvar token no localStorage
**Nível:** Teste unitário

### Descrição:
Testa se a função saveToken() do authService armazena corretamente o token no `localStorage`.

**Entrada:** `saveToken("fake-token")`

**Saída Esperada:** `localStorage.getItem("nutrichef_token") === "fake-token"`

**Saída Real:** `localStorage.getItem("nutrichef_token") === "fake-token"`

**Comentários:** O teste validou que o token foi armazenado corretamente no localStorage sob a chave `nutrichef_token.`

**Título:** Recuperar token do localStorage
**Nível:** Teste Unitário

### Descrição:
Testa se a função `getToken()` do `authService` consegue recuperar corretamente um token previamente armazenado no localStorage.

**Entrada:** `localStorage.setItem("nutrichef_token", "fake-token")` e chamada de `getToken()`

**Saída Esperada:** `"fake-token"`

**Saída Real:** `"fake-token"`

**Comentários:** O teste demonstrou que a função consegue acessar corretamente o valor do token no localStorage.

**Título:** Remover token do localStorage
**Nível:** Teste unitário

### Descrição:
Testa se a função `removeToken()` do `authService` remove corretamente o token armazenado no localStorage.

**Entrada:** `localStorage.setItem("nutrichef_token", "fake-token")` e chamada de `removeToken()`

**Saída Esperada:** `localStorage.getItem("nutrichef_token") === null`

**Saída Real:** `localStorage.getItem("nutrichef_token") === null`

**Comentários:** O teste confirmou que o token foi removido com sucesso do localStorage.

**Título:** Verificar autenticação com token presente
**Nível:** Teste unitário

### Descrição: 
Testa se a função isAuthenticated() retorna true quando existe um token armazenado.

**Entrada:** `localStorage.setItem("nutrichef_token", "fake-token")` e chamada de `isAuthenticated()`

**Saída Esperada:** `true`

**Saída Real:** `true`

**Comentários:** A autenticação é corretamente reconhecida quando um token válido está presente no localStorage.

**Título:** Verificar autenticação sem token
**Nível:** Teste unitário

### Descrição:
Testa se a função isAuthenticated() retorna false quando não há token no localStorage.

**Entrada:** `localStorage.clear()` e chamada de `isAuthenticated`()`

**Saída Esperada:** `false`

**Saída Real:** `false`

**Comentários:** O teste validou o comportamento esperado da função em cenário de ausência de autenticação.

**Título:** Retorno correto de 10 imagens da API
**Nível:** Teste unitário

### Descrição:
Testa se a função getRecipeImage() retorna corretamente 10 imagens quando a resposta da API contém 10 resultados.

**Entrada:** `"bolo de cenoura"`

**Saída Esperada:** Array com 10 URLs de imagens começando por `"https://img0.jpg"`

**Saída Real:** Array com 10 URLs de imagens começando por `"https://img0.jpg"`

**Comentários:** A função foi capaz de processar corretamente a resposta da API e retornar exatamente 10 imagens no formato esperado.

**Título:** Lançamento de erro em falha de rede
**Nível:** Teste unitário

### Descrição:
Verifica se a função getRecipeImage() lança um erro quando a chamada de fetch falha.

**Entrada:** `"pizza"`

**Saída Esperada:** Lançamento do erro `"Network error"`

**Saída Real:** Lançamento do erro `"Network error"`

**Comentários:** O tratamento de erros por falha de rede funciona conforme esperado.

**Título:** Lançamento de erro em estrutura de resposta inválida
**Nível:** Teste unitário

### Descrição:
Verifica se a função getRecipeImage() lança um erro quando a estrutura do JSON retornado pela API está incorreta ou incompleta.

**Entrada:** `"feijoada"`

**Saída Esperada:** Lançamento de erro genérico

**Saída Real:** Lançamento de erro genérico

**Comentários:** O teste confirma que a função é robusta contra formatos inesperados na resposta da API.

**Título:** Retorno correto de nutrientes com resposta válida da API
**Nível:** Teste unitário

### Descrição:
Verifica se getNutrition() retorna corretamente os valores calóricos e nutricionais com resposta válida da API.

**Entrada:** `[{ name: 'arroz', unit: 'g', amount: 100 }]`

**Saída Esperada:** `cal: 130, carb: 28, fat: 0.5, ptn: 2.5`

**Saída Real:** `cal: 130, carb: 28, fat: 0.5, ptn: 2.5`

**Comentários:** A função extrai corretamente os valores nutricionais da resposta da API.

**Título:** Retorno 0 para nutrientes quando API retorna 404
**Nível:** Teste unitário

### Descrição:
Testa o comportamento de getNutrition() quando a API retorna erro 404.

**Entrada:** `[{ name: 'arroz', unit: 'g', amount: 100 }]`

**Saída Esperada:** `cal: 0, carb: 0, fat: 0, ptn: 0`

**Saída Real:** `cal: 0, carb: 0, fat: 0, ptn: 0`

**Comentários:** A função retorna valores neutros de forma segura quando a API não encontra o recurso.

**Título:** Retorno -1 para nutrientes em caso de erro na API
**Nível:** Teste unitário

### Descrição:
Verifica se getNutrition() trata corretamente erros inesperados de rede, retornando valores -1 para todos os nutrientes.

**Entrada:** `[{ name: 'arroz', unit: 'g', amount: 100 }]`

**Saída Esperada:** `cal: -1, carb: -1, fat: -1, ptn: -1`

**Saída Real:** `cal: -1, carb: -1, fat: -1, ptn: -1`

**Comentários:** A função lida adequadamente com falhas críticas de comunicação com a API.

**Título:** Adiciona ID ao ingrediente quando a API retorna resultado
**Nível:** Teste unitário

### Descrição:
Testa se a função getIngredientId() adiciona corretamente o id ao ingrediente quando a API retorna um resultado válido após tradução.

**Entrada:** 
Ingrediente:`{ name: 'tomate', id: '', amount: 1, unit: 'un' }`
Tradução mockada: `'tomato'`

**Saída Esperada:** `mockIngredient.id === 12345`

**Saída Real:** `mockIngredient.id === 12345`

**Comentários:** A função traduziu corretamente o nome do ingrediente e utilizou essa tradução para buscar e atribuir o ID retornado pela API.

**Título:** Não adiciona ID quando a API retorna lista vazia
**Nível:** Teste unitário

### Descrição:
Testa o comportamento da função getIngredientId() quando a API retorna uma lista de resultados vazia.

**Entrada:**
Ingrediente: `{ name: 'ingrediente-falso', id: '', amount: 1, unit: 'un' }`
Tradução mockada: `'fake-ingredient'`
Resposta da API: `{ results: [] }`

**Saída Esperada:** `mockIngredient.id === ''`

**Saída Real:** `mockIngredient.id === ''`

**Comentários:** A função manteve o ID original (vazio), já que a API não retornou nenhum resultado.

**Título:** Tratamento de erro da API durante busca do ID
**Nível:** Teste unitário

### Descrição:
Testa se a função getIngredientId() lida corretamente com erros de resposta da API (status 500).

**Entrada:**
Ingrediente: `{ name: 'cebola', id: '', amount: 1, unit: 'un' }`
Tradução mockada: `'onion'`
Resposta da API: `{ ok: false, status: 500 }`

**Saída Esperada:** `mockIngredient.id === ''` e log de erro no console

**Saída Real:** `mockIngredient.id === ''` e log de erro no console

**Comentários:** A função trata erros silenciosamente, mantendo o ID inalterado e registrando o erro no console.

**Título:** Retorna receita válida com ID existente
**Nível:** Teste unitário

### Descrição:
Verifica se a função getRecipeById() retorna uma receita válida quando fornecido um ID existente.

**Entrada:** `getRecipeById(1)`
Resposta da API: `{ id: 1, title: 'Receita de Teste', ingredients: [], preparation: [], harmonizations: [] }`

**Saída Esperada:** Objeto de receita correspondente

**Saída Real:** Objeto de receita correspondente

**Comentários:** A função retorna corretamente o objeto esperado da API ao buscar por ID válido.

**Título:** Lança erro ao buscar receita com ID inválido
**Nível:** Teste unitário

### Descrição: 
Testa se a função getRecipeById() lança erro quando a API responde com falha (ex: 404).

**Entrada:** `getRecipeById(1234)`
Resposta da API: `{ ok: false, status: 404 }`

**Saída Esperada:** Erro lançado com mensagem `"Erro ao buscar receita"`

**Saída Real:** Erro lançado com mensagem `"Erro ao buscar receita"`

**Comentários:** A função trata corretamente o erro de requisição mal-sucedida, lançando uma exceção com mensagem clara.

**Título:** Retorna lista de receitas do usuário (caso normal)
**Nível:** Teste unitário

### Descrição:
Verifica se a função getUserRecipes() retorna corretamente a lista de receitas quando a API responde com sucesso.

**Entrada:** Chamada de `getUserRecipes()`
Resposta da API: `[{ id: 1, title: 'Receita A' }, { id: 2, title: 'Receita B' }]`

**Saída Esperada:** Lista com 2 receitas

**Saída Real:** Lista com 2 receitas

**Comentários:** A função retornou corretamente os dados do endpoint, confirmando funcionamento esperado em situação comum.

**Título:** Retorna lista vazia quando API retorna array vazio
**Nível:** Teste unitário

### Descrição:
Testa o comportamento da função getUserRecipes() quando a API responde com uma lista vazia.

**Entrada:** Chamada de `getUserRecipes()`
`Resposta da API: []`

**Saída Esperada:** `[]`

**Saída Real:** `[]`

**Comentários:** A função trata corretamente o caso onde o usuário ainda não tem receitas cadastradas.

**Título:** Retorna lista vazia em caso de erro da API
**Nível:** Teste unitário

### Descrição:
Testa o comportamento da função getUserRecipes() quando a API responde com erro (status 500).

**Entrada:** Chamada de `getUserRecipes()`
Resposta da API: `{ ok: false, status: 500 }`

**Saída Esperada:** `[]`

**Saída Real:** `[]`

**Comentários:** Mesmo com falha da API, a função retorna uma lista vazia e evita quebrar o app.

**Título:** Retorna lista vazia em erro de rede ou fetch
**Nível:** Teste unitário

### Descrição:
Verifica se getUserRecipes() retorna uma lista vazia quando ocorre um erro de rede (ex: sem internet).

**Entrada:** Chamada de `getUserRecipes()` com fetch rejeitado
Erro mockado: `Network Error`

**Saída Esperada:** `[]`

**Saída Real:** `[]`

**Comentários:** O teste confirma que falhas inesperadas são tratadas com segurança, retornando [].

**Título:** Salva receita com token válido
**Nível:** Teste unitário

### Descrição:
Verifica se a função saveRecipe() realiza uma requisição POST correta à API quando um token válido está disponível.

**Entrada:** Chamada de saveRecipe() com token mockado como `'fake-token'` e receita válida

**Saída Esperada:** `{ success: true, id: 1 }`

**Saída Real:** `{ success: true, id: 1 }`

**Comentários:** A função realiza a requisição corretamente, com headers e corpo apropriados. O mock do fetch foi chamado com os argumentos esperados.

**Título:** Lança erro ao salvar receita sem token
**Nível:** Teste unitário

### Descrição:
Verifica se a função saveRecipe() lança um erro quando authService.getToken() retorna null.

**Entrada:** Chamada de saveRecipe() com token ausente

**Saída Esperada:** Erro com mensagem `"Usuário não autenticado."`

**Saída Real:** Erro com mensagem `"Usuário não autenticado."`

**Comentários:** A ausência do token foi corretamente identificada e tratada com uma exceção.

**Título:** Lança erro da API ao salvar receita com falha de validação
**Nível:** Teste unitário

### Descrição:
Garante que a função saveRecipe() propaga a mensagem de erro retornada pela API quando fetch.ok é false.

**Entrada:** Chamada de saveRecipe() com `fetch.ok = false` e resposta com `{ message: 'Erro de validação' }`

**Saída Esperada:** Erro com mensagem `"Erro de validação"`

**Saída Real:** Erro com mensagem `"Erro de validação"`

**Comentários:** Teste essencial para garantir que mensagens específicas da API cheguem corretamente ao front-end.

**Título:** Lança erro genérico ao salvar receita sem mensagem da API
**Nível:** Teste unitário

### Descrição:
Testa o comportamento da função saveRecipe() quando a API falha e não retorna nenhuma mensagem de erro.

**Entrada:** Chamada de saveRecipe() com `fetch.ok = false` e resposta `{}`

**Saída Esperada:** Erro com mensagem `"Erro ao salvar receita."`

**Saída Real:** Erro com mensagem `"Erro ao salvar receita."`

**Comentários:** Comprova que erros silenciosos da API são tratados com uma mensagem padrão clara.

**Título:** Transforma ingredientes simples com IDs fictícios
**Nível:** Teste unitário

### Descrição:
Verifica se transformIngredient() transforma uma lista de objetos de ingredientes em objetos com IDs baseados na posição.

**Entrada:**
[
  { name: 'tomate', unit: 'un', amount: 2 },
  { name: 'cebola', unit: 'un', amount: 1 }
]

**Saída Esperada:**
[
  { name: 'tomate', id: 'id-0', unit: 'un', amount: 2 },
  { name: 'cebola', id: 'id-1', unit: 'un', amount: 1 }
]

**Saída Real:**
[
  { name: 'tomate', id: 'id-0', unit: 'un', amount: 2 },
  { name: 'cebola', id: 'id-1', unit: 'un', amount: 1 }
]

**Comentários:** IDs são corretamente gerados com base na posição. Teste cobre estrutura e valores.

**Título:** Retorna lista vazia se não houver ingredientes
**Nível:** Teste unitário

### Descrição:
Garante que transformIngredient() retorna uma lista vazia ao receber um array vazio.

**Entrada:** `[]`

**Saída Esperada:** `[]`

**Saída Real:** `[]`

**Comentários:** Teste direto, garante robustez em casos triviais ou iniciais.

**Título:** Gera IDs únicos mesmo com ingredientes repetidos
**Nível:** Teste unitário

### Descrição:
Verifica se transformIngredient() cria IDs distintos para ingredientes com nomes iguais.

**Entrada:**
[
  { name: 'ovo', unit: 'un', amount: 1 },
  { name: 'ovo', unit: 'un', amount: 2 }
]

**Saída Esperada:** IDs `id-0` e `id-1`, com nomes iguais

**Saída Real:** IDs `id-0` e `id-1`, com nomes iguais

**Comentários:** IDs únicos garantem identificação correta mesmo em duplicatas.

**Título:** Traduz ingrediente simples com sucesso
**Nível:** Teste unitário

### Descrição:
Testa a função translate() utilizando a API Gemini mockada, com retorno de tradução para o inglês.

**Entrada:** `'tomate'`

**Saída Esperada:** `{ translated: 'tomato' }`

**Saída Real:** `{ translated: 'tomato' }`

**Comentários:** Função interage corretamente com o modelo e processa a resposta JSON simulada.

**Título:** Envia prompt correto ao modelo Gemini
**Nível:** Teste unitário

### Descrição:
Verifica se a função translate() constrói corretamente o prompt com a palavra original e a instrução de tradução.

**Entrada:** `'alho'`

**Saída Esperada:** Prompt com `'alho'` e `"Traduza do português brasileiro para o inglês"`

**Saída Real:** Prompt com `'alho'` e `"Traduza do português brasileiro para o inglês"`

**Comentários:** Teste assegura que a instrução ao modelo é gerada corretamente com base no input.

## Testes de Integração automatizados

**Título:** Retorno válido com lista de ingredientes fornecida
**Nível:** Teste de integração

### Descrição:
Verifica se getRecipe() retorna corretamente uma receita quando ingredientes são passados.

**Entrada:** `['tomate', 'cebola']`

**Saída Esperada:** Objeto com `title`, `ingredients[]`, `preparation[]` e `harmonizations[]`

**Saída Real:** Objeto com `title`, `ingredients[]`, `preparation[]` e `harmonizations[]`

**Comentários:** O fluxo completo da geração da receita, parse do JSON e estruturação do objeto funcionou corretamente.

**Título:** Retorno válido com lista de ingredientes vazia
**Nível:** Teste de integração

### Descrição:
Testa o comportamento de getRecipe() quando nenhum ingrediente é fornecido.

**Entrada:** `[]`

**Saída Esperada:** Receita aleatória com estrutura válida

**Saída Real:** Receita aleatória com estrutura válida

**Comentários:** A função consegue gerar receitas mesmo sem entrada explícita do usuário, como fallback.

**Título:** Limite de até 8 ingredientes respeitado
**Nível:** Teste de integração

### Descrição: 
Garante que getRecipe() respeita a regra de no máximo 8 ingredientes processados.

**Entrada:** `['ingrediente1', ..., 'ingrediente20']`

**Saída Esperada:** `ingredients.length <= 8`

**Saída Real:** `ingredients.length <= 8`

**Comentários:** A função filtra corretamente entradas excessivas para respeitar o limite de complexidade da receita.

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

**Título:**
**Nível:**

### Descrição:


**Entrada:**

**Saída Esperada:**

**Saída Real:**

**Comentários:**

