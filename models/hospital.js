
var mongose = require('mongoose');
var Schema = mongose.Schema;

var hospitalSchema = new Schema({
    nombre: {type: String, required: [true, 'El nombre es obligatorio']},
    img: {type: String, required: false},
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'}, // Hace referencia al id de un usuario
}, {collection: 'hospitales'});

module.exports = mongose.model('Hospital', hospitalSchema);