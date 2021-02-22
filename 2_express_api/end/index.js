const express = require('express');
const app = express();
const PORT = 8000;
const SECRET_KEY = 'get_programming';

const data = {
  products: [{
      name: 'jeans',
      inventory: 2
    },
    {
      name: 'jackets',
      inventory: 0
    },
    {
      name: 'hats',
      inventory: 12
  }]
}

const router = express.Router();
app.use(express.json());
app.use('/v1', router);

function authMiddleware (req, res, next) {
  const auth = req.headers.authorization;
  const decoded = jwt.verify(auth, SECRET_KEY);
  if (decoded && decoded.email) {
    next()
  } else {
    res.send({ message: 'Unauthorized request.' });
  }
}

function productRouter () {
  const productRouter = express.Router();
  productRouter.use(authMiddleware);
  productRouter.get('/', (req, res) => {
    res.status(200).send(data.products)
  })
  productRouter.get('/:name', (req, res) => {
    let result = data.products.filter(item => {
      return item.name.includes(req.params.name)
    })
    res.status(200).send(result)
  })

  productRouter.post('/', (req, res) => {
    const { name, inventory } = req.body;
    console.log(`Saving ${inventory} of ${name}.`);
    res.status(200).send({ message: "Data Saved." });
  })

  return productRouter;
}

const jwt = require('jsonwebtoken');

function authRouter () {
  const authRouter = express.Router();
  authRouter.post('/key', (req, res) => {
    const { email } = req.body;
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '24h' });
    console.log(`Saving ${email} with token: ${token}.`);
    res.status(200).send({ token });
  })
  return authRouter;
}

router.use('/products', productRouter())
router.use('/auth', authRouter())

app.listen(PORT, () => console.log('Server is up!'));