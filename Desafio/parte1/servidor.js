const { appendFile } = require('fs');
const Joi = require('joi');
const fs = require('fs').promises;
const axios = require('axios');

const pedidoSchema = Joi.object({
  user: Joi.string().required(),
  delivery_type: Joi.string().valid('pickup', 'delivery', 'local').required(),
  products: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        price: Joi.number().positive().required(),
        quantity: Joi.number().integer().positive().required()
      })
    )
    .required(),
});

'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  server.route({
    method: 'POST',
    path: '/api/pedidos',
    handler: async (request, h) => {
      const { error, value } = pedidoSchema.validate(request.payload);
      if (error) {
        return h.response(error.details).code(400);
      }

      const total = value.products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      value.total = total;

      try {
        const response = await axios.post('https://hx61fb9pgb.execute-api.us-east-2.amazonaws.com/dev/pedidos', value);
        console.log(response.data);
        return h.response({ message: 'Pedido criado com sucesso' }).code(201);
      } catch (error) {
        console.error('Erro ao criar pedido:', error);
        return h.response({ message: 'Erro ao criar pedido' }).code(500);
      }
    },
  });

  server.route({
    method: 'GET',
    path: '/api/pedidos/{id}',
    handler: async (request, h) => {
      const { id } = request.params;

      try {
        // API chamando o axios
        const response = await axios.get(`https://hx61fb9pgb.execute-api.us-east-2.amazonaws.com/dev/pedidos/${id}`);
        console.log(response.data);
        return h.response(response.data).code(200);
      } catch (error) {
        console.error('Pedido não foi encontrado:', error);
        return h.response({ message: 'Pedido não foi encontrado' }).code(404);
      }
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
