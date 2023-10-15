const express = require('express');
const app = express();

const cors = require('cors');
const pool = require('./db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');


const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const username = req.body.username; 
    const userUploadsDir = `./uploads/${username}`; // Create a sub-directory based on the username
    fs.mkdirSync(userUploadsDir, { recursive: true }); // Create the sub-directory if it doesn't exist
    cb(null, userUploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//check  

const singleImageUpload = multer({ 
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const username = req.params.username;
      const techImagesDir = `./uploads/${username}/tech-images`; 
      // Create the 'tech-images' sub-directory if it doesn't exist
      fs.mkdirSync(techImagesDir, { recursive: true });
      cb(null, techImagesDir);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  })
});


//check




const upload = multer({ storage: storage });
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/users', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM Users');
        res.json(users.rows)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
})



app.get('/get-projects', async (req, res) => {
  try {
         const projects = await pool.query('SELECT * FROM Portfolio_Editor');
         res.json(projects.rows)
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error')
  }
})

app.get('/:username/projects', async (req, res) => {
  try {
    const username = req.params.username;
    const projects = await pool.query('SELECT * FROM Portfolio_Editor WHERE username = $1 ORDER BY id ASC', [username]);
    res.json(projects.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await pool.query(
        'SELECT * FROM Users WHERE username = $1',
        [username]
      );
      if (user.rows.length === 0) {
        return res.status(401).json('Invalid credentials');
      }
      const isPasswordValid = await bcrypt.compare(password, user.rows[0].hashed_password);
  
      if (!isPasswordValid) {
        return res.status(401).json('Invalid credentials');
      }
      
      const token = jwt.sign({ user: user.rows[0].user_id }, secretKey);      
      
      res.json({ token, username });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
    
  });


  app.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if(!password) {
        return res.status(400).json({ error: 'Password is required' })
      }  

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(406).json({
        error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
      });
    }
      
    const existingUser = await pool.query(
      'SELECT * FROM Users WHERE username = $1',
      [username]
    );
    
    if (existingUser.rows.length > 0) {
      res.setHeader('Content-Type', 'application/json')
      return res.status(403).json({ error: 'Username taken' });
    }

    if (existingUser.rows.length > 0) {
      return res.status(403).json({ error: 'Username taken' });
    }

    // Check if the email already exists in the database
    const existingEmail = await pool.query(
      'SELECT * FROM Users WHERE email = $1',
      [email]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(405).json({ error: 'Email already in use' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
  
      await pool.query(
        'INSERT INTO Users (username, email, hashed_password) VALUES ($1, $2, $3)',
        [username, email, hashedPassword]
      );
      res.setHeader('Content-Type', 'application/json')
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  });


app.post('/project-add', upload.array('image'), async (req, res) => {
  try {
    const { id, siteLink, githubLink, caption, username } = req.body;
    const images = req.files.map(file => file.path);
    await pool.query(
    'INSERT INTO Portfolio_Editor (id, live_site_link, github_link, caption, username) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id, username) DO UPDATE SET live_site_link = EXCLUDED.live_site_link, github_link = EXCLUDED.github_link, caption = EXCLUDED.caption',
    [id, siteLink, githubLink, caption, username]);
    res.status(201).json({ message: 'Project added successfully'})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//stream
app.post('/tech-images/:username', singleImageUpload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const username = req.params.username;
    const imageUrl = `/uploads/${username}/tech-images/${req.file.filename}`;
    res.status(201).json({ message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//stream



app.get('/uploads/:username', (req, res) => {
  const username = req.params.username;
  const uploadsDirectory = path.join(__dirname, 'uploads', username);

  // Read filenames from the uploads directory
  fs.readdir(uploadsDirectory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Construct URLs based on filenames and send as response
    const imageUrls = files.map(filename => `/uploads/${username}/${filename}`).sort();
    res.json(imageUrls);
  });
});



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})