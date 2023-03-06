const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const backendController = require('../controllers/backendController');


router.get(
    '/get_file/:meta?/:fileName',
    backendController.getFile
);

router.post(
    '/upload_file',
    verifyJWT,
    backendController.uploadFile
);

module.exports = router;