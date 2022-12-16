/**
 * This method is used to apply the changes
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable("empleado", (table) => {
            // Primary Key
            table.string("id").notNullable();
            table.primary(["id"]);

            table.string("nombre").notNullable();
            table.string("apellido").notNullable();
            table.decimal("salario_semanal").notNullable();
            table.integer("registro_actual");
            table.timestamps(true, true);
        })
        .createTable("cargo", (table) => {
            // Primary Key
            table.increments();

            table.string("nombre_cargo").notNullable();
            table.timestamps(true, true);
        })
        .createTable("registros", (table) => {
            // Primary Key
            table.increments();

            // Foreign Key
            table
                .string("id_empleado")
                .references("id")
                .inTable("empleado")
                .notNullable();
            table.string("id_semana");
            table.datetime("registro_entrada").notNullable();
            table.datetime("registro_salida");
            table.timestamps(true, true);
        })
        .createTable("semana", (table) => {
            // Primary Key
            table.increments();

            //Foreign Key
            table
                .string("id_empleado")
                .references("id")
                .inTable("empleado")
                .notNullable();

            table.date("fecha_inicio").notNullable();
            table.decimal("pago_final_semana").notNullable();
            table.decimal("horas_trabajadas");
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
