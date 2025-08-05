require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import configurations
const { pool, testConnection } = require('./config/database');
const { uploadImage } = require('./config/cloudinary');
const { 
    createRateLimiter, 
    authRateLimiter, 
    corsOptions, 
    securityConfig 
} = require('./middleware/security');
const {
    validateUserRegistration,
    validateUserLogin,
    validateOrganizerDetails,
    validateTournamentCreation,
    validatePlayerDetails,
    validatePasswordChange,
    handleValidationErrors
} = require('./middleware/validation');
const {
    AppError,
    globalErrorHandler,
    catchAsync,
    handleDatabaseError,
    handleFileUploadError
} = require('./utils/errorHandler');

const app = express();
const PORT = process.env.PORT || 2008;

// Security middleware
app.use(helmet(securityConfig));
app.use(cors(corsOptions));
app.use(createRateLimiter());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Static files
app.use(express.static('public'));

// Database connection test
testConnection();

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// User registration
app.get('/save-user', 
    authRateLimiter,
    validateUserRegistration,
    handleValidationErrors,
    catchAsync(async (req, res) => {
        const { email, pwd, user } = req.query;
        
        const [result] = await pool.execute(
            'INSERT INTO usersss(emailid, pwd, utype) VALUES (?, ?, ?)',
            [email, pwd, user]
        );
        
        res.json({
            success: true,
            message: 'User registered successfully',
            userId: result.insertId
        });
    })
);

// User login
app.get('/login-user',
    authRateLimiter,
    validateUserLogin,
    handleValidationErrors,
    catchAsync(async (req, res) => {
        const { email, pwd } = req.query;
        
        const [records] = await pool.execute(
            'SELECT * FROM usersss WHERE emailid = ? AND pwd = ?',
            [email, pwd]
        );
        
        if (records.length === 1) {
            const user = records[0];
            if (user.status === 0) {
                res.json({ success: false, message: 'Account is blocked' });
            } else {
                res.json({ 
                    success: true, 
                    userType: user.utype,
                    message: 'Login successful'
                });
            }
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
    })
);

// Submit organizer details
app.post('/submit-org-details',
    validateOrganizerDetails,
    handleValidationErrors,
    catchAsync(async (req, res) => {
        const {
            email, orgname, regno, address, city, sports,
            website, insta, head, contact, pic, info
        } = req.body;
        
        await pool.execute(
            `INSERT INTO organiser(emailid, orgname, regnumber, address, city, 
             sports, website, insta, head, contact, picurl, otherinfo) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [email, orgname, regno, address, city, sports, 
             website, insta, head, contact, pic, info]
        );
        
        res.json({
            success: true,
            message: 'Organizer details submitted successfully!'
        });
    })
);

// Publish event/tournament
app.get('/publish-event',
    validateTournamentCreation,
    handleValidationErrors,
    catchAsync(async (req, res) => {
        const {
            emaill, title, date, time, location, cityy, category,
            minage, maxage, lastdate, fees, prize, person
        } = req.query;
        
        await pool.execute(
            `INSERT INTO tournaments(emailid, event, doe, toe, location, city, 
             sports, minage, maxage, lastdate, fee, prize, contact) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [emaill, title, date, time, location, cityy, category,
             minage, maxage, lastdate, fees, prize, person]
        );
        
        res.json({
            success: true,
            message: 'Tournament published successfully'
        });
    })
);

// Player details submission with file upload
app.post('/player-details',
    validatePlayerDetails,
    handleValidationErrors,
    catchAsync(async (req, res) => {
        let acardPicUrl = req.body.hdnAcard || '';
        let profilePicUrl = req.body.hdnProfile || '';
        
        // Handle file uploads
        if (req.files) {
            try {
                if (req.files.adhaarPic) {
                    const fileName = req.files.adhaarPic.name;
                    const filePath = path.join(__dirname, 'public', 'pics', fileName);
                    await req.files.adhaarPic.mv(filePath);
                    acardPicUrl = await uploadImage(filePath);
                }
                
                if (req.files.profilePic) {
                    const fileName = req.files.profilePic.name;
                    const filePath = path.join(__dirname, 'public', 'pics', fileName);
                    await req.files.profilePic.mv(filePath);
                    profilePicUrl = await uploadImage(filePath);
                }
            } catch (error) {
                throw handleFileUploadError(error);
            }
        }
        
        const {
            inputemail5, name3, date, gender, inputloc1, 
            inputcontact1, comboUser, inputinfo
        } = req.body;
        
        await pool.execute(
            `INSERT INTO players(emailid, acardpicurl, profilepicurl, name, dob, 
             gender, address, contact, game, otherinfo) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [inputemail5, acardPicUrl, profilePicUrl, name3, date, gender,
             inputloc1, inputcontact1, comboUser, inputinfo]
        );
        
        res.json({
            success: true,
            message: 'Player details uploaded successfully'
        });
    })
);

// Fetch tournaments for a user
app.get('/fetch-tournaments',
    catchAsync(async (req, res) => {
        const { emailid } = req.query;
        
        const [tournaments] = await pool.execute(
            'SELECT * FROM tournaments WHERE emailid = ?',
            [emailid]
        );
        
        res.json({
            success: true,
            data: tournaments
        });
    })
);

// Delete tournament
app.get('/delete-tournamentmanager',
    catchAsync(async (req, res) => {
        const { rid } = req.query;
        
        const [result] = await pool.execute(
            'DELETE FROM tournaments WHERE rid = ?',
            [rid]
        );
        
        if (result.affectedRows === 1) {
            res.json({
                success: true,
                message: 'Tournament deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Tournament not found'
            });
        }
    })
);

// Change password
app.get('/change-password',
    validatePasswordChange,
    handleValidationErrors,
    catchAsync(async (req, res) => {
        const { emailid, oldpwd, newpwd } = req.query;
        
        const [result] = await pool.execute(
            'UPDATE usersss SET pwd = ? WHERE emailid = ? AND pwd = ?',
            [newpwd, emailid, oldpwd]
        );
        
        if (result.affectedRows === 1) {
            res.json({
                success: true,
                message: 'Password updated successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid old password or email'
            });
        }
    })
);

// Fetch distinct sports
app.get('/dofetchdistinct-sports',
    catchAsync(async (req, res) => {
        const [sports] = await pool.execute('SELECT DISTINCT sports FROM tournaments');
        res.json({
            success: true,
            data: sports
        });
    })
);

// Fetch distinct cities
app.get('/dofetchdistinct-cities',
    catchAsync(async (req, res) => {
        const [cities] = await pool.execute('SELECT DISTINCT city FROM tournaments');
        res.json({
            success: true,
            data: cities
        });
    })
);

// Fetch tournaments by sports and city
app.get('/fetch-player-tournaments-cards',
    catchAsync(async (req, res) => {
        const { selsports, selcity } = req.query;
        
        const [tournaments] = await pool.execute(
            'SELECT * FROM tournaments WHERE sports = ? AND city = ?',
            [selsports, selcity]
        );
        
        res.json({
            success: true,
            data: tournaments
        });
    })
);

// Fetch player records
app.get('/fetch-player-records',
    catchAsync(async (req, res) => {
        const [players] = await pool.execute('SELECT * FROM players');
        res.json({
            success: true,
            data: players
        });
    })
);

// Fetch organizer records
app.get('/fetch-org-records',
    catchAsync(async (req, res) => {
        const [organizers] = await pool.execute('SELECT * FROM organiser');
        res.json({
            success: true,
            data: organizers
        });
    })
);

// Fetch all users
app.get('/dofetchrecords',
    catchAsync(async (req, res) => {
        const [users] = await pool.execute('SELECT * FROM usersss');
        res.json({
            success: true,
            data: users
        });
    })
);

// Block user
app.get('/doblock',
    catchAsync(async (req, res) => {
        const { emailid } = req.query;
        
        await pool.execute(
            'UPDATE usersss SET status = 0 WHERE emailid = ?',
            [emailid]
        );
        
        res.json({
            success: true,
            message: 'User blocked successfully'
        });
    })
);

// Activate user
app.get('/doactive',
    catchAsync(async (req, res) => {
        const { emailid } = req.query;
        
        await pool.execute(
            'UPDATE usersss SET status = 1 WHERE emailid = ?',
            [emailid]
        );
        
        res.json({
            success: true,
            message: 'User activated successfully'
        });
    })
);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use(globalErrorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});




