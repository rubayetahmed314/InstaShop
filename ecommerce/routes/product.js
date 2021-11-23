const express = require('express');
const router = express.Router();

const {
    create,
    productById,
    read,
    remove,
    update,
    rating,
    list,
    listRelated,
    listCategories,
    listBySearch,
    photo,
    listSearch,
} = require('../controllers/product');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/product/:productId', read);
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete(
    '/product/:productId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    remove
);
router.put(
    '/product/:productId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    update
);

router.put('/product/rating/:productId/:userId', requireSignin, isAuth, rating);

router.get('/products', list);
router.get('/products/search', listSearch);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories', listCategories);
router.post('/products/by/search', listBySearch); // যদিও এটা search products যা normally GET request হয়, কিন্তু, এটা করার জন্য 'request body' তে থাকা price range, categories ইত্যাদি info access করা লাগে, তাই POST method ব্যবহার করতে হয়েছে
router.get('/product/photo/:productId', photo);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
