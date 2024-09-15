const mongoose = require('mongoose');

const kullaniciSchema = new mongoose.Schema({
  ad: { type: String, required: true },
  soyad: { type: String, required: true },
  telefon: { type: String, required: true },
  parkYeriId: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkYeri' }
});

module.exports = mongoose.model('Kullanici', kullaniciSchema);