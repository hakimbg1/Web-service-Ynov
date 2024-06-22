const mongoose = require('mongoose');
<<<<<<< HEAD
const bcrypt = require('bcrypt');
const faker = require('faker');
const User = require('./models/userModel');
=======
const faker = require('faker');
const bcrypt = require('bcrypt');
const User = require('./models/userModel'); // Ensure correct path
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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
<<<<<<< HEAD
      console.log(`Assigning Picture URL for movie ${i}: ${pictureUrl}`);
=======
      console.log(`Assigning Picture URL for movie ${i}: ${pictureUrl}`); // Log the picture URL
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
      const movie = new Movie({
        uid: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        description: faker.lorem.sentences(),
        rate: faker.datatype.number({ min: 1, max: 5 }),
        duration: faker.datatype.number({ min: 60, max: 240 }),
        hasReservationsAvailable: faker.datatype.boolean(),
<<<<<<< HEAD
        pictureUrl: pictureUrl
=======
        pictureUrl: pictureUrl // Assign picture URL
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
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
<<<<<<< HEAD
    const adminPassword = await bcrypt.hash('toor', 10);

    const users = [
      new User({ username: 'root', password: adminPassword, role: 'admin' }),

    ];

    await User.insertMany(users);
    console.log('Inserted admin username : root, password : toor)');
=======
    const hashedPassword = await bcrypt.hash('toor', 10);
    const users = [
      new User({ username: 'root', password: hashedPassword, role: 'admin' })
    ];

    for (let i = 0; i < 50; i++) {
      users.push(new User({
        username: faker.internet.userName(),
        password: await bcrypt.hash(faker.internet.password(), 10),
        role: 'user'
      }));
    }
    await User.insertMany(users);
    console.log('Inserted 50 users');

    // Seed reservations
    const reservations = [];
    for (let i = 0; i < 100; i++) {
      reservations.push(new Reservation({
        uid: faker.datatype.uuid(),
        movieUid: faker.helpers.randomize(movies).uid,
        sceance: faker.date.future(),
        nbSeats: faker.datatype.number({ min: 1, max: 10 }),
        room: faker.lorem.word(),
        rank: faker.datatype.number({ min: 1, max: 10 }),
        status: faker.helpers.randomize(['open', 'expired', 'confirmed']),
        expiresAt: faker.date.future()
      }));
    }
    await Reservation.insertMany(reservations);
    console.log('Inserted 100 reservations');
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f

    process.exit(0);
  })
  .catch(error => {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
<<<<<<< HEAD
  });
=======
  });
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
