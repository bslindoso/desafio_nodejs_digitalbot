import express from "express";
import usuarios from "./usuariosRoutes.js";
import enderecos from "./enderecosRoutes.js";

const routes = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send({message: 'Curso de Node by Bruno Lindoso'});
    })

    app.use(
        express.json(),
        usuarios,
        enderecos
    )
}

export default routes;