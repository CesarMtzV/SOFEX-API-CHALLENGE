const { Model } = require("objection");

class Empleado extends Model {
    static get tableName() {
        return "empleado";
    }
}

module.exports = Empleado;
