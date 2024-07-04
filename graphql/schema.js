// RUTA
const {GraphQLSchema, GraphQLObjectType} = require('graphql')
const { users, user, posts, post, comments, comment} = require('./queries')
const {deleteComment, register, login , createPost, updatePost, deletePost, addComment,updateComment} = require('./mutations')
// Primero inicializamos con la raiz de las consultas
// Los Query Type es una consulta inicial 
const QueryType = new GraphQLObjectType({
    name:"QueryType",
    description: 'The root query type',
    // las funciones que quiero ejecutar
    fields:{
        users,
        user,
        posts,
        post,
        comments,
        comment

    },
})
// Mutaciones - funciones que me permitiran alterar datos 
const MutationType = new GraphQLObjectType({
    name: "MutationType",
    description : "The root mutation type",
    fields : {
        register,
        login,
        createPost,
        updatePost,
        deletePost,
        addComment,
        updateComment,
        deleteComment

    }
})

// Nos sirve para crear esquemas
module.exports = new GraphQLSchema({
        query : QueryType,
        mutation : MutationType
})

