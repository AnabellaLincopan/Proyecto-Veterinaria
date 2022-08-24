import express from "express";
import { 
    registrar, 
    perfil, 
    confirmar, 
    autenticar, 
    passwordOlvidada,
    comprobarToken,
    nuevoPassword,
    } from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";
const router = express.Router();

// área pública
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/password-olvidada', passwordOlvidada); // para validar email del usuario
router.get('/password-olvidada/:token', comprobarToken); // leer token
router.post('/password-olvidada/:token', nuevoPassword); // almacenar el nueo password

//las dos últimas líneas también se pueden escribir como:
//router.route('/password-olvidada/:token').get(comprobarToken).post(nuevoPassword);


// área privada
// se requiere que el usuario esté autenticado para ver su perfil, para lo cual se usan middlewares
router.get('/perfil', checkAuth, perfil);

export default router;