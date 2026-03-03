const purchaseCustomerService = require('../services/purchaseCustomerService');
const userService = require('../services/userService');
const boxService = require('../services/boxService');
const productService = require('../services/productService');

exports.getAllNeededInformation = async (req, res) => {
    try {
        const orders = await purchaseCustomerService.getAllOrders();
        const ordersThisMonth = await purchaseCustomerService.getOrdersThisMonth();

        const income = await purchaseCustomerService.getIcome();
        const incomeThisMonth = await purchaseCustomerService.getIcomeThisMonth();

        const customer = await userService.getCustomerCount();
        const customerThisMonth = await userService.getCustomerCountThisMonth();

        const shop = await userService.getShopCount();
        const shopThisMonth = await userService.getShopCountThisMonth();

        const boxOccupied = await boxService.getBoxOccupiedCount();

        const boxAvailable = await boxService.getBoxAvailableCount();

        const boxMaintenance = await boxService.getBoxMaintenanceCount();

        const products = await productService.getAllProductsCount();
        const productsThisMonth = await productService.getAllProductsCountThisMonth();

        const result = {
            orders: orders,
            ordersThisMonth: ordersThisMonth,
            income: income,
            incomeThisMonth: incomeThisMonth,
            customer: customer,
            customerThisMonth: customerThisMonth,
            shop: shop,
            shopThisMonth: shopThisMonth,
            boxOccupied: boxOccupied,
            boxAvailable: boxAvailable,
            boxMaintenance: boxMaintenance,
            products: products,
            productsThisMonth: productsThisMonth
        }

        res.json(result);
    } catch (error) {
        console.error("Error getting dash board information : ", error);
        res.status(400).json({ message: error.message });
    }
}