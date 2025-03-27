// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const dotenv = require('dotenv');

// dotenv.config();




// const register = async (req, res) => {
//   const { username, email, password } = req.body;
//   // console.log("Received payload:", req.body); // Check incoming data

//   try {
//     // Check if user already exists
//     let user = await User.findOne({ email });
//     // console.log("User exists check:", user); // Check if user exists

//     if (user) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Create new user
//     user = new User({ username, email, password });
//     await user.save();
//     // console.log("User created successfully");

//     // Respond with success message
//     res.status(201).json({
//       message: "Registration Successful",
//     });
//   } catch (err) {
//     console.error("Error occurred:", err.message); // Log error details
//     res.status(500).json({ message: "Server error" });
//   }
// };


// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     // Compare passwords
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     // Generate JWT
//     const payload = { id: user.id };
//     const token = jwt.sign(payload, process.env.JWT_SECRET);
//     console.log(token)

//     // Respond with success message and token
//     res.status(200).json({
//       message: "Login Successful",
//       token: token,
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };




// // Get user details
// const userDetails = async (req, res) => {
//   try {
//     // Get user from authMiddleware (req.user contains the decoded JWT payload)
//     const userId = req.user.id;
    
//     // Find user in database, excluding the password field
//     const user = await User.findById(userId).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Prepare response data
//     const userData = {
//       id: user._id,
//       username: user.username,
//       email: user.email,
//       token: jwt.sign({ id: user._id }, process.env.JWT_SECRET)
//     };

//     res.status(200).json({
//       message: 'User details retrieved successfully',
//       user: userData
//     });
//   } catch (err) {
//     console.error('Error in userDetails:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



// module.exports = { register, login, userDetails };



const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

// / Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store files in an 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, and PNG files are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single('profilePicture'); // Expect a single file with field name 'profilePicture'


const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({ username, email, password });
    await user.save();

    // Generate JWT for immediate login after registration (optional)
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(201).json({
      message: 'Registration Successful',
      token, // Include token so user can use it immediately
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT with expiration
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(200).json({
      message: 'Login Successful',
      token,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const userDetails = async (req, res) => {
  try {
    // Get user ID from decoded token (set by authMiddleware)
    const userId = req.user.id;

    // Find user in database, excluding password
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare response data
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      // Optional: Generate fresh token (if you want to refresh it)
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET),
    };

    res.status(200).json({
      message: 'User details retrieved successfully',
      user: userData,
    });
  } catch (err) {
    console.error('Error in userDetails:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ message: err.message });
    }

    const userId = req.user.id;
    const { username, email } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update fields if provided
      if (username) user.username = username;
      if (email) user.email = email;
      if (req.file) {
        console.log('File uploaded:', req.file);
        user.profilePicture = `/uploads/${req.file.filename}`; // Store relative path
      }else{
        console.log('No new file uploaded, keeping existing profilePicture:', user.profilePicture);
      }

      await user.save();

      const updatedUserData = {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture || '',
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET),
      };

      console.log('Response data:', updatedUserData); // Log the response

      res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUserData,
      });
    } catch (err) {
      console.error('Error in updateProfile:', err.message);
      if (err.code === 11000) {
        return res.status(400).json({ message: 'Username or email already in use' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
};



// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { register, login, userDetails, updateProfile,getAllUsers  };
