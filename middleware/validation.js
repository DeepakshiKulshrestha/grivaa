const { body, query, validationResult } = require('express-validator');

// Validation rules for user registration
const validateUserRegistration = [
    query('email').isEmail().normalizeEmail(),
    query('pwd').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    query('user').isIn(['admin', 'organiser', 'player']).withMessage('Invalid user type')
];

// Validation rules for user login
const validateUserLogin = [
    query('email').isEmail().normalizeEmail(),
    query('pwd').notEmpty().withMessage('Password is required')
];

// Validation rules for organizer details
const validateOrganizerDetails = [
    body('email').isEmail().normalizeEmail(),
    body('orgname').trim().isLength({ min: 2 }).withMessage('Organization name must be at least 2 characters'),
    body('regno').trim().notEmpty().withMessage('Registration number is required'),
    body('address').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('sports').trim().notEmpty().withMessage('Sports category is required'),
    body('head').trim().notEmpty().withMessage('Head contact is required'),
    body('contact').trim().notEmpty().withMessage('Contact number is required')
];

// Validation rules for tournament creation
const validateTournamentCreation = [
    query('emaill').isEmail().normalizeEmail(),
    query('title').trim().isLength({ min: 3 }).withMessage('Event title must be at least 3 characters'),
    query('date').isISO8601().withMessage('Invalid date format'),
    query('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
    query('location').trim().notEmpty().withMessage('Location is required'),
    query('cityy').trim().notEmpty().withMessage('City is required'),
    query('category').trim().notEmpty().withMessage('Sports category is required'),
    query('minage').isInt({ min: 0, max: 100 }).withMessage('Invalid minimum age'),
    query('maxage').isInt({ min: 0, max: 100 }).withMessage('Invalid maximum age'),
    query('lastdate').isISO8601().withMessage('Invalid last date format'),
    query('fees').isFloat({ min: 0 }).withMessage('Invalid fee amount'),
    query('prize').isFloat({ min: 0 }).withMessage('Invalid prize amount'),
    query('person').trim().notEmpty().withMessage('Contact person is required')
];

// Validation rules for player details
const validatePlayerDetails = [
    body('inputemail5').isEmail().normalizeEmail(),
    body('name3').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('date').isISO8601().withMessage('Invalid date of birth format'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('inputloc1').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
    body('inputcontact1').trim().notEmpty().withMessage('Contact number is required'),
    body('comboUser').trim().notEmpty().withMessage('Game/sport is required')
];

// Validation rules for password change
const validatePasswordChange = [
    query('emailid').isEmail().normalizeEmail(),
    query('oldpwd').notEmpty().withMessage('Old password is required'),
    query('newpwd').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateOrganizerDetails,
    validateTournamentCreation,
    validatePlayerDetails,
    validatePasswordChange,
    handleValidationErrors
}; 