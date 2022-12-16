const db_setup = require("./db/db-setup");
const express = require("express");
const app = express();

// Models
const Empleado = require("./db/models/empleado");
const Registros = require("./db/models/registros");
const Semana = require("./db/models/semana");

db_setup();

app.use(express.json());

// CONSTANTES
const HORAS_SEMANALES = 45;

// Generar Informe de pagos
app.use("/empleado/generar-informe-de-pagos", async (req, res) => {
    try {
        const { id_empleado, fecha_inicio } = req.body;
        const semana = await Semana.query()
            .select("horas_trabajadas", "pago_final_semana", "id_empleado")
            .where("fecha_inicio", "=", fecha_inicio);

        // Obtener la información de todos los empleados
        if (id_empleado === null) {
            const empleados = await Empleado.query();

            var data = [];

            empleados.forEach((empleado) => {
                semana.forEach((item) => {
                    if (item.id_empleado === empleado.id) {
                        data.push({
                            id_empleado: empleado.id,
                            horas_trabajadas: item.horas_trabajadas,
                            cantidad_a_pagar: item.pago_final_semana,
                        });
                    }
                });
            });
            res.json(data);
        } else {
            // Obtener la información de un solo empleado
            var data = {
                id_empleado: id_empleado,
                tiempo_trabajado: 0.0,
                cantidad_a_pagar: 0.0,
            };
            const empleado = await Empleado.query().findById(id_empleado);
            semana.forEach((item) => {
                if (item.id_empleado === id_empleado) {
                    data.tiempo_trabajado = item.horas_trabajadas;
                    data.cantidad_a_pagar = item.pago_final_semana;
                }
            });

            res.json(data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Registrar a un nuevo empleado
app.post("/empleado/registro-de-personal", async (req, res) => {
    try {
        const { id, nombre, apellido, salario_semanal } = req.body;
        const nuevo_empleado = await Empleado.query().insert({
            id: id,
            nombre: nombre,
            apellido: apellido,
            salario_semanal: salario_semanal,
        });
        res.json(nuevo_empleado);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Registrar una entrada
app.post("/registros/registro-de-entrada", async (req, res) => {
    try {
        const { id_empleado } = req.body;
        const horario_entrada = new Date(Date.now()).toISOString();
        const horario_salida = new Date(
            Date.now() + 9 * 60 * 60 * 1000
        ).toISOString();

        // Crear el nuevo registro en tabla de Registros
        const nuevo_registro = await Registros.query().insert({
            id_empleado: id_empleado,
            registro_entrada: horario_entrada,
            registro_salida: horario_salida,
        });

        // Asignarle al empleado el registro actual
        const empleado_actualizado = await Empleado.query()
            .findOne({
                id: id_empleado,
            })
            .patch({
                registro_actual: nuevo_registro.id,
            });
        res.json(nuevo_registro);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Registrar una salida
app.put("/registros/registro-de-salida", async (req, res) => {
    try {
        const { id_empleado, id_semana } = req.body;
        const horario_salida = new Date(Date.now()).toISOString();

        // Encontrar el empleado que marcó su salida
        const empleado = await Empleado.query().findById(id_empleado);

        // Guardar la hora de salida
        var registro_empleado = await Registros.query()
            .findById(empleado.registro_actual)
            // .patch({
            //     registro_salida: horario_salida,
            // });
            .patch({
                registro_salida: "2022-12-16T19:10:01.690Z",
            });

        // Obtener el número de horas trabajadas hoy
        registro_empleado = await Registros.query().findById(
            empleado.registro_actual
        );
        var horas_trabajadas_hoy = parseFloat(
            (registro_empleado.registro_salida -
                registro_empleado.registro_entrada) /
                (1000 * 60 * 60),
            100
        );

        // Calcular el salario ganado el día de hoy
        var cantidad_ganada_hoy =
            horas_trabajadas_hoy *
            (parseFloat(empleado.salario_semanal) / HORAS_SEMANALES);

        // Obtener el número de horas trabajadas hasta el momento en la semana
        var semana = await Semana.query().findOne({
            id: id_semana,
            id_empleado: id_empleado,
        });

        // Sumar el numero de horas en la semana mas las de hoy
        var horas_trabajadas_semana =
            horas_trabajadas_hoy + parseInt(semana.horas_trabajadas);

        // Actualizar número de horas
        const horas_actualizadas = await Semana.query()
            .findOne({
                id: id_semana,
                id_empleado: id_empleado,
            })
            .patch({
                horas_trabajadas: horas_trabajadas_semana,
                pago_final_semana:
                    cantidad_ganada_hoy + parseFloat(semana.pago_final_semana),
            });

        res.json(registro_empleado);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Registrar una semana
app.post("/semana/comienza-semana", async (req, res) => {
    try {
        const { id_empleado } = req.body;
        const fecha_inicio = new Date(Date.now()).toISOString();

        const nuevo_registro = await Semana.query().insert({
            id_empleado: id_empleado,
            fecha_inicio: fecha_inicio,
            pago_final_semana: 0.0,
        });
        res.json(nuevo_registro);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// Editar un empleado
app.put("/empleado/editar-empleado", async (req, res) => {
    try {
        const { id_empleado, nombre, apellido, salario } = req.body;

        const empleado = await Empleado.query().findById(id_empleado).patch({
            nombre: nombre,
            apellido: apellido,
            salario_semanal: salario,
        });

        if (empleado == 1) {
            res.json("Empleado actualizado exitosamente");
        }

        res.json(empleado);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

app.delete("/empleado/eliminar-empleado", async (req, res) => {
    try {
        const { id_empleado } = req.body;
        const empleado = await Empleado.query().deleteById(id_empleado);

        if (empleado == 1) {
            res.json("Empleado borrado exitosamente");
        }

        res.json(empleado);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

app.listen(8080, () => console.log("Server running on port 8080"));
