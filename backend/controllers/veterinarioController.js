import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarId from '../helpers/generarId.js';

const registrar = async (req, res) => {
//muestra el requerimiento desde postman
  const { email } = req.body;
   const existeUsuario = await Veterinario.findOne({ email});

   if (existeUsuario) {
    const error = new Error ('Usuario ya registrado');
    return res.status(400).json({msg: error.message});
   };

  //prevenir usuarios duplicados

  try {
    // guardar un nuevo usuario
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();
    res.json(veterinarioGuardado);
  } catch (error) {
    console.log(error)
  }
};

const perfil = (req, res) => {
  const { veterinario } = req;
  res.json({ perfil: veterinario });
};

//se busca usuario que tenga el token que le pasamos en la url
const confirmar = async (req, res) => {
  //para leer datos de la url se usa req.params
  const { token } = req.params;
  const usuarioConfirmar = await Veterinario.findOne({token});

  if (!usuarioConfirmar) {
    const error = new Error('Token no válido');
    return res.status(404).json({msg: error.message});
  }
  try {
    // el token será nulo después de ser usado
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();

    res.json({ msg: 'Usuario confirmado correctamente' });
  } catch (error) {
    console.log(error)
  }
}

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  //comprobar si el usuario existe
  const usuario = await Veterinario.findOne({email});
  
  if(!usuario) {
    const error = new Error('El usuario no existe');
    return res.status(404).json({ msg: error.message });
  } 
   // comprobar que el usuario está confirmado
  if(!usuario.confirmado) {
    const error = new Error ('Tu cuenta no está confirmada');
    return res.status(403).json({ msg: error.message });
   }
   //revisar si password escrito es correcto
  if(await usuario.comprobarPassword(password)) {
    console.log(usuario)
    //autenticar el usuario
    res.json({token: generarJWT(usuario.id)});
   } else {
    const error = new Error ('Password incorrecto');
    return res.status(403).json({ msg: error.message });
   }
};

const passwordOlvidada = async (req, res) => {
  const { email } = req.body;
  const existeVeterinario = await Veterinario.findOne({ email });
  if(!existeVeterinario) {
    const error = new Error ('Usuario no existe');
    return res.status(400).json({ msg: error.message });
  }

  try {
    // se genera un token que enviará por email
    existeVeterinario.token = generarId();
    await existeVeterinario.save();
    res.json({ msg: 'Hemos enviado un email con las instrucciones' });
    
  } catch (error) {
    console.log(error)
  }
}

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Veterinario.findOne({ token });
  if(tokenValido) {
    //El token es valido, el usuario existe
    res.json({ msg: 'Token válido, el usuario existe'});
  } else {
    const error = new Error('Token no válido');
    return res.status(400).json({ msg: error.message});
  }
}

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const veterinario = await Veterinario.findOne({ token });
  if(!veterinario) {
    const error = new Error('Hubo un error');
    return res.status(400).json({ msg: error.message});
  }
  try {
    // token de un solo uso, después de usarse retorna null
    veterinario.token = null;
    veterinario.password = password;
    await veterinario.save();
    res.json({ msg: 'Password modificado correctamente'});
  } catch (error) {
    console.log(error)
  }
}
export { registrar, perfil, confirmar, autenticar, passwordOlvidada, comprobarToken, nuevoPassword };
