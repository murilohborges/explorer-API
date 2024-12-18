const sqliteConnection = require("../database/sqlite");
const { hash, compare } = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../utils/AppError")

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;
    
    const database = await sqliteConnection();
    const checkUserExist = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if (checkUserExist) {
      throw new AppError("Este e-mail já está em uso.");
    }

    if(!name){
      throw new AppError("Nome é obrigatório");
    }

    if(password.length < 6){
      throw new AppError("Senha deve possuir no mínimo 6 caracteres");
    }

    const hashedPassword = await hash(password, 8);

    await database.run("INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, ?, ?, DATETIME('now', 'localtime'), DATETIME('now', 'localtime'))", 
      [name, email, hashedPassword]
    );

    response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;


    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso.");
    }

    user.name = name == "" ? user.name : name;
    user.email = email == "" ? user.email : email;

    if (password && !old_password) {
      throw new AppError("Você deve informar a senha antiga")
    }

    if (password && old_password) {
      if(password.length < 6){
        throw new AppError("Senha deve possuir no mínimo 6 caracteres");
      }
      
      const checkOldPassword = await compare(old_password, user.password);

      if(!checkOldPassword) {
        throw new AppError("A senha antiga não confere");
      }
      
      user.password = await hash(password, 8);
    }

    await database.run(`
    UPDATE users SET
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now', 'localtime') 
    WHERE id = ?`,
    [user.name, user.email, user.password, user_id]);

    return response.status(200).json({ });
  }

  async index(request, response) {
    const { user_id_customer } = request.query;
    try{
      const customer = await knex('users').where({ id: Number(user_id_customer) });
      const customer_name = customer[0].name;
      return response.status(200).json({ customer_name });
    }catch(e){
      throw new AppError("Cliente não encontrado!")
    }
  }

}

module.exports = UsersController