// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // MongoDB Connection URI from .env
// const uri = process.env.MONGO_URI;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose
//   .connect(uri, { retryWrites: true })
//   .then(() => {
//     console.log('Connected to MongoDB Atlas');
//     seedAdminUser();
//   })
//   .catch((error) => console.error('Error connecting to MongoDB:', error));


// const sendEmail = require('./utils/mailer');
// const Otp = require('./models/Otp');

// // User Schema with role
// const userSchema = new mongoose.Schema({
//   firstName: { type: String },
//   lastName: { type: String },
//   username: { type: String, required: true, unique: true },
//   email: { type: String, unique: true, required: true },
//   phone: { type: String },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Default role is user
// });

// const User = mongoose.model('User', userSchema);

// // Seed a default admin user
// const seedAdminUser = async () => {
//   try {
//     const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
//     if (!existingAdmin) {
//       const hashedPassword = await bcrypt.hash('1234', 10);
//       const adminUser = new User({
//         username: 'admin',
//         email: 'admin@gmail.com',
//         password: hashedPassword,
//         role: 'admin',
//       });
//       await adminUser.save();
//       console.log('Default admin user created.');
//     } else {
//       console.log('Admin user already exists.');
//     }
//   } catch (error) {
//     console.error('Error seeding admin user:', error);
//   }
// };

// // Routes
// // Signup Route
// app.post('/signup', async (req, res) => {
//   const { firstName, lastName, username, email, phone, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: 'Email or username already in use' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       firstName,
//       lastName,
//       username,
//       email,
//       phone,
//       password: hashedPassword,
//     });
//     await newUser.save();

//     res.status(201).json({ success: true, message: 'User registered successfully!' });
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({ success: false, message: 'Error registering user' });
//   }
// });

// // Login Route
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ success: false, message: 'Invalid credentials' });
//     }

//    res.status(200).json({
//   success: true,
//   message: 'Login successful',
//   user: {
//     _id: user._id, // <-- add this line
//     firstName: user.firstName,
//     lastName: user.lastName,
//     username: user.username,
//     email: user.email,
//     phone: user.phone,
//     role: user.role,
//   },
// });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ success: false, message: 'Error logging in' });
//   }
// });

// // Fetch all users excluding passwords
// app.get('/users', async (req, res) => {
//   try {
//     const users = await User.find({}, '-password');
//     res.status(200).json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ success: false, message: 'Error fetching users' });
//   }
// });

// // Update user role or suspend account
// app.put('/users/:id', async (req, res) => {
//   const { id } = req.params;
//   const { role, suspended } = req.body;

//   try {
//     const user = await User.findByIdAndUpdate(
//       id,
//       { role, suspended },
//       { new: true }
//     );
//     res.status(200).json({ success: true, message: 'User updated successfully', user });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ success: false, message: 'Error updating user' });
//   }
// });

// // Delete user
// app.delete('/users/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     await User.findByIdAndDelete(id);
//     res.status(200).json({ success: true, message: 'User deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ success: false, message: 'Error deleting user' });
//   }
// });

// // Update user details
// app.put('/users/edit/:id', async (req, res) => {
//   const { id } = req.params;
//   const { firstName, lastName, email, phone } = req.body;

//   try {
//     const user = await User.findByIdAndUpdate(
//       id,
//       { firstName, lastName, email, phone },
//       { new: true }
//     );
//     res.status(200).json({ success: true, message: 'User updated successfully', user });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ success: false, message: 'Error updating user' });
//   }
// });

// // Admin: Get User Count
// app.get('/api/admin/users/count', async (req, res) => {
//   try {
//     const userCount = await User.countDocuments({});
//     res.json({ count: userCount });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error fetching user count' });
//   }
// });

// app.get('/api/admin/dashboard/counts', async (req, res) => {
//   try {
//     const userCount = await User.countDocuments({});
//     const movieCount = await Movie.countDocuments({});
//     res.json({ userCount, movieCount });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error fetching counts' });
//   }
// });

// // Get current user's profile (by ID)
// app.get('/api/user/profile/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id, '-password');
//     if (!user) return res.status(404).json({ success: false, message: 'User not found' });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error fetching user profile' });
//   }
// });

// // ...existing code...

// app.post('/api/user/change-password', async (req, res) => {
//   // Get userId from frontend (should be sent in body)
//   const { oldPassword, newPassword, userId, email } = req.body;
//   try {
//     let user = null;

//     // Prefer userId if provided, fallback to email
//     if (userId) {
//       user = await User.findById(userId);
//     } else if (email) {
//       user = await User.findOne({ email });
//     }

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: 'Old password is incorrect' });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();
//     res.json({ success: true, message: 'Password changed successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error changing password' });
//   }
// });

// // ...existing code...

// // Update current user's profile (by ID)
// app.put('/api/user/profile/:id', async (req, res) => {
//   const { firstName, lastName, email, phone } = req.body;
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { firstName, lastName, email, phone },
//       { new: true, select: '-password' }
//     );
//     if (!user) return res.status(404).json({ success: false, message: 'User not found' });
//     res.json({ success: true, message: 'Profile updated', user });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error updating profile' });
//   }
// });

// // User Reviews Model (if not already present)
// const reviewSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
//   text: String,
//   rating: Number,
//   createdAt: { type: Date, default: Date.now }
// });
// const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

// // Get all reviews by user (with movie info)
// // server.js
// app.get('/api/reviews/user/:userId', async (req, res) => {
//   try {
//     const reviews = await Review.find({ userId: req.params.userId })
//       .populate('movieId', 'title posterUrl')
//       .sort({ createdAt: -1 });
//     res.json(reviews);
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error fetching user reviews' });
//   }
// });

// // Request OTP
// app.post('/api/auth/forgot-password', async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(404).json({ success: false, message: 'User not found' });

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

//   await Otp.deleteMany({ email }); // Remove old OTPs
//   await Otp.create({ email, otp, expiresAt });

//   await sendEmail(email, 'Your OTP for Password Reset', `Your OTP is: ${otp}`);

//   res.json({ success: true, message: 'OTP sent to your email' });
// });

// // Verify OTP
// app.post('/api/auth/verify-otp', async (req, res) => {
//   const { email, otp } = req.body;
//   const record = await Otp.findOne({ email, otp });
//   if (!record || record.expiresAt < new Date()) {
//     return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
//   }
//   res.json({ success: true, message: 'OTP verified' });
// });

// // Reset Password
// app.post('/api/auth/reset-password', async (req, res) => {
//   const { email, otp, newPassword } = req.body;
//   const record = await Otp.findOne({ email, otp });
//   if (!record || record.expiresAt < new Date()) {
//     return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
//   }
//   const user = await User.findOne({ email });
//   if (!user) return res.status(404).json({ success: false, message: 'User not found' });

//   user.password = await bcrypt.hash(newPassword, 10);
//   await user.save();
//   await Otp.deleteMany({ email });

//   res.json({ success: true, message: 'Password reset successful' });
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// const movieSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   director: String,
//   actor: String,
//   actress: String,
//   releaseDate: Date,
//   releaseYear: Number,
//   rating: { type: Number, default: 0 }, // average rating
//   duration: Number,
//   posterUrl: String,
//   genres: [String],
//   description: String,
//   active: { type: Boolean, default: true },
//   createdAt: { type: Date, default: Date.now },
//   comments: [
//     {
//       username: String,
//       text: String,
//       createdAt: { type: Date, default: Date.now }
//     }
//   ],
//   ratings: [
//     {
//       userId: String, // or mongoose.Schema.Types.ObjectId if you want
//       value: Number
//     }
//   ]
// });

// const Movie = mongoose.model('Movie', movieSchema);

// // Get all movies
// app.get('/api/movies', async (req, res) => {
//   try {
//     // Only select fields you want to send (including posterUrl)
//     const movies = await Movie.find({}, {
//       title: 1,
//       director: 1,
//       actor: 1,
//       actress: 1,
//       releaseDate: 1,
//       releaseYear: 1,
//       rating: 1,
//       duration: 1,
//       posterUrl: 1, // Ensure posterUrl is included
//       genres: 1,
//       description: 1,
//       active: 1,
//       createdAt: 1
//     });
//     res.json(movies);
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error fetching movies' });
//   }
// });

// // Add a new movie
// app.post('/api/movies', async (req, res) => {
//   try {
//     const movie = new Movie(req.body);
//     await movie.save();
//     res.status(201).json(movie);
//   } catch (error) {
//     res.status(400).json({ success: false, message: 'Error adding movie', error });
//   }
// });

// // Delete a movie
// app.delete('/api/movies/:id', async (req, res) => {
//   try {
//     await Movie.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: 'Movie deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error deleting movie' });
//   }
// });

// // Edit (update) a movie
// app.put('/api/movies/:id', async (req, res) => {
//   try {
//     const updatedMovie = await Movie.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updatedMovie);
//   } catch (error) {
//     res.status(400).json({ success: false, message: 'Error updating movie', error });
//   }
// });

// // Get a single movie by ID
// app.get('/api/movies/:id', async (req, res) => {
//   try {
//     const movie = await Movie.findById(req.params.id);
//     if (!movie) {
//       return res.status(404).json({ success: false, message: 'Movie not found' });
//     }
//     res.json(movie);
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error fetching movie' });
//   }
// });

// // Rate a movie (user can rate once, update if already rated)
// app.post('/api/movies/:id/rate', async (req, res) => {
//   const { userId, value } = req.body; // userId should come from auth in real apps
//   if (!userId || !value) return res.status(400).json({ success: false, message: 'Missing userId or value' });

//   try {
//     const movie = await Movie.findById(req.params.id);
//     if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });

//     // Remove previous rating by this user if exists
//     movie.ratings = movie.ratings.filter(r => r.userId !== userId);
//     // Add new rating
//     movie.ratings.push({ userId, value: Number(value) });

//     // Calculate average
//     const avg = movie.ratings.reduce((sum, r) => sum + r.value, 0) / movie.ratings.length;
//     movie.rating = Math.round(avg * 10) / 10; // 1 decimal

//     await movie.save();
//     res.json({ success: true, rating: movie.rating });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error rating movie' });
//   }
// });

// // Add a comment to a movie
// app.post('/api/movies/:id/comments', async (req, res) => {
//   const { username, text } = req.body;
//   if (!username || !text) return res.status(400).json({ success: false, message: 'Missing username or text' });

//   try {
//     const movie = await Movie.findById(req.params.id);
//     if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });

//     movie.comments.push({ username, text });
//     await movie.save();
//     res.json({ success: true, comments: movie.comments });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error adding comment' });
//   }
// });

// // PUT /api/movies/:id/comments/:idx
// app.put('/api/movies/:id/comments/:idx', async (req, res) => {
//   const { username, text } = req.body;
//   try {
//     const movie = await Movie.findById(req.params.id);
//     if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
//     if (!movie.comments[req.params.idx]) return res.status(404).json({ success: false, message: 'Comment not found' });
//     // Only allow editing by the original user
//     if (movie.comments[req.params.idx].username !== username) {
//       return res.status(403).json({ success: false, message: 'Not allowed' });
//     }
//     movie.comments[req.params.idx].text = text;
//     await movie.save();
//     res.json({ success: true, comments: movie.comments });
//   } catch {
//     res.status(500).json({ success: false, message: 'Error updating comment' });
//   }
// });

// // --- UserFavorites Schema ---
// const userFavoritesSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
//   favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
//   watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
// });
// const UserFavorites = mongoose.models.UserFavorites || mongoose.model('UserFavorites', userFavoritesSchema);

// // --- Add/Remove Favorite Movie ---
// app.post('/api/user/favorites', async (req, res) => {
//   const { userId, movieId } = req.body;
//   if (!userId || !movieId) return res.status(400).json({ success: false, message: 'Missing userId or movieId' });

//   try {
//     let userFav = await UserFavorites.findOne({ userId });
//     if (!userFav) {
//       userFav = new UserFavorites({ userId, favorites: [movieId], watchlist: [] });
//     } else {
//       const idx = userFav.favorites.findIndex(id => id.toString() === movieId);
//       if (idx === -1) {
//         userFav.favorites.push(movieId); // Add to favorites
//       } else {
//         userFav.favorites.splice(idx, 1); // Remove from favorites
//       }
//     }
//     await userFav.save();
//     await userFav.populate('favorites');
//     res.json({ success: true, favorites: userFav.favorites });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error updating favorites' });
//   }
// });

// // --- Get User Favorites ---
// app.get('/api/user/favorites', async (req, res) => {
//   const userId = req.query.userId;
//   if (!userId) return res.json([]); // Always return array
//   try {
//     const userFav = await UserFavorites.findOne({ userId }).populate('favorites');
//     res.json(Array.isArray(userFav?.favorites) ? userFav.favorites : []);
//   } catch {
//     res.json([]);
//   }
// });

// // --- Add/Remove Watchlist Movie ---
// app.post('/api/user/watchlist', async (req, res) => {
//   const { userId, movieId } = req.body;
//   if (!userId || !movieId) return res.status(400).json({ success: false, message: 'Missing userId or movieId' });

//   try {
//     let userFav = await UserFavorites.findOne({ userId });
//     if (!userFav) {
//       userFav = new UserFavorites({ userId, favorites: [], watchlist: [movieId] });
//     } else {
//       const idx = userFav.watchlist.findIndex(id => id.toString() === movieId);
//       if (idx === -1) {
//         userFav.watchlist.push(movieId); // Add to watchlist
//       } else {
//         userFav.watchlist.splice(idx, 1); // Remove from watchlist
//       }
//     }
//     await userFav.save();
//     await userFav.populate('watchlist');
//     res.json({ success: true, watchlist: userFav.watchlist });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error updating watchlist' });
//   }
// });

// // --- Get User Watchlist ---
// app.get('/api/user/watchlist', async (req, res) => {
//   const userId = req.query.userId;
//   if (!userId) return res.json([]); // Always return array
//   try {
//     const userFav = await UserFavorites.findOne({ userId }).populate('watchlist');
//     res.json(Array.isArray(userFav?.watchlist) ? userFav.watchlist : []);
//   } catch {
//     res.json([]);
//   }
// });



// // ...existing code...

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(uri, { retryWrites: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    seedAdminUser();
  })
  .catch((error) => console.error('Error connecting to MongoDB:', error));

const sendEmail = require('./utils/mailer');
const Otp = require('./models/Otp');

// --- User Schema ---
const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

const User = mongoose.model('User', userSchema);

// --- Seed Admin User ---
const seedAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('1234', 10);
      const adminUser = new User({
        username: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
      });
      await adminUser.save();
      console.log('Default admin user created.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

// --- Movie Schema with category and episodes ---
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: String,
  actor: String,
  actress: String,
  releaseDate: Date,
  releaseYear: Number,
  rating: { type: Number, default: 0 },
  duration: Number,
  posterUrl: String,
  genres: [String],
  description: String,
  active: { type: Boolean, default: true },
  category: { type: String, enum: ['Hollywood', 'Bollywood', 'Tollywood', 'Kollywood', 'Anime', 'Webseries', 'Sandlewood'], required: true },
  episodes: { type: Number }, // Only for Anime/Webseries
  createdAt: { type: Date, default: Date.now },
  comments: [
    {
      username: String,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  ratings: [
    {
      userId: String,
      value: Number
    }
  ]
});

const Movie = mongoose.model('Movie', movieSchema);

// --- UserFavorites Schema ---
const userFavoritesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});
const UserFavorites = mongoose.models.UserFavorites || mongoose.model('UserFavorites', userFavoritesSchema);

// --- Review Schema ---
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  text: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

// --- Auth & User Routes ---
app.post('/signup', async (req, res) => {
  const { firstName, lastName, username, email, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email or username already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      phone,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error logging in' });
  }
});

// --- User Management ---
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { role, suspended } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { role, suspended },
      { new: true }
    );
    res.status(200).json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Error updating user' });
  }
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
});

app.put('/users/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, phone },
      { new: true }
    );
    res.status(200).json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Error updating user' });
  }
});

// --- Admin Dashboard Counts ---
app.get('/api/admin/users/count', async (req, res) => {
  try {
    const userCount = await User.countDocuments({});
    res.json({ count: userCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user count' });
  }
});

app.get('/api/admin/dashboard/counts', async (req, res) => {
  try {
    const userCount = await User.countDocuments({});
    const movieCount = await Movie.countDocuments({});
    res.json({ userCount, movieCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching counts' });
  }
});

// --- User Profile ---
app.get('/api/user/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user profile' });
  }
});

app.put('/api/user/profile/:id', async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, phone },
      { new: true, select: '-password' }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
});

app.post('/api/user/change-password', async (req, res) => {
  const { oldPassword, newPassword, userId, email } = req.body;
  try {
    let user = null;
    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email });
    }
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Old password is incorrect' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error changing password' });
  }
});

// --- Movies CRUD ---
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find({}, {
      title: 1,
      director: 1,
      actor: 1,
      actress: 1,
      releaseDate: 1,
      releaseYear: 1,
      rating: 1,
      duration: 1,
      posterUrl: 1,
      genres: 1,
      description: 1,
      active: 1,
      createdAt: 1,
      category: 1,
      episodes: 1
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching movies' });
  }
});

app.post('/api/movies', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error adding movie', error });
  }
});

app.delete('/api/movies/:id', async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting movie' });
  }
});

app.put('/api/movies/:id', async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating movie', error });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching movie' });
  }
});

// --- Movie Ratings ---
app.post('/api/movies/:id/rate', async (req, res) => {
  const { userId, value } = req.body;
  if (!userId || !value) return res.status(400).json({ success: false, message: 'Missing userId or value' });
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    movie.ratings = movie.ratings.filter(r => r.userId !== userId);
    movie.ratings.push({ userId, value: Number(value) });
    const avg = movie.ratings.reduce((sum, r) => sum + r.value, 0) / movie.ratings.length;
    movie.rating = Math.round(avg * 10) / 10;
    await movie.save();
    res.json({ success: true, rating: movie.rating });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error rating movie' });
  }
});

// --- Movie Comments ---
app.post('/api/movies/:id/comments', async (req, res) => {
  const { username, text } = req.body;
  if (!username || !text) return res.status(400).json({ success: false, message: 'Missing username or text' });
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    movie.comments.push({ username, text });
    await movie.save();
    res.json({ success: true, comments: movie.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding comment' });
  }
});

app.put('/api/movies/:id/comments/:idx', async (req, res) => {
  const { username, text } = req.body;
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    if (!movie.comments[req.params.idx]) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (movie.comments[req.params.idx].username !== username) {
      return res.status(403).json({ success: false, message: 'Not allowed' });
    }
    movie.comments[req.params.idx].text = text;
    await movie.save();
    res.json({ success: true, comments: movie.comments });
  } catch {
    res.status(500).json({ success: false, message: 'Error updating comment' });
  }
});

// --- UserFavorites ---
app.post('/api/user/favorites', async (req, res) => {
  const { userId, movieId } = req.body;
  if (!userId || !movieId) return res.status(400).json({ success: false, message: 'Missing userId or movieId' });
  try {
    let userFav = await UserFavorites.findOne({ userId });
    if (!userFav) {
      userFav = new UserFavorites({ userId, favorites: [movieId], watchlist: [] });
    } else {
      const idx = userFav.favorites.findIndex(id => id.toString() === movieId);
      if (idx === -1) {
        userFav.favorites.push(movieId);
      } else {
        userFav.favorites.splice(idx, 1);
      }
    }
    await userFav.save();
    await userFav.populate('favorites');
    res.json({ success: true, favorites: userFav.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating favorites' });
  }
});

app.get('/api/user/favorites', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.json([]);
  try {
    const userFav = await UserFavorites.findOne({ userId }).populate('favorites');
    res.json(Array.isArray(userFav?.favorites) ? userFav.favorites : []);
  } catch {
    res.json([]);
  }
});

app.post('/api/user/watchlist', async (req, res) => {
  const { userId, movieId } = req.body;
  if (!userId || !movieId) return res.status(400).json({ success: false, message: 'Missing userId or movieId' });
  try {
    let userFav = await UserFavorites.findOne({ userId });
    if (!userFav) {
      userFav = new UserFavorites({ userId, favorites: [], watchlist: [movieId] });
    } else {
      const idx = userFav.watchlist.findIndex(id => id.toString() === movieId);
      if (idx === -1) {
        userFav.watchlist.push(movieId);
      } else {
        userFav.watchlist.splice(idx, 1);
      }
    }
    await userFav.save();
    await userFav.populate('watchlist');
    res.json({ success: true, watchlist: userFav.watchlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating watchlist' });
  }
});

app.get('/api/user/watchlist', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.json([]);
  try {
    const userFav = await UserFavorites.findOne({ userId }).populate('watchlist');
    res.json(Array.isArray(userFav?.watchlist) ? userFav.watchlist : []);
  } catch {
    res.json([]);
  }
});

// --- Reviews ---
app.get('/api/reviews/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId })
      .populate('movieId', 'title posterUrl')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user reviews' });
  }
});

// --- OTP & Password Reset ---
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await Otp.deleteMany({ email });
  await Otp.create({ email, otp, expiresAt });

  await sendEmail(email, 'Your OTP for Password Reset', `Your OTP is: ${otp}`);

  res.json({ success: true, message: 'OTP sent to your email' });
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const record = await Otp.findOne({ email, otp });
  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }
  res.json({ success: true, message: 'OTP verified' });
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const record = await Otp.findOne({ email, otp });
  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  await Otp.deleteMany({ email });

  res.json({ success: true, message: 'Password reset successful' });
});

// ...existing code...

// Get all reviews (for admin)
app.get('/api/admin/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('userId', 'username email')
      .populate('movieId', 'title');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching all reviews' });
  }
});

// ...existing code...

// --- Admin Analytics: Get all favorites with movie info ---
app.get('/api/admin/all-favorites', async (req, res) => {
  try {
    // Get all UserFavorites, populate favorites with movie info
    const allFavs = await UserFavorites.find({})
      .populate({
        path: 'favorites',
        select: 'title category genres'
      });
    // Flatten to array of { userId, movie }
    const result = [];
    allFavs.forEach(userFav => {
      userFav.favorites.forEach(movie => {
        result.push({
          userId: userFav.userId,
          movie
        });
      });
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching all favorites' });
  }
});

// ...existing code...

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});