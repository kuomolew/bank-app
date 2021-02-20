const express = require('express');
const bankController = require('./../controllers/bankController');

const router = express.Router();

router
  .route('/')
  .get(bankController.getAllBanks)
  .post(bankController.createBank);
router
  .route('/:id')
  .get(bankController.getBank)
  .patch(bankController.updateBank)
  .delete(bankController.deleteBank);

module.exports = router;
