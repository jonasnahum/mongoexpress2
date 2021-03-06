var express = require('express');
var router = express.Router();
var articulosFactory = require('../models/articulo');
var dbname = 'mongodb://localhost/articulos';
var mongoose = require('mongoose'); 
mongoose.connect(dbname);        
var db = mongoose.connection;

db.once('open', function (callback) {
    console.log("la conexion esta abierta en articulos..");
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tienda' });
});
router.get('/articulos', function(req, res, next) { 
    var Articulo = mongoose.model('Articulo');//for articulos collection in the database. 
    
    Articulo.find(function (err, articulos) {//recibe un array.
        if (err) return next(err);
        res.render('all', { articulos: articulos });
    }); 
});
router.get('/nuevo', function(req, res, next) {
    res.render('new');
});
router.post('/nuevo', function(req, res, next) {
    var articulo = articulosFactory({//alumnos regresa una instancia si le pasas config.
        producto: req.body.product, 
        precio: parseInt(req.body.price, 10) 
    });    
    
    articulo.save(function (err, data) {//alumno hecho new Alumno y schema en models.
        if (err) return next(err);
        res.redirect('/articulos');
    });            
});
router.get('/editar/:id', function(req, res, next) {
    var Articulo = mongoose.model('Articulo');
    
    Articulo.findById(req.params.id, function (err, articulo) {
        if (err) return next(err);
        res.render('edit', { id: articulo.id, producto: articulo.producto, precio:                 articulo.precio });
    });
});
router.post('/editar', function(req, res, next) {
    var Articulo = mongoose.model('Articulo');
    
    Articulo.findById(req.body.id, function (err, articulo) {
        if (err) return next(err);

        articulo.producto = req.body.product;
        articulo.precio = parseInt(req.body.price, 10);  
        
        articulo.save(function (err, data) {
            if (err) return next(err);
            res.redirect('/articulos');
        }); 
    });   
});

router.get('/borrar/:id', function(req, res, next) {
    var Articulo = mongoose.model('Articulo');
    
    Articulo.remove({ _id: req.params.id }, function (err) {
        if (err) return next(err);
        
        res.redirect('/articulos');
    });
});

router.get('/ver/:id', function(req, res, next) {
    var Articulo = mongoose.model('Articulo');
    
    Articulo.findById(req.params.id, function (err, articulo) {
        if (err) return next(err);
        res.render('view', { articulo: articulo });
    });
});






module.exports = router;

