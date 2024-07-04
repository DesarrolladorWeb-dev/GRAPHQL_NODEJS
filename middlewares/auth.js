const jwt = require('jsonwebtoken')


// Un middleware tiene igual que un ruta un req , res y un next que es el callback
const authenticate = (req, res, next ) => {
    // Enviando informacion extra para que lo guarde en la cabecera y que formato va a ser 
    // tendra esta estructura - Authorization : 'Bearer (token)  
    // si auterization existe entonces - modificamos y borramos el Bearer
    const token = req.headers.authorization?.split(' ')[1]

    try {
        const verified = jwt.verify(token, 'faztxyz123');
        req.verifiedUser = verified.user; //solo quiero el usuario
    
    } catch (error) {
        next()
    }

    next();
    // next continua con las rutas siguientes
}
module.exports = {
    authenticate
}
