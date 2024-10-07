const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const moment = require('moment-timezone');

class OrdersController {
  async create(request, response){
    const { status, details } = request.body;

    const [order_id] = await knex('orders').insert({
      status,
      details
    });

    const order = await knex('orders').where({ id: order_id }).first();

    const adjustedTime = moment.utc(order.created_at).tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

    await knex('orders')
    .where({ id: order_id })
    .update({
      created_at: adjustedTime // Substitui o valor original com a data ajustada
    });

    return response.status(200).json({ order_id });
  }
}
module.exports = OrdersController