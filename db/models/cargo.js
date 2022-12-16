const { Model } = require("objection");

class Cargo extends Model {
    static get tableName() {
        return "cargo";
    }
}

module.exports = Cargo;
