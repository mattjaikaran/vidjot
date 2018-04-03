if(process.env.NODE_ENV === 'production') {
  module.exports = { mongoURI: 'mongodb://matt:matt@ds233739.mlab.com:33739/vidjot-prod' }
} else {
  module.exports = { mongoURI: 'mongodb://localhost/vidjot-dev' }
}
