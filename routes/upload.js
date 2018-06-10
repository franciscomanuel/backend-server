var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

app.use(fileUpload());

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colección
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if(tiposValidos.indexOf(tipo) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no valida',
            errors: {message: 'Tipo de colección no valida'}
        });
    }

    if(!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó ningun archivo',
            errors: {message: 'Debe seleccionar una imagen'}
        });
    }

    // Obtener nombre del archivo.
    var archivo = req.files.imagen;
    var archivoCortado = archivo.name.split('.');
    var extension = archivoCortado[archivoCortado.length-1];

    // Validamos las extensiones del archivo.
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidas.indexOf(extension) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no valido',
            errors: {message: 'Las extensiones validas son: ' + extensionesValidas.join(', ')}
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${extension}`;

    // Mover el archivo del temporal a un path
    var path = `./upload/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res)

    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if(tipo === 'usuarios'){
        Usuario.findById(id, (err, usuario) => {

            if(!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'El usuario no existe',
                    errors: {message: 'El usuario no existe'}
                });
            }

            var pathViejo = './upload/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }
    if(tipo === 'medicos'){
        Medico.findById(id, (err, medico) => {

            if(!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'El medico no existe',
                    errors: {message: 'El medico no existe'}
                });
            }

            var pathViejo = './upload/medicos/' + medico.img;

            // Si existe, elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada',
                    medico: medicoActualizado
                });
            });
        });
    }
    if(tipo === 'hospitales'){
        Hospital.findById(id, (err, hospital) => {

            if(!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'El hospital no existe',
                    errors: {message: 'El hospital no existe'}
                });
            }

            var pathViejo = './upload/hospitales/' + hospital.img;

            // Si existe, elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada',
                    hospital: hospitalActualizado
                });
            });
        });
    }
}

module.exports = app;