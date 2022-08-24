import jwt  from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

// si json web token expiró, next detiene la ejecución del código pasando al sgte middleware
// función middleware permite ser reutilizada
const checkAuth = async (req, res, next) => {
    let token;
    if(
        //se comprueba si existe el bearer
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
        ) {
            try {
                //se muestra únicamente el token sin bearer
                token = req.headers.authorization.split(' ')[1];
                //se verifica el token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // se inicia sesión con info de veterinario
                req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado');
                return next();

            } catch (error) {
                const e = new Error ('Token no válido');
                return res.status(403).json({ msg: e.message});
            }     
    }
    if(!token) {
        const error = new Error ('Token no válido o inexistente');
        res.status(403).json({ msg: error.message});
       }

    next();
}
export default checkAuth;