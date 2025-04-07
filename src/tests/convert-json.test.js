const clearJson = require("../services/convert-Json.js")

test("Json bem formado: ", ()=>{
expect(clearJson(`{"nome": "João", "idade": 25}`)).toStrictEqual({"nome": "João", "idade": 25})
})

test("Json mal formado: ", () => {
    expect(() => clearJson(` {"nome": "Maria", "idade": `)).toThrow(Error);
})



