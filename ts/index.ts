import express from 'express';
const router = express.Router();
import { Productos } from './Productos';

const PORT = '8080'
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const consolas = new Productos();

app.use('/api', router);

app.use('/api/public',express.static(__dirname + '/public'));
console.log(__dirname + '/public')

router.get('/productos', (req, res) => {
    if(consolas.getProductos().length < 1) res.json({error: 'No hay productos cargados'})
    else {
        res.send(consolas.getProductos());
    }
})
router.get('/productos/:id', (req, res) => {
    const id = req.params.id;
    const producto = consolas.findProducto(parseInt(id));
    if(!producto) res.json({error: 'Producto no encontrado'})
    else res.json(producto);
})

function validar (req:any, res:any, next:any):void {
    if(req.body.title === '' 
    || req.body.price === '' 
    || req.body.thumbnail === '') {
        res.send('No se completaron todos los campos del formulario');
        
    } else {
        req.body.price = parseInt(req.body.price);
        next();
    }
}

app.post('/agregarproducto', validar , (req, res) => {
    
    const producto = req.body;
    consolas.setProductos(producto);
    res.sendStatus(201);
})

router.post('/productos', (req, res) => {
    const producto = req.body;
    consolas.setProductos(producto);
    res.sendStatus(201);
})

router.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const producto = consolas.findProducto(id);
    if(!producto) res.sendStatus(404);
    else {
        const productoUpdated = {
            id: id,
            title: req.body.title,
            price: req.body.price,
            thumbnail: req.body.thumbnail
        }
        consolas.updateProducto(productoUpdated);
        res.json({
            "title": req.body.title,
            "price": req.body.price,
            "thumbnail": req.body.thumbnail,
            "id": id
        });
    }
})

router.delete('/productos/:id', (req, res) => {
    const id = req.params.id;
    const producto = consolas.findProducto(parseInt(id));
    if(!producto) res.sendStatus(404);
    else {
        consolas.deleteProducto(parseInt(id));
        res.json({
            message: 'Producto eliminado',
            producto: producto});
    } 
})

app
    .listen(PORT, () => console.log('Server listening in port ', PORT))
    .on("error", (err) => console.log(`Se ha producido el siguiente error: ${err}`));