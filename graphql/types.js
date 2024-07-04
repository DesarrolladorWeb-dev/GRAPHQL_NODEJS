const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = require("graphql");
const {User, Comment, Post} = require ('../models')

//Creamos nuestro tipo de dato del Usuario- Esto ayudara al autocompletado
// es una forma de decir que un usuario esta conformado por ....
const UserType = new GraphQLObjectType({
    name : "UserType",
    description : "El tipo de usuario",
    // la funcion es opcional se creo abajo por la variable CommentType
    fields : () => ( {
        id:{type: GraphQLID}, //es lo que identifica como unico a este campo
        username : {type: GraphQLString},
        email : {type: GraphQLString},
        displayName : {type: GraphQLString},
        createdAt: {type: GraphQLString},
        updatedAt: {type: GraphQLString}
    })
})
const PostType = new GraphQLObjectType({
    name: "PostType",
    description : "Tipo de post ",
    // lo creamos dentro de una funcion que va a convertir este objeto en una respuesta de la funcion
    // solo esta funcion sera ejecutada cuando haya sido llamado el tipo de dato
    fields: () => ({
        id:{type: GraphQLID},
        title: {type: GraphQLString},
        body : {type: GraphQLString},
        createdAt:{type:GraphQLString},
        updatedAt:{type:GraphQLString},
        // para que solo no me devuelva el id - y usamos tipo UserType
        // resolve para ejecutar una logica cuando se consulte a esta propiedad 
        // cuando llame a authon se ejecutara el resolve para llenar los datos en el UserType
        author: {type : UserType, resolve(parent, args){
            // parent tiene la info de ka respuesta de mutation.js - return post
            return User.findById(parent.authorId)
        }},
        // para mostrar los comentarios
        comments : {
            // un arreglo de comentarios
            // Ahora yo puedo llamar el CommentType sin necesidad de que este creado antes 
            type: new GraphQLList(CommentType), 
            resolve(parent){
                // que coincida el post id con el id de arriba
                return Comment.find({postId : parent.id})
            }
        }
    }),

})
const CommentType = new GraphQLObjectType({
    name :"CommentType",
    description:"The comment type",
    fields : { //datos que voy a estar devolviendo
        id :{type: GraphQLID},
        comment :{type : GraphQLString},
        user :{type: UserType, resolve(parent){
            // userId  - sale del el modelo Comment
            return User.findById(parent.userId)
        }},
        post : {type: PostType, resolve(parent){
            // postId  - sale del el modelo Comment
            return Post.findById(parent.postId)
        }}
    }
})



module.exports = {
    UserType,
    PostType,
    CommentType
};