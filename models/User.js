const { extendSchemaImpl } = require('graphql/utilities/extendSchema')
const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    username : {
        type:String,
        required : true
    },
    password : {
        type:String,
        required:true,
        // al momento de consultar no lo mostraria
        select:false
    },
    email : {
        type: String,
        required:true,
        unique : true,
        match : [
            /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/,
            'Provide a valid email address'
        ]
    },
    displayName : {
        type:String,
        required : true
    }
},{ //creara dos campos / a que hora fue creado/ y cuando se actualizo
    timestamps: true,
    // _v  para que añada esto 
    versionKey:false
})

module.exports = model("User", UserSchema);