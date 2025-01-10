const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const db = require('./db'); // Assuming you have a db connection file
const app = express();
const PORT = 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Setup body parser for form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup session middleware
app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: true,
}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Setup Multer for image upload (for user profile or books)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Save images in the "uploads" folder inside public
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique file names
  },
});
const upload = multer({ storage: storage });

// Root route
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  res.render('register', { 
    name: '', // Empty initial values
    email: '', 
    username: '', 
    error: '' 
  }); // Render the EJS view for registration
});

app.post('/register', (req, res) => {
  const { name, email, username, password, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.render('register', { error: 'Passwords do not match', name, email, username });
  }

  // Check if email or username exists
  const checkQuery = 'SELECT email, username FROM users WHERE email = ? OR username = ?';
  db.query(checkQuery, [email, username], (err, results) => {
    if (err) {
      console.error(err);
      return res.render('register', { error: 'An error occurred while checking existing users', name, email, username });
    }

    if (results.length > 0) {
      const existingEmail = results.some((user) => user.email === email);
      const existingUsername = results.some((user) => user.username === username);

      if (existingEmail && existingUsername) {
        return res.render('register', { error: 'Both email and username are already in use', name, email, username });
      } else if (existingEmail) {
        return res.render('register', { error: 'Email is already in use', name, email, username });
      } else if (existingUsername) {
        return res.render('register', { error: 'Username is already in use', name, email, username });
      }
    }

    // Hash password before storing it
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.render('register', { error: 'Error hashing password', name, email, username });
      }

      // Insert new user
      const insertQuery = 'INSERT INTO users (name, username, password, email) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [name, username, hashedPassword, email], (err, result) => {
        if (err) {
          console.error(err);
          return res.render('register', { error: 'Error inserting data into database', name, email, username });
        }

        // Store user ID in session
        req.session.userId = result.insertId;
        req.session.username = username;
        res.redirect('/dashboard');
      });
    });
  });
});




// Login routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { error: 'Please provide both email and password' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.render('login', { error: 'An error occurred. Please try again later.' });
    }

    if (results.length === 0) {
      return res.render('login', { error: 'Invalid login credentials' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Password comparison error:', err);
        return res.render('login', { error: 'An error occurred. Please try again later.' });
      }

      if (!isMatch) {
        return res.render('login', { error: 'Invalid login credentials' });
      }

      req.session.userId = user.id;
      req.session.name = user.name;
      req.session.role = user.role;

      if (user.role === 'admin') {
        return res.redirect('/admin');
      } else if (user.role === 'manager') {
        return res.redirect('/manager');
      } else {
        return res.redirect('/dashboard');
      }
    });
  });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/');
  }

  res.render('dashboard', { name: req.session.name, profileImage: req.session.profileImage });
});

// Admin route
app.get('/admin', (req, res) => {
  const query = 'SELECT * FROM products'; // Adjust to your database schema

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Internal server error');
    }

    res.render('dashboard-admin', { products: results });
  });
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/dashboard');
    }
    res.redirect('/');
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


// delete product 
app.get('/admin/products/delete/:ID', (req, res) => {
  const { ID } = req.params;

  const deleteQuery = 'DELETE FROM products WHERE id = ?';
  db.query(deleteQuery, [ID], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).send('Error deleting product');
    }

    res.redirect('/admin'); // Redirect to admin page after deletion
  });
});

// Route for Updating Product (Form)
app.get('/admin/products/update/:ID', (req, res) => {
  const { ID } = req.params;

  const getQuery = 'SELECT * FROM products WHERE id = ?';
  db.query(getQuery, [ID], (err, results) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).send('Error fetching product');
    }

    const product = results[0];
    res.render('update-product', { product }); // Render update form
  });
});
// Route for Updating Product (Handling Post Request)
app.post('/admin/products/update/:ID', upload.single('bookImage'), (req, res) => {
  const { ID } = req.params;
  const { bookName, description, status, price } = req.body;
  const bookImage = req.file ? req.file.filename : undefined;

  let updateQuery = 'UPDATE products SET bookName = ?, description = ?, status = ?, price = ?';
  let queryParams = [bookName, description, status, price];

  if (bookImage) {
    updateQuery += ', bookImage = ?';
    queryParams.push(bookImage);
  }

  updateQuery += ' WHERE ID = ?';
  queryParams.push(ID);

  db.query(updateQuery, queryParams, (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).send('Error updating product');
    }

    res.redirect('/admin'); // Redirect to admin page after updating
  });
});

// Route for rendering product creation form
app.get('/admin/products/create', (req, res) => {
  res.render('add-product'); // Render product creation form
});

// Route for handling product creation
app.post('/admin/products/create', upload.single('bookImage'), (req, res) => {
  const { bookName, description, status, price } = req.body;
  const bookImage = req.file ? `uploads/${req.file.filename}` : ''; // Save relative path to image

  const insertQuery = `
    INSERT INTO products (bookName, description, status, price, bookImage) 
    VALUES (?, ?, ?, ?, ?)`;

  db.query(insertQuery, [bookName, description, status, price, bookImage], (err) => {
    if (err) {
      console.error('Error inserting product:', err);
      return res.status(500).send('Error inserting product');
    }

    res.redirect('/admin'); // Redirect to the admin page after creation
  });
});

// Route to get products from the database
app.get('/dashboard/home', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching products');
    }
    // Pass the results to your view (HTML)
    res.render('admin', { products: results });
  });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
