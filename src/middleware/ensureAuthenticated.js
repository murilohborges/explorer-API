const { verify } = require("jsonwebtoken");
const AppError = require('../utils/AppError');
const authConfig = require('../configs/auth');

function ensureAuthenticated(request, response, next){
  const authHeader = request.headers;
  
  if(!authHeader.cookie){
    throw new AppError("JWT Token não informados", 401);
  }
  
  const tokens = authHeader.cookie.split(";");

  const authToken = tokens.filter((item) => item.includes('authToken='))
  const tokenForAuth = authToken[0].split("=")[1].trim();

  try {
    const { role, sub: user_id } = verify(tokenForAuth, authConfig.jwt.secret);
    
    request.user = {
      id: Number(user_id),
      role
    };
    return next();
  } catch{
    throw new AppError("JWT Token Inválido", 401);
  }
}

module.exports = ensureAuthenticated;