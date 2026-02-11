const customerService = require('../services/customerService');

exports.createCustomer = async (req, res) => {
    try {
        const customer = await customerService.createCustomer(req.body);
        res.status(201).json(customer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCustomer = async (req, res) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id);
        if (!customer)
        {
            return res.status(404).json({ message: 'Customer not found' });
        } 
        res.json(customer);
    } catch (err) {
        res.status(500).json(
            {
                message: err.message 
            }
        );
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const customer = await customerService.updateCustomer(req.params.id, req.body);
        res.json(customer);
    } catch (err) {
        res.status(400).json(
            {
                message: err.message 
            }
        );
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        await customerService.deleteCustomer(req.params.id);
        res.json(
            { 
                message: 'Customer deleted' 
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
    const { mail, password } = req.body;
    const result = await customerService.loginCustomer(mail, password);

    if (!result) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', token: result.token, customer: result.customer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
