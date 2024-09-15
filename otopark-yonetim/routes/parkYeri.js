const mongoose = require('mongoose');

const parkYeriSchema = new mongoose.Schema({
  otoparkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Otopark', required: true },
  numara: { type: String, required: true },
  durum: { type: String, enum: ['Boş', 'Dolu'], default: 'Boş' },
  kullaniciId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kullanici' }
});

module.exports = mongoose.model('ParkYeri', parkYeriSchema);