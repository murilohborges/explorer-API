const sqliteConnection = require("../database/sqlite");
const { response } = require("express");
const knex = require("../database/knex");
const AppError = require("../utils/AppError")

class FavPlatesController {
  async create(request, response) {
    const { id } = request.params;
    const user_id = request.user.id;

    const plate = await knex("plates").where({ id });

    const checkFavPlateExist = await knex("favourites").where({ plate_id: plate[0].id})
    
    if( checkFavPlateExist ){
      var checkFavPlateExist_user_id = checkFavPlateExist.map((favPlate) => favPlate.user_id_who_favourited)
    }

    if( checkFavPlateExist && checkFavPlateExist_user_id.includes(user_id)){
      throw new AppError("");
    }

    const [fav_plate_id] = await knex("favourites").insert({
      plate_id: plate[0].id,
      user_id_who_favourited: user_id,
    })

    response.json({ fav_plate_id });
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

  async index(request, response) {
    const { title } = request.query;
    const user_id = request.user.id;

    let favPlatesFilteredByTitle = await knex("favourites").where("user_id_who_favourited", user_id).innerJoin("plates", "plates.id", "favourites.plate_id").whereLike("title", `%${title}%`)
    
    return response.json(favPlatesFilteredByTitle);

  }

  async delete(request, response) {
    const { id } = request.params;
    const user_id = request.user.id;

    await knex("favourites").where({ user_id_who_favourited: user_id }).where({ plate_id: id }).delete();

    return response.json();
  }
}

module.exports = FavPlatesController