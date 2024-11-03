const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");
const { verify, sign } = require("jsonwebtoken");
const knex = require("../database/knex");
const moment = require('moment-timezone');

class WebhookController {
  async create(request, response){
    const sig = request.headers['stripe-signature'];
    let event;
    let paymentToken;
    let session_id;

    try {
      const payload = request.body.toString('utf8');
      event = stripe.webhooks.constructEvent(payload, sig, `${process.env.WEBHOOK_SIGNING_SECRET}`);
    } catch (e) {
      throw new AppError(`Erro de verificação de assinatura:`, e.message);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      const tokenPayload = {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      };
      
      const { secret } = authConfig.jwt;
      paymentToken = sign(tokenPayload, secret, {
        expiresIn: '60s'
      })
    }

    if(event.type === 'checkout.session.completed'){
      session_id = event.data.object.id;
    }
    
    if(paymentToken !== undefined && session_id !== undefined){
      const [paymentToken_id] = await knex('payment_tokens').insert({
        token: paymentToken,
        sessionId: session_id
      });
  
      const paymentTokenToAdjustTime = await knex('payment_tokens').where({ id: paymentToken_id }).first();
      
      const adjustedTime = moment.utc(paymentTokenToAdjustTime.created_at).tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
  
      await knex('payment_tokens')
      .where({ id: paymentToken_id })
      .update({
        created_at: adjustedTime // Substitui o valor original com a data ajustada
      });
      
      const actualPaymentToken = await knex('payment_tokens')
      .where({ id: paymentToken_id })
      console.log(actualPaymentToken)
    }
    

    
    return response.status(201).json({ message: "Token de pagamento gerado com sucesso" });
  }

  async index(request, response){
    const authHeader = request.headers;
    const tokens = authHeader.cookie.split(";");
    const paymentToken = tokens[1].split("paymentToken=")[1].trim();

    if (!paymentToken) {
      throw new AppError('Token de pagamento não encontrado.');
    }

    try {
      // Verifique o token (por exemplo, usando JWT)
      const { paymentIntentId } = verify(paymentToken, authConfig.jwt.secret);
      return response.json({ status: 'ok', paymentIntentId });

    } catch (error) {
      throw new AppError('Token de pagamento inválido ou expirado.');
    }
  }
  
}
module.exports = WebhookController