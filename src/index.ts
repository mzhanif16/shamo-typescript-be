import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import ormconfig from './ormconfig';
import { UserController } from './controllers/UserController';
import { authenticate } from './middleware/authMiddleware';
import { ProductController } from './controllers/ProductController';
import { ProductCategoryController } from './controllers/ProductCategoryController';
import { TransactionController } from './controllers/TransactionController';

createConnection(ormconfig).then(async connection => {
    const app = express();

    app.use(express.json());

    app.post('/register', UserController.register);
    app.post('/login', UserController.login);

    app.get('/fetch', authenticate, UserController.fetch);
    app.put('/profile', authenticate, UserController.updateProfile);
    app.post('/logout', authenticate, UserController.logout);

    app.get('/product', authenticate, ProductController.all);

    app.get('/categories', authenticate, ProductCategoryController.all);

    app.get('/transaction', authenticate, TransactionController.all);
    app.get('/checkout', authenticate, TransactionController.checkout);



    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch(error => console.log(error));
