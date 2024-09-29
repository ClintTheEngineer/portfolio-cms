const express = require('express');
const app = express();

const cors = require('cors');
const pool = require('./db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');

const multer = require('multer');

const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const clientDomain = `https://portfolio-cms-7n8a.onrender.com`;

const CanderDB = require('./db2');

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));



app.get('/users', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM cms_users');
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
    const projects = await pool.query('SELECT * FROM cms_portfolio_editor WHERE username = $1 ORDER BY entry_id ASC', [username]);
    res.json(projects.rows);
    console.log(projects.rows)
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


app.get('/:username/projects/caption', async (req, res) => {
  const username = req.params.username;

  try {
    const result = await pool.query('SELECT caption FROM cms_portfolio_editor WHERE username = $1', [username]);

    const captions = result.rows.map(entry => ({ caption: entry.caption }));

    res.json(captions);
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).send('Server error');
  }
});

app.get('/:username/projects/livelinks', async (req, res) => {
  const username = req.params.username;

  try {
    const result = await pool.query('SELECT live_site_link FROM cms_portfolio_editor WHERE username = $1', [username]);

    const livesitelinks = result.rows.map(entry => ({ live_site_link: entry.live_site_link }));

    res.json(livesitelinks);
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).send('Server error');
  }
});

app.get('/:username/projects/github', async (req, res) => {
  const username = req.params.username;

  try {
    const result = await pool.query('SELECT github_link FROM cms_portfolio_editor WHERE username = $1', [username]);

    const github = result.rows.map(entry => ({ caption: entry.github_link }));

    res.json(github);
  } catch (error) {
    console.error('Database query error:', error.message);
    res.status(500).send('Server error');
  }
});


/*
app.get('/:username/projects/caption', async (req, res) => {
  try {
    const username = req.params.username;

    // Construct request to CanderDB
    const requestBody = {
      method: 'GET',
      path: `/instances/mmaaced@gmail.com/cms/portfolio_cms.db`,
      headers: {
        'Authorization': process.env.ACCESS_TOKEN
      }
    };

    // Make request to CanderDB
    CanderDB.connect(requestBody.method, requestBody, (error, data) => {
      if (error) {
        console.error(error);
        return res.status(500).send(error);
      }

      try {
        // Parse the response from CanderDB
        const jsonData = JSON.parse(data);

        // Extract only the captions
        const captions = jsonData.map(entry => ({ caption: entry.caption }));

        // Send the modified response
        res.json(captions);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.status(500).send('Error parsing JSON from the remote server');
      }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});




app.get('/:username/projects/caption/:id', async (req, res) => {
  try {
    const username = req.params.username;
    const id = parseInt(req.params.id); // Convert id to integer

    // Construct request to CanderDB
    const requestBody = {
      method: 'GET',
      path: `/instances/mmaaced@gmail.com/cms/portfolio_cms.db`,
      headers: {
        'Authorization': process.env.ACCESS_TOKEN
      }
    };

    // Make request to CanderDB
    CanderDB.connect(requestBody.method, requestBody, (error, data) => {
      if (error) {
        console.error(error);
        return res.status(500).send(error);
      }

      try {
        // Parse the response from CanderDB
        const jsonData = JSON.parse(data);

        // Check if id is within range
        if (id < 1 || id > jsonData.length) {
          return res.status(404).send('Project not found');
        }

        // Get the caption based on id (index + 1)
        const project = jsonData[id - 1];
        const caption = project.caption;

        // Send the caption
        res.json(caption);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.status(500).send(`Error parsing JSON from the remote server`);
      }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

*/



// Route to get a specific project's caption by ID for a specific username
app.get('/:username/projects/caption/:id', async (req, res) => {
  try {
    const username = req.params.username;
    const id = req.params.id;
    const project = await pool.query('SELECT caption FROM cms_portfolio_editor WHERE username = $1 AND entry_id = $2', [username, id]);
    if (project.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project.rows[0].caption);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

app.get('/:username/projects/livelinks/:id', async (req, res) => {
  try {
    const username = req.params.username;
    const id = req.params.id;
    const project = await pool.query('SELECT live_site_link FROM cms_portfolio_editor WHERE username = $1 AND entry_id = $2', [username, id]);
    if (project.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project.rows[0].live_site_link);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

app.get('/:username/projects/github/:id', async (req, res) => {
  try {
    const username = req.params.username;
    const id = req.params.id;
    const project = await pool.query('SELECT github_link FROM cms_portfolio_editor WHERE username = $1 AND entry_id = $2', [username, id]);
    if (project.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project.rows[0].github_link);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});





app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await pool.query(
        'SELECT * FROM cms_users WHERE username = $1',
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
      'SELECT * FROM cms_users WHERE username = $1',
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
      'SELECT * FROM cms_users WHERE email = $1',
      [email]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(405).json({ error: 'Email already in use' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
  
      await pool.query(
        'INSERT INTO cms_users (username, email, hashed_password) VALUES ($1, $2, $3)',
        [username, email, hashedPassword]
      );
      res.setHeader('Content-Type', 'application/json')
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  });


  app.post('/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
  
     const userWithEmailExists = await checkEmailExists(email);
  
      if (!userWithEmailExists) {
        return res.status(400).json({ error: 'Email not found' });
      }
  
      // Generate a unique token
      const token = crypto.randomBytes(16).toString('hex');
      // Set the expiration time for the token
      const expirationTime = new Date(Date.now() + 3600000).toISOString(); // 1 hour in milliseconds
  
      // Store the token and its expiration timestamp in the database
      await pool.query(
        'INSERT INTO cms_reset_tokens (token, email, expiration_time) VALUES ($1::uuid, $2, $3)',
        [token, email, expirationTime]
      );
  
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL, 
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      const resetUrl = `${clientDomain}/validate-password?token=${token}`;
      const mailOptions = {
        from: 'Cander Portfolio Manager <no-reply@clinttheengineer.com>',
        to: email, 
        subject: 'Password Reset',
        html: `
          <p>You have requested to reset your password.</p>
          <p>Click the following link to reset your password:</p>
          <a href=${clientDomain}>Reset Password</a>
        `,
      };
  
     
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).send('Failed to send password reset email');
        } else {
          console.log('Password reset email sent:', info.response);
          res.status(200).json({ message: 'Password reset email sent' });
        }
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  });


  async function checkEmailExists(email) {
    try {
      const query = 'SELECT COUNT(*) FROM Users WHERE email = $1';
      const result = await pool.query(query, [email]);
      return result.rows[0].count > 0;
    } catch (error) {
      console.error('Error checking if email exists:', error);
      throw error; 
    }
  }



app.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const query = 'SELECT email FROM cms_reset_tokens WHERE token = $1 AND expiration_time > NOW()';
    const result = await pool.query(query, [token]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const email = result.rows[0].email;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = 'UPDATE cms_users SET hashed_password = $1 WHERE email = $2';
    await pool.query(updateQuery, [hashedPassword, email]);

    // Delete the used token from the reset_tokens table
    await pool.query('DELETE FROM cms_reset_tokens WHERE token = $1', [token]);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


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


// Handle form submission and send email
app.post('/send-email', (req, res) => {
  const { email, message } = req.body;

  // Create a Nodemailer transporter using your email service provider
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.EMAIL, 
          pass: process.env.EMAIL_PASSWORD 
      }
  });

  // Email content
  const mailOptions = {
      from: email,
      to: process.env.EMAIL, // Recipient's email address (could be your email or any other email)
      subject: 'Portfolio Communication',
      text: `Email: ${email}\nMessage: ${message}`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error(error);
          res.send('Error: Something went wrong. Please try again later.');
      } else {
          console.log('Email sent: ' + info.response);
          res.send('Email sent successfully!');
      }
  });
});



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})