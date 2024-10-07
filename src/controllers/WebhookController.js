const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class WebhookController {
  async create(request, response){
    const sig = request.headers['stripe-signature'];

    let event;
    
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, `${process.env.WEBHOOK_SIGNING_SECRET}`);
    } catch (err) {
      console.error('Erro de verificação de assinatura:', err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log("SUCESSO")
      // const paymentToken
    }
  
    response.status(200).send('Webhook recebido com sucesso');
  }
  
}
module.exports = WebhookController