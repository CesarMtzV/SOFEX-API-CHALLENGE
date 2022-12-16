const { knexSnakeCaseMappers } = require("objection");

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    development: {
        client: "postgresql",
        connection: {
            database: "sofex-challenge",
            user: "postgres",
            password: null,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
        // The initial directory where we store files that create initial data
        seeds: {
            directory: "./seeds",
        },
        ...knexSnakeCaseMappers,
    },
};
