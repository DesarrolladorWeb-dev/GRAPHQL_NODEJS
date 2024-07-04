// CONTROLADOR
const { GraphQLList, GraphQLID} = require('graphql');
const { UserType, PostType,CommentType } = require('./types');
const {User, Post, Comment} = require('../models');

const users = {
    // esto no va a devolver un string va a devolver una lista de usuarios 
    // estoy creamdo una lista de tipo de datos de usuario
    type: new GraphQLList(UserType),
    resolve(){
        return User.find()

    }
}
const user = {
    // usamos el usertype que usamos en las listas - porque espera un objeto
    type: UserType,
    description : "Obtener usuario por id",
    args:{
        id:{type: GraphQLID},

    },
    resolve(_,args){
        // Le pasamos el id
        return User.findById(args.id)
    }
}
const posts = {
    // tipo de dato que estaeremos retornando 
    type: new GraphQLList(PostType),
    description: "Esto tiene toda las publicaciones",
    resolve :  () =>  Post.find()  // tiene el return por implisito

}
const post = {
    type : PostType,
    description: "Get a post by id",
    args : {
        id : { type : GraphQLID}
    },
    resolve: (_,{id}) => Post.findById(id), 
    // RESUMIDO
    // async resolve(_,args){
    //     const post = await Post.findById(args.id)
    //     return post 
    // }
}
const comments = {
    type :  new GraphQLList(CommentType),
    description : "Obtener Comentarios",
    resolve : () => Comment.find(),


}
const comment = {
    type : CommentType,
    description: "Obtener el comentario por id",
    args: {
        id: {type: GraphQLID},
    },
    resolve: (_,{id}) => Comment.findById(id)
}

    // Lo exportamos en un objeto
    module.exports = {users,user,posts, post,comments,comment }