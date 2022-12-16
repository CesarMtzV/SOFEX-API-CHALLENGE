const { Model } = require("objection");

class Semana extends Model {
    static get tableName() {
        return "semana";
    }
}

module.exports = Semana;
