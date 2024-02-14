require('dotenv').config()

const { connectMongo } = require('./mongo')

connectMongo().then(db => global.db = db).then(() => getProducts(4, 5))



async function getProducts(page, pageSize) {
  const skip = (page - 1) * pageSize;

  const pipeline = [
    {
      $facet: {
        totalProducts: [
          { $count: 'amount' },

        ],
        products: [
          { $skip: skip },
          { $limit: pageSize }
        ]
      }
    }
  ]

  const [result] = await db.collection('products').aggregate(pipeline).toArray()
  const {products, totalProducts: [{amount}]} = result
  const data = { page, totalProducts: amount, totalPages: Math.ceil(amount/pageSize), results: products }
  console.log(data)
  return data
}