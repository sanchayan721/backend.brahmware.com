const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLES_LIST = require('../configs/roles_list');


/********** Both Handler and Admin **********/

const routerBoth = router.use(verifyRoles(
    ROLES_LIST.Admin,
    ROLES_LIST.Handeler
));

routerBoth.get('/', userController.findAllUsers);
routerBoth.get('/:id', userController.findUser);


/********** Admin Specific **********/

const routerAdmin = router.use(verifyRoles(
    ROLES_LIST.Admin
));

routerAdmin.post('/', userController.handleNewUser);
routerAdmin.patch('/:username', userController.editUser);
routerAdmin.delete('/:username', userController.deleteUser);


/********** Exporting the Router **********/
module.exports = router;