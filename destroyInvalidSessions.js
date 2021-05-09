const Product = require('./models/product');

Product.collection.getIndexes({full: true}).then(indexes => {
    console.log("indexes:", indexes);
}).catch(console.error);