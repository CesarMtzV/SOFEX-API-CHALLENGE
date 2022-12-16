const { Model } = require("objection");

class Registros extends Model {
    static get tableName() {
        return "registros";
    }
}

module.exports = Registros;
