# Testes de API para Gerenciamento de Receitas


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
