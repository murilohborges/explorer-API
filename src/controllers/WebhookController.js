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
    let payment_status;

    try {
      const payload = request.body.toString('utf8');
      event = stripe.webhooks.constructEvent(payload, sig, `${process.env.WEBHOOK_SIGNING_SECRET}`);
    } catch (e) {
      throw new AppError(`Erro de verificação de assinatura:`, e.message);
    }

    if(event.type === 'checkout.session.completed'){
      payment_status = event.data.object.payment_status
      const tokenPayload = {
        paymentStatus: payment_status
      };
      
      const { secret } = authConfig.jwt;
      paymentToken = sign(tokenPayload, secret, {
        expiresIn: '1d'
      })
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
    }
    
    return response.status(201).json({ message: "Token de pagamento gerado com sucesso" });
  }

  async index(request, response){
    const authHeader = request.headers;
    const tokens = authHeader.cookie.split(";");
    const tokenSession = tokens.filter((item) => item.includes('tokenSession='))
    const tokenForSessionStripe = tokenSession[0].split("=")[1].trim();
    
    let sessionIdFromClient;
    let paymentToken;
    let statusPayment;
    
    try {
      const { session_id } = verify(tokenForSessionStripe, authConfig.jwt.secret);
      sessionIdFromClient = session_id
      
    } catch{
      throw new AppError("JWT Token Inválido do cookie do cliente", 401);
    }
    
    try {
      const registerPaymentToken = await knex('payment_tokens').where({ sessionId: sessionIdFromClient})
      paymentToken = registerPaymentToken[0].token;
      
    } catch{
      throw new AppError("Sessão da Stripe não encontrada", 400);
    }

    try {
      const { paymentStatus } = verify(paymentToken, authConfig.jwt.secret);
      statusPayment = paymentStatus
    } catch{
      throw new AppError("JWT Token Inválido do token do servidor", 401);
    }

    if( statusPayment === "paid"){
      await knex('payment_tokens').where({ sessionId: sessionIdFromClient }).del();
      return response.status(200).json({ message: "Pagamento confirmado!" });
    }
  }
  
}
module.exports = WebhookController