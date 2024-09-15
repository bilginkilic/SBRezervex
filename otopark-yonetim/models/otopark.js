const mongoose = require('mongoose');

const otoparkSchema = new mongoose.Schema({
  binaAdi: { type: String, required: true },
  kat: { type: Number, required: true },
  toplamParkYeriSayisi: { type: Number, required: true },
  adres: { type: String, required: true }
});

module.exports = mongoose.model('Otopark', otoparkSchema);