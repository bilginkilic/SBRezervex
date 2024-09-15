const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Routes
const otoparkRoutes = require('./routes/otopark');
const parkYeriRoutes = require('./routes/parkYeri');
const kullaniciRoutes = require('./routes/kullanici');

app.use('/api/otopark', otoparkRoutes);
app.use('/api/parkYeri', parkYeriRoutes);
app.use('/api/kullanici', kullaniciRoutes);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));

mongoose.connection.on('connected', () => {
  console.log('Mongoose bağlandı');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose bağlantı hatası:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose bağlantısı kesildi');
});

// Otopark modeli tanımı
const OtoparkSchema = new mongoose.Schema({
  name: String,
  // diğer alanlar...
});

const Otopark = mongoose.model('.models/Otopark', OtoparkSchema);

// Test fonksiyonu, gerekirse ayrı bir dosyaya taşınabilir
async function testConnection() {
  try {
    const otoparks = await Otopark.find().limit(5);
    console.log('İlk 5 otopark:', otoparks);
  } catch (error) {
    console.error('Otopark sorgulama hatası:', error);
  }
}

// Uygulama başladıktan sonra test fonksiyonunu çalıştır
app.on('ready', () => {
  testConnection();
});