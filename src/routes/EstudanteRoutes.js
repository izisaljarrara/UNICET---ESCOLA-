const espress = require('express');
const router = espress.Router();
const EstudanteController = require('../controllers/EstudanteController');  

router.get('/estudante', EstudanteController.listarTodos);
router.get('/estudante/:id', EstudanteController.listarPorId);
router.post('/estudante', EstudanteController.salvar);
router.put('/estudante/:id', EstudanteController.editar);
router.delete('/estudante/:id', EstudanteController.deletar); 

module.exports = router;
