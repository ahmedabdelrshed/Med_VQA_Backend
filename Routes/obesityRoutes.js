const express = require('express');
const router = express.Router();
const { processObesityPrediction,getUserObesityReports } = require('../controllers/obesityController');
const verifyToken = require('../middlewares/verifyToken');



router.post('/predict',verifyToken, processObesityPrediction);
router.get('/getReports', verifyToken,getUserObesityReports ); 

module.exports = router;
