const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Configurar el motor de plantillas
app.set('views', './views');
app.set('view engine', 'ejs');

// Middleware para analizar el cuerpo de las solicitudes HTTP
app.use(bodyParser.urlencoded({ extended: true }));

// Directorio estático para archivos públicos
app.use(express.static('public'));

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/mongoLab07', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected!');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Definir el esquema del hotel
const hotelSchema = new mongoose.Schema({
  name: String,
  address: String,
  rating: Number,
  price: Number
});

// Crear el modelo Hotel
const Hotel = mongoose.model('Hotel', hotelSchema);

// Ruta para manejar la creación de un nuevo hotel
app.post('/nuevo-hotel', (req, res) => {
    // Obtener los datos del formulario
    const { name, address, rating, price } = req.body;
    
    // Crear un nuevo hotel utilizando el modelo Hotel
    const newHotel = new Hotel({
        name: name,
        address: address,
        rating: rating,
        price: price
    });

    // Guardar el nuevo hotel en la base de datos
    newHotel.save()
        .then(() => {
            console.log('Nuevo hotel creado');
            // Redirigir al usuario a la página de hoteles después de crear el hotel
            res.redirect('/hoteles');
        })
        .catch((error) => {
            console.error('Error creando nuevo hotel:', error);
            // Enviar un mensaje de error al usuario si ocurre un problema al crear el hotel
            res.send('Error creando nuevo hotel');
        });
});

// Ruta para mostrar todos los hoteles
app.get('/hoteles', (req, res) => {
    // Encontrar todos los hoteles en la base de datos
    Hotel.find()
        .then((hoteles) => {
            // Renderizar la vista 'hoteles.ejs' y pasar los datos de los hoteles como una variable
            res.render('hoteles.ejs', { hoteles: hoteles });
        })
        .catch((error) => {
            console.error('Error retrieving hotels:', error);
            // Enviar un mensaje de error si ocurre un problema al recuperar los hoteles
            res.send('Error retrieving hotels');
        });
});

// Ruta para mostrar el formulario de edición de un hotel específico
app.post('/editar-hotel', (req, res) => {
  const hotelId = req.body.hotelId;
  // Aquí puedes redirigir al usuario a la página de edición de hoteles y pasar el ID del hotel como parámetro
  res.redirect(`/hoteles/editar/${hotelId}`);
});

// Ruta para eliminar un hotel específico
app.post('/eliminar-hotel', (req, res) => {
  const hotelId = req.body.hotelId;
  // Aquí puedes implementar la lógica para eliminar el hotel de la base de datos utilizando el ID
  Hotel.findByIdAndDelete(hotelId)
      .then(() => {
          console.log('Hotel eliminado');
          res.redirect('/hoteles');
      })
      .catch((error) => {
          console.error('Error eliminando hotel:', error);
          res.send('Error eliminando hotel');
      });
});

// Ruta para mostrar el formulario de edición de un hotel específico
app.get('/hoteles/editar/:id', (req, res) => {
  const hotelId = req.params.id;
  // Aquí puedes encontrar el hotel por su ID en la base de datos y pasar los datos a la vista de edición de hoteles
  Hotel.findById(hotelId)
      .then((hotel) => {
          res.render('hotelesEditar.ejs', { hotel: hotel });
      })
      .catch((error) => {
          console.error('Error obteniendo hotel para edición:', error);
          res.send('Error obteniendo hotel para edición');
      });
});

// Ruta para manejar la actualización de un hotel
app.post('/actualizar-hotel', (req, res) => {
  const hotelId = req.body.hotelId;
  const { name, address, rating, price } = req.body;
  
  // Encuentra el hotel por su ID y actualiza los campos
  Hotel.findByIdAndUpdate(hotelId, {
      name: name,
      address: address,
      rating: rating,
      price: price
  })
  .then(() => {
      console.log('Hotel actualizado');
      res.redirect('/hoteles');
  })
  .catch((error) => {
      console.error('Error actualizando hotel:', error);
      res.send('Error actualizando hotel');
  });
});


// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Aplicación web dinámica ejecutándose en el puerto 3000');
});
