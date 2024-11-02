const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const authConfig = require("../configs/auth");
const { verify, sign } = require("jsonwebtoken");

class StripeController {
  async create(request, response){
    const database = await knex("plates");
    const listItems = database.map((item) => {
      let stripeItem = [item.id, {priceInReal: Math.round((item.price * 100)), name: item.title}]
      return stripeItem
    });
    const storeItemsForStripe = new Map(listItems);

    try{
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: request.body.itemsUser.map(item => {
          const storeItem = storeItemsForStripe.get(item.plate_id)
          return {
            price_data: {
              currency: 'brl',
              product_data: {
                name: storeItem.name
              },
              unit_amount: storeItem.priceInReal,
            },
            quantity: item.plate_amount,
          }
        }),
        success_url: `${process.env.SERVER_URL}/success-payment`,
        cancel_url: `${process.env.SERVER_URL}/cart`
      });

      const tokenSessionPayload = {
        session_id: session.id
      };
      
      const { secret } = authConfig.jwt;
      const tokenSession = sign(tokenSessionPayload, secret, {
        expiresIn: "3600s"
      })
      
      response.cookie("tokenSession", tokenSession, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 60 * 60 * 1000
      })

      return response.status(200).json({ url: session.url })
    }catch(e){
      throw new AppError("Erro ao avançar para Checkout");
    }
  }
  
}
module.exports = StripeController