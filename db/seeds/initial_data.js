/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Truncate tables so we don't insert the tables twice
    await knex.raw('TRUNCATE TABLE "empleado" CASCADE');
    await knex.raw('TRUNCATE TABLE "cargo" CASCADE');
    await knex.raw('TRUNCATE TABLE "registros" CASCADE');
    await knex.raw('TRUNCATE TABLE "semana" CASCADE');

    await knex("empleado").insert([
        { id: 1, nombre: "Ruperto", apellido: "Martinez" },
        { id: 2, nombre: "Porfirio", apellido: "Fernandez" },
        { id: 3, nombre: "Agripino", apellido: "Perez" },
    ]);

    await knex("cargo").insert([
        {
            id: 1,
            nombre_cargo: "Software Engineer",
            salario_semanal: 10000.0,
            id_empleado: 1,
        },
        {
            id: 2,
            nombre_cargo: "Human Resources",
            salario_semanal: 10000.0,
            id_empleado: 1,
        },
        {
            id: 3,
            nombre_cargo: "Recruiting",
            salario_semanal: 10000.0,
            id_empleado: 2,
        },
    ]);

    await knex("registros").insert([
        {
            id: 1,
            id_empleado: 1,
            registro_entrada: "2022-12-05T09:00 AM",
            registro_salida: "2022-12-05T05:00 PM",
        },
        {
            id: 2,
            id_empleado: 3,
            registro_entrada: "2022-12-05T09:00 AM",
            registro_salida: "2022-12-05T05:00 PM",
        },
    ]);

    return knex("semana").insert([
        {
            id: 1,
            id_empleado: 1,
            fecha_inicio: "2022-12-05",
            pago_final_semana: 10000.0,
        },
        {
            id: 2,
            id_empleado: 3,
            fecha_inicio: "2022-12-05",
            pago_final_semana: 10000.0,
        },
    ]);
};
