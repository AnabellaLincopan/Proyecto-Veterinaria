import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
    //sign crea un nuevo json web token en base al id del usuario
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        // cuando expira
        expiresIn: '30d',
    });
};

export default generarJWT;