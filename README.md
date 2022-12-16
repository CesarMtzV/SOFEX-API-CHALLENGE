# SOFEX API Challenge

Aquí se encuentra mi solución para el reto de SOFEX de construir una API usando Node, Knex y Objection. Todo esto con una base de datos de Postgres corriendo localmente.

## Instrucciones de ejecución

Previamente se tiene que haber creado una base de datos local en Postgres llamada `sofex-challenge` con un usuario `postgres`.

Instalar paquetes de node:

```bash
npm i
```

Crear la migración a la base de datos

```bash
npm run migrate
```

Iniciar el servidor:

```bash
npm run dev
```

**OPCIONAL**

En caso de realizar cambios al esquema y se tenga que revertir una migración, ejecutar:

```bash
npm run down
```
