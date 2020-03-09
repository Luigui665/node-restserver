const express = require("express");
const _ = require("underscore");

const {
    verificaToken,
    verificaAdmin_Role
} = require("../middlewares/autenticacion");

let app = express();

let Producto = require("../models/producto");

//Obtener productos
app.get("/productos", verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort("nombre")
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            //Categoria.count({}, (err, conteo) => {
            res.json({
                ok: true,
                producto
                //cuantas: conteo
            });
            //});
        });
});

//Obtener productos por id
app.get("/productos/:id", (req, res) => {
    //populate: usuario categoria
    let id = req.params.id;
    Producto.findById(id)
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Producto no encontrado"
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoBD
            });
        });
});

//Buscar productos
app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, "i");
    Producto.find({ nombre: regex })
        .populate("categoria", "descripcion")
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

//Crear producto
app.post("/productos", [verificaToken, verificaAdmin_Role], (req, res) => {
    //grabar el usuario
    //garabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // res.json({
        //     ok: true,
        //     producto: productoDB
        // });
        res.status(201).json({
            ok: true,
            producto: productoBD
        });
    });
});

//Actualiar producto
app.put("/productos/:id", (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, [
        "nombre",
        "precioUni",
        "descripcion",
        "categoria",
        "disponible"
    ]);

    Producto.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Producto no encontrado"
                    }
                });
            }

            // res.json({
            //     ok: true,
            //     producto: productoDB
            // });

            productoDB.nombre = body.nombre;
            productoDB.precioUni = body.precioUni;
            productoDB.descripcion = body.descripcion;
            productoDB.categoria = body.categoria;
            productoDB.disponible = body.disponible;

            productoDB.save((err, productoGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    producto: productoGuardado
                });
            });
        }
    );
});

//Borrar  producto
app.delete("/productos/:id", (req, res) => {
    //cambiar estado disponible
    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    };

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Producto.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true },
        (err, productoBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Producto no encontrado"
                    }
                });
            }

            res.json({
                ok: true,
                usuario: productoBD
            });
        }
    );
});

module.exports = app;