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
