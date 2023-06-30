'use strict'

const { connectToDatabase, Pedido } = require('./mongodb.js')

module.exports.pedidos = async (event) => {
  await connectToDatabase()

  const data = JSON.parse(event.body)

  console.log(data)

  await Pedido.create(data)

  return {
    statusCode: 200,
    body: JSON.stringify({
        message: 'Executado a função pedidos com sucesso.',
        input: data,
    })
  }
}

module.exports.obterPedidos = async (event) => {
  await connectToDatabase()

  const pedidoId = event.pathParameters.id;

  try {
    const pedido = await Pedido.findById(pedidoId);

    if (!pedido) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Pedido não encontrado.',
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Pedido obtido com sucesso.',
        pedido: pedido,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Ocorreu um erro ao obter o pedido.',
        error: error.message,
      }),
    };
  }
};