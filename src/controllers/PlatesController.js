const sqliteConnection = require("../database/sqlite");
const { response } = require("express");
const knex = require("../database/knex");
const AppError = require("../utils/AppError")

class PlatesController {
  async create(request, response) {
    const { title, category, price, description, ingredients } = request.body;
    const user_id = request.user.id;

    const [plate_id] = await knex("plates").insert({
      title, 
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

    const plate = await knex("plates").where({ id });
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
    const { title, ingredients } = request.query;
    const user_id = request.user.id;

    let plates;

    if(ingredients){
      const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());

      plates = await knex("ingredients").select([
        "plates.id",
        "plates.title",
        "plates.user_id"
      ]).where("plates.user_id", user_id).whereLike("plates.title", `%${title}%`).whereIn("name", filterIngredients).innerJoin("plates", "plates.id", "ingredients.plate_id").orderBy("plates.title");

    }else{

      plates = await knex("plates").where({ user_id }).whereLike("title", `%${title}%`).orderBy("title");

    }

    const userIngredients = await knex("ingredients").where({ user_id });
    const platesWithIngredients = plates.map(plate => {
      const plateIngredients = userIngredients.filter(ingredient => ingredient.plate_id === plate.id);

      return {
        ...plate,
        ingredients: plateIngredients
      }
    });
    

    return response.json(platesWithIngredients);

  }

  async update(request, response) {
    const { title, category, price, description, ingredients } = request.body;
    const { id } = request.params;
    const user_id = request.user.id;

    const database = await sqliteConnection();
    const plate = await database.get("SELECT * FROM plates WHERE id = (?)", [id]);

    if (!plate) {
      throw new AppError("Prato não encontrado");
    }

    const plateWithUpdatedTitle = await database.get("SELECT * FROM plates WHERE title = (?)", [title]);

    if(plateWithUpdatedTitle && plateWithUpdatedTitle.id !== plate.id) {
      throw new AppError("Este título de prato já está em uso.");
    }

    plate.title = title ?? plate.title;
    plate.category = category ?? plate.category;
    plate.price = price ?? plate.price;
    plate.description = description ?? plate.description;

    await database.run(`
    UPDATE plates SET
    title = ?,
    category = ?,
    price = ?,
    description = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
    [plate.title, plate.category, plate.price, plate.description, id]);

    const ingredientsUpdatedInsert = ingredients.map(name => {
      return {
        plate_id: Number(id),
        name,
        user_id: String(user_id)
      }
    })
    
    await knex("ingredients").where("plate_id", id).delete();

    await knex("ingredients").insert(ingredientsUpdatedInsert);

    return response.status(200).json();
  }
}

module.exports = PlatesController