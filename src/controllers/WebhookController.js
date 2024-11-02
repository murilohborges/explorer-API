const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");
const { verify, sign } = require("jsonwebtoken");

class WebhookController {
  async create(request, response){
    const sig = request.headers['stripe-signature'];
    let event;

    try {
      const payload = request.body.toString('utf8');
      event = stripe.webhooks.constructEvent(payload, sig, `${process.env.WEBHOOK_SIGNING_SECRET}`);
    } catch (e) {
      throw new AppError(`Erro de verificação de assinatura:`, e.message);
    }
    console.log("event:")
    console.log(event)

    console.log("event.data:")
    console.log(event.data)

    
    // if (event.type === 'payment_intent.succeeded') {
    //   // const paymentIntent = event.data.object;
      
    //   // const tokenPayload = {
    //   //   paymentIntentId: paymentIntent.id,
    //   //   amount: paymentIntent.amount,
    //   //   currency: paymentIntent.currency,
    //   //   status: paymentIntent.status,
    //   // };

    //   const tokenPayload = { teste: 'asjndkjan' }
      
    //   const { secret } = authConfig.jwt;
    //   const paymentToken = sign(tokenPayload, secret, {
    //     expiresIn: '60s'
    //   })

    // }
    
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