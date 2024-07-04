const { GraphQLString, GraphQLID } = require("graphql");
const { PostType , CommentType} = require('./types');
const {User, Post, Comment} = require('../models')
const {createJWTToken} = require('../util/auth');


const register = {
    type : GraphQLString,
    description : "Registra un nuevo usuario y retorna un token",
    // para pasar datos
    args:{
        username:{ type: GraphQLString },
        email:{ type: GraphQLString },
        password:{ type: GraphQLString },
        displayName:{ type: GraphQLString },
    },
    // Aqui es cuando se ejecuta 
    async resolve(_,args){
        // console.log(args)
        const {username,email,password,displayName} = args;
        // Creamos el nuevo usuario
       const user =  new User({username,email,password,displayName});
       await user.save();

    //    Crear token con el contenido del usuario encriptado dentro
    // solo pasas lo necesario y no el password para que ocultes el password
       const token = createJWTToken({_id:user._id,username:user.username , email:user.email})

    // console.log(token)
    // console.log(user);
    // Espera que retorne un string
        return token
    }
}

const login = {
    type:GraphQLString,
    description :"Login de Usuario que retorna un token",
    args:{
        email:{type: GraphQLString},
        password : {type: GraphQLString}
    },
    async resolve(_,args ){
        // +password  :nos da toda y la  password - no se mostraba porque en el modelo escribimos  select
        const user =  await User.findOne({email : args.email}).select('+password')
        console.log(user)
        // Si hay un error 
        if (!user || args.password !== user.password) throw new Error("No tiene autorizacion")

        const token = createJWTToken({
            _id:user._id,
            username:user.username,
            email:user.email})

        return token;

    }
}
const createPost = {
    // es lo que retornara un PostType
    type: PostType,
    description: "Crear una nuevo Post",
    args : {
        title : {type : GraphQLString},
        body : {type : GraphQLString},
    },
    async resolve(_,args , {verifiedUser} ) {
        // console.log(verifiedUser)
        const post = new Post ({
            title: args.title,
            body:args.body,
            authorId:verifiedUser

        })
        // Guardar nuestra publicacion
        await post.save()

        // de esta manera creamos nuestra publicacion
        // console.log(post)
        return post
    },
};
// Actualizar Post
const updatePost = {
    type: PostType,
    description : "Actualizar post",
    args:{
        id:{type: GraphQLID},
        title:{type: GraphQLString},
        body:{type:GraphQLString},
    },
    // el verifiedUser - es para verificar si el usuario esta logeado
    // porque el usaurio A que creo la publicacion solo el A puede actualizarlo
    async resolve(_,{id, title, body},{verifiedUser}){

        // si existe el verifie user es porque esta autenticado
        if(!verifiedUser){
            throw new Error('no esta autorizado')
        }
        // Nos devolvera un objeto nuevo de la actualizacion
        const updatePost = await Post.findOneAndUpdate(
            { _id : id, authorId : verifiedUser._id }, //buscamos por el id y el id del usuarop
            { //actualizamos
                title,
                body
            },
            {//nos devolvera el objeto nuevo el objeto que esta actualizado
                new: true,
                // validacion
                runValidators:true
            }
        )

        // console.log(verifiedUser)
        // console.log(id, title, body)
        return updatePost 
    }
}

// Eliminar Post 
const deletePost = {
    type: GraphQLString,
    description : "Eliminar una publicacion",
    args : {
        postId: {type: GraphQLID},
    },
    async resolve(_,{postId},{verifiedUser}) {
        if(!verifiedUser) throw new Error("No esta autorizado");

        // Si coincide tendraas el post elimnado
        const postDeleted = await Post.findOneAndDelete({
            _id: postId,
            authorId : verifiedUser._id
        })
        if(!postDeleted) throw new Error("La publicacion no ha sido encontrada")
    
        return "Post eliminado"
    }
}

const addComment = {
    // va a retornar un commenType
    type : CommentType,
    description : "Añade un comentario en la publicacion",
    args : {
        comment : {type:GraphQLString},
        postId : {type : GraphQLID}
    },
    async resolve(_,{comment,postId},{verifiedUser}){
        const newComment = new Comment({
            comment,
            postId,
            userId : verifiedUser._id,
        });
        return newComment.save();
    }
}

const updateComment = {
    type : CommentType,
    descripcion : "Actualizar el comentario",
    args: {
        id : {type:GraphQLID},
        comment : {type: GraphQLString}
    },
    async resolve (_, {id, comment}, {verifiedUser}){
        if(!verifiedUser) throw new Error('No esta autorizado');

        const commentUpdated = await Comment.findOneAndUpdate(
            {
                _id : id,
                userId: verifiedUser._id
            },
            {
                comment
            }
        );
    if(!commentUpdated) throw new Error("Comment no se pudo actualizar")

    return commentUpdated
    },
}
const deleteComment = {
    type:GraphQLString,
    description: "Delete a comment",
    args: {
        id:{type:GraphQLID},
    },
    async resolve(_,{id}, {verifiedUser}){
        if(!verifiedUser) throw new Error('No esta autorizado');
       const commentDelete =  await Comment.findOneAndDelete({
            _id:id,
            userId : verifiedUser._id
        });
        if(!commentDelete) throw new Error('No se pudo eliminar')
        return "Comentario eliminado"

    }
}

module.exports = {
    register,
    login,
    createPost,
    updatePost,
    deletePost,
    addComment,
    updateComment,
    deleteComment
}