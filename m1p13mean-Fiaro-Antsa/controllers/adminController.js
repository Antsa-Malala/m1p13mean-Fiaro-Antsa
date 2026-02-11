const adminService = require('../services/adminService');

exports.createAdmin = async (req, res) => {
    try {
        const admin = await adminService.createAdmin(req.body);
        res.status(201).json(admin);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAdmins = async (req, res) => {
    try {
        const admins = await adminService.getAllAdmins();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAdmin = async (req, res) => {
    try {
        const admin = await adminService.getAdminById(req.params.id);
        if (!admin)
        {
            return res.status(404).json({ message: 'Admin not found' });
        } 
        res.json(admin);
    } catch (err) {
        res.status(500).json(
            {
                message: err.message 
            }
        );
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const admin = await adminService.updateAdmin(req.params.id, req.body);
        res.json(admin);
    } catch (err) {
        res.status(400).json(
            {
                message: err.message 
            }
        );
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        await adminService.deleteAdmin(req.params.id);
        res.json(
            { 
                message: 'Admin deleted' 
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
    const { name, password } = req.body;
    const result = await adminService.loginAdmin(name, password);

    if (!result) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', token: result.token, admin: result.admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
