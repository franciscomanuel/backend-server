
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

// ===============================
// Obtener todos los médicos
// ===============================
app.get('/', (req, res) => {

    var pag = req.query.pag || 0;
    pag = Number(pag);

    Medico.find({})
        .skip(pag)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
        (err, medico) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando los médicos',
                    errors: err
                });
            }

            Medico.count({}, (err, contador) => {
                res.status(200).json({
                    ok: true,
                    medico: medico,
                    total: contador
                });
            });
        }
    );
});

// ===============================
// Crear un nuevo médico
// ===============================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });

    });
});


// ===============================
// Actualizar un nuevo médico
// ===============================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el medico',
                errors: err
            });
        }

        if(!medico){
            return res.status(404).json({
                ok: false,
                mensaje: 'Medico no encontrado',
                errors: {message: 'Medico no encontrado'}
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el médico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        })

    });
});

// ===============================
// Borrar un médico
// ===============================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar el médico',
                errors: err
            });
        }

        if(!medicoBorrado){
            return res.status(404).json({
                ok: false,
                mensaje: 'Médico no encontrado',
                errors: {message: 'Médico no encontrado'}
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });
});

module.exports = app;