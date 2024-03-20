const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage")

class UserAvatarController {
  async update(request, response) {
    const user_id = request.user.id;
    const { id } = request.params;
    const avatarFilename = request.file.filename;
    
    const diskStorage = new DiskStorage();


    const plate = await knex("plates").where({ id }).first();

    const user = await knex("users").where({ id: user_id }).first();

    if(!user) {
      throw new AppError("Somente usuários autenticados podem mudar o avatar do prato", 401);
    }

    if(plate.avatar) {
      await diskStorage.deleteFile(plate.avatar);
    }

    const filename = await diskStorage.saveFile(avatarFilename);

    plate.avatar = filename;

    await knex("plates").update(plate).where({ id });

    return response.json(plate);

  }

}

module.exports = UserAvatarController;