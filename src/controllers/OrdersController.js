const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const moment = require('moment-timezone');

class OrdersController {
  async create(request, response){
    const { details } = request.body;
    const user_id = request.user.id
    
    let detailsArray = details.map((item) => {
      let itemArray = `${item.plate_amount} x ${item.plate_title}`
      return itemArray
    });

    const [order_id] = await knex('orders').insert({
      status: "pending",
      details: String(detailsArray.join(', ')),
      user_id_who_ordered: user_id
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

  async index(request, response){
    const user_id = request.user.id
    const user_role = request.user.role

    let orders;

    if(user_role == 'customer'){
      orders = await knex("orders").where("user_id_who_ordered", user_id);
    }
    if(user_role == 'admin'){
      orders = await knex("orders");
    }
    
    return response.status(200).json({ orders });
  }

  async update(request, response){
    const { orders } = request.body;

    for(let i = 0; i < orders.length; i++){

      await knex('orders').where({ id: orders[i].id }).update({ status: orders[i].status });
    }

    return response.status(200).json({});
  }
  
}
module.exports = OrdersController