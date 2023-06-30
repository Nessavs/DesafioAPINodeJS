const mongoose = require("mongoose");
const { Schema } = mongoose;

const DB_USER = "inavessível";
const DB_PASSWORD = encodeURIComponent("inavessível");
const DB_HOST = "inavessível";
const DB_NAME = "inavessível";

const connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

const pedidoSchema = new Schema({
  user: String,
  delivery_type: String,
  products: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total: Number
});

pedidoSchema.path('products').schema.path('price').set(function(value) {
  return Math.floor(value * 100) / 100;
});

pedidoSchema.path('total').set(function(value) {
  return Math.floor(value * 100) / 100;
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

const connectToDatabase = async () => {
  console.log("Iniciando o servidor...");

  console.log(connectionString);

  try {
    await mongoose.connect(connectionString);
    console.log("Conectado ao MongoDB! =D");
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
  }
};

module.exports = {
  connectToDatabase,
  Pedido
};
