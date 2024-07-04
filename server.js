const express = require('express');
// Procesar multiples rutas atraves de una consulta
const {graphqlHTTP} = require('express-graphql');
// Desde aqui tomara el schema
const schema = require('./graphql/schema.js')
const {connectDB} =require('./db')
const {authenticate} = require('./middlewares/auth')

connectDB()
const app = express()

// antes de pasar a las rutas ejecutamos el midelware
// antes de que lleguen a las rutas pasara por esta funcion
app.use(authenticate)

app.get('/', (req,res) => {
    res.send("Welcome to my graphql api")
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql:true
}))
app.listen(3000)

console.log('Servidor Corriendo en el servidor', 3000)