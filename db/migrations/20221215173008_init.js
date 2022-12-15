/**
 * This method is used to apply the changes
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable("empleado", (table) => {
            // Primary Key
            table.increments();

            table.string("nombre").notNullable();
            table.string("appellido").notNullable();
            table.timestamps(true, true);
        })
        .createTable("cargo", (table) => {
            // Primary Key
            table.increments();

            // Foreign Key
            table
                .integer("id_empleado")
                .reference("id")
                .inTable("empleado")
                .notNullable();

            table.string("nombre_cargo").notNullable();
            table.decimal("salario_semanal").notNullable();
            table.timestamps(true, true);
        })
        .createTable("registros", (table) => {
            // Primary Key
            table.increments();

            // Foreign Key
            table
                .integer("id_empleado")
                .reference("id")
                .inTable("empleado")
                .notNullable();

            table.string("registro_entrada").notNullable();
            table.string("registro_salida").notNullable();
            table.timestamps(true, true);
        })
        .createTable("semana", (table) => {
            // Primary Key
            table.increments();

            //Foreign Keys
            table
                .integer("id_empleado")
                .reference("id")
                .inTable("empleado")
                .notNullable();

            table.date("fecha_inicio").notNullable();
            table.decimal("pago_final_semana").notNullable();
            table.timestamps(true, true);
        });
};

/**
 * This method is to roll back all the changes
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropSchemaIfExists("empleado")
        .dropSchemaIfExists("cargo")
        .dropSchemaIfExists("registros")
        .dropSchemaIfExists("semana");
};
