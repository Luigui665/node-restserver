const express = require("express");
const _ = require("underscore");
let {
    verificaToken,
    verificaAdmin_Role
} = require("../middlewares/autenticacion");

let app = express();

let Categoria = require("../models/categoria");

//Mostrar todas las categorias
app.get("/categoria", verificaToken, (req, res) => {
    Categoria.find({})
        .sort("descripcion")
        .populate("usuario", "nombre email")
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            //Categoria.count({}, (err, conteo) => {
            res.json({
                ok: true,
                categoria
                //cuantas: conteo
            });
            //});
        });
});

//Mostrar una categoría por id
app.get("/categoria/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoría no encontrada"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});

//Crear nueva categoría
app.post("/categoria", [verificaToken, verificaAdmin_Role], (req, res) => {
    //Regresa la nueva categoría
    //req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//Actualiar categoría
app.put("/categoria/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    //let body = _.pick(req.body, ["descripcion"]);
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(
        id,
        descCategoria, { new: true, runValidators: false },
        (err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Categoría no encontrada"
                    }
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });
        }
    );
});

//Eliminar categoría
app.delete(
    "/categoria/:id", [verificaToken, verificaAdmin_Role],
    (req, res) => {
        let id = req.params.id;
        Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaBorrada) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Categoría no encontrada"
                    }
                });
            }

            res.json({
                ok: true,
                categoria: categoriaBorrada,
                message: "Categoría borrada"
            });
        });
    }
);

module.exports = app;