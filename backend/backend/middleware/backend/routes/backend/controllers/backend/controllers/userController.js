const jwt = require('jsonwebtoken');

// @desc    Register new user
// @route   POST /api/users/register
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Validation check
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Fill all fields' });
    }

    // 2. Generate Token
    const token = jwt.sign({ id: 'user_id_here' }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
        id: 'new_user_id',
        name,
        email,
        token
    });
};
