const express = require('express');
const router = express.Router();
const Otopark = require('../models/Otopark');

// Otopark oluşturma
router.post('/', async (req, res) => {
  try {
    const otopark = new Otopark(req.body);
    await otopark.save();
    res.status(201).json(otopark);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Tüm otoparkları listeleme
router.get('/', async (req, res) => {
  try {
    const otoparklar = await Otopark.find();
    res.json(otoparklar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Diğer CRUD işlemleri buraya eklenebilir

module.exports = router;