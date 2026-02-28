const userService = require('../services/userService');

exports.createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getUsersByRole = async (req, res) => {
    try {
        const users = await userService.getUsersByRole(req.params.role);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAvailableShops = async (req, res) => {
    try {
        const users = await userService.getAvailableShops();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user)
        {
            return res.status(404).json({ message: 'User not found' });
        } 
        res.json(user);
    } catch (err) {
        res.status(500).json(
            {
                message: err.message 
            }
        );
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.json(user);
    } catch (err) {
        res.status(400).json(
            {
                message: err.message 
            }
        );
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json(
            { 
                message: 'User deleted' 
            }
        );
    } catch (err) {
        res.status(400).json(
            { 
                message: err.message 
            }
        );
    }
};

exports.login = async (req, res) => {
  try {
    const result = await userService.loginUser(req.body);

    if (!result) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', token: result.token, user: result.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.me = async (req, res) => {
     try {
        const user = await userService.me(req.user.id);
        if (!user)
        {
            return res.status(404).json({ message: 'User not found' });
        } 
        res.json(user);
    } catch (err) {
        res.status(500).json(
            {
                message: err.message 
            }
        );
    }
};


exports.getMyBox = async (req, res) => {
    try {
        const box = await userService.getMyBox(req.params.id);
        res.json(box);
    } catch (err) {
        res.status(500).json(
            {
                message: err.message 
            }
        );
    }
};