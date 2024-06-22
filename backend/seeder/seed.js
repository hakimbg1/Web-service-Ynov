const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const faker = require('faker');
const User = require('./models/userModel');
const Movie = require('./models/movieModel');
const Reservation = require('./models/reservationModel');

const mongoURI = 'mongodb://mongo:27017/movie-app';

// List of random movie picture URLs
const movieImages = [
  'https://via.placeholder.com/300x450?text=Movie+1',
  'https://via.placeholder.com/300x450?text=Movie+2',
  'https://via.placeholder.com/300x450?text=Movie+3',
  'https://via.placeholder.com/300x450?text=Movie+4',
  'https://via.placeholder.com/300x450?text=Movie+5',
  'https://via.placeholder.com/300x450?text=Movie+6',
  'https://via.placeholder.com/300x450?text=Movie+7',
  'https://via.placeholder.com/300x450?text=Movie+8',
  'https://via.placeholder.com/300x450?text=Movie+9',
  'https://via.placeholder.com/300x450?text=Movie+10'
];

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    await User.deleteMany({});
    await Reservation.deleteMany({});

    // Seed movies
    const movies = [];
    for (let i = 0; i < 300; i++) {
      const pictureUrl = movieImages[Math.floor(Math.random() * movieImages.length)];
      console.log(`Assigning Picture URL for movie ${i}: ${pictureUrl}`);
      const movie = new Movie({
        uid: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        description: faker.lorem.sentences(),
        rate: faker.datatype.number({ min: 1, max: 5 }),
        duration: faker.datatype.number({ min: 60, max: 240 }),
        hasReservationsAvailable: faker.datatype.boolean(),
        pictureUrl: pictureUrl
      });
      movies.push(movie);
    }
    await Movie.insertMany(movies);

    // Verify inserted movies
    const insertedMovies = await Movie.find({});
    console.log('Inserted Movies:', insertedMovies.map(movie => ({
      uid: movie.uid,
      name: movie.name,
      pictureUrl: movie.pictureUrl
    })));

    console.log('Inserted 300 movies');

    // Seed users
    const adminPassword = await bcrypt.hash('toor', 10);

    const users = [
      new User({ username: 'root', password: adminPassword, role: 'admin' }),

    ];

    await User.insertMany(users);
    console.log('Inserted admin username : root, password : toor)');

    process.exit(0);
  })
  .catch(error => {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  });
