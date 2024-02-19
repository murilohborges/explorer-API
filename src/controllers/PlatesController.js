const sqliteConnection = require("../database/sqlite");
const { response } = require("express");
const knex = require("../database/knex");

class PlatesController {
  async create(request, response) {
    const { name, category, price, description, ingredients } = request.body;
    const { user_id } = request.params;

    const [plate_id] = await knex("plates").insert({
      name, 
      category, 
      price, 
      description,
      user_id
    })

    const ingredientsInsert = ingredients.map(name => {
      return {
        plate_id,
        name,
        user_id
      }
    })

    await knex("ingredients").insert(ingredientsInsert);

    response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const plate = await knex("plates").where({ id }).first();
    const ingredients = await knex("ingredients").where({ plate_id: id }).orderBy("name");
  
    return response.json({
      ...plate,
      ingredients
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("plates").where({ id }).delete();

    return response.json();

  }

  async index(request, response) {
    const { name, user_id, ingredients } = request.query;

    let plates;

    if(ingredients){
      const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());

      plates = await knex("ingredients").whereIn("name", filterIngredients);
    }else{
      plates = await knex("plates").where({ user_id }).whereLike("name", `%${name}%`).orderBy("name");
    }

    

    return response.json(plates);

  }
}

module.exports = PlatesController