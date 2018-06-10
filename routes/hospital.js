
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

// ===============================
// Obtener todos los hospitales
// ===============================
app.get('/', (req, res) => {

    var pag = req.query.pag || 0;
    pag = Number(pag);

    Hospital.find({})
        .skip(pag)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
        (err, hospital) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: err
                });
            }

            Hospital.count({}, (err, contador) => {
                res.status(200).json({
                    ok: true,
                    hospital: hospital,
                    total: contador
                });
            });
        }
    );
});

// ===============================
// Crear un nuevo hospital
// ===============================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
       if(err){
           return res.status(400).json({
               ok: false,
               mensaje: 'Error al crear el hospitales',
               errors: err
           });
       }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    });
});

// ===============================
// Actualizar un nuevo hospital
// ===============================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
       if(err){
           return res.status(500).json({
               ok: false,
               mensaje: 'Error al buscar el hospitales',
               errors: err
           });
       }

       if(!hospital){
           return res.status(404).json({
               ok: false,
               mensaje: 'Hospital no encontrado',
               errors: {message: 'Hospital no encontrado'}
           });
       }

       hospital.nombre = body.nombre;
       hospital.usuario = req.usuario._id;

       hospital.save((err, hospitalGuardado) => {
           if(err){
               return res.status(400).json({
                   ok: false,
                   mensaje: 'Error al actualizar el hospitales',
                   errors: err
               });
           }

           res.status(200).json({
               ok: true,
               hospital: hospitalGuardado
           });

       })

    });
});

// ===============================
// Borrar un hospital
// ===============================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar el hospitales',
                errors: err
            });
        }

        if(!hospitalBorrado){
            return res.status(404).json({
                ok: false,
                mensaje: 'Hospital no encontrado',
                errors: {message: 'Hospital no encontrado'}
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });
});

module.exports = app;