import { Router } from "express";
import { Product, Facture } from "../sequelize/schemas/relation.js";
import { Op } from "sequelize";
import verifyjwt from "../utils/jwt.js";
const router = Router();
router.use(verifyjwt);
router.post("/sell", async (request, response) => {
    try {
        const barcode = request.body.barcode;
        const userid = request.userid;
        const product = await Product.findOne({
            where: { barcode: barcode, Userid: userid },
            attributes: ['id_product', 'name', 'price_sell', 'price_bought']
        }); 0
        if (product === null) {
            response.status(404).json({ error: "Product not found" });
            return;
        }
        response.json(product);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.post("/sell/server/checkout", async (request, response) => {
    try {
        const productsid = request.body.productsid;
        const productsquantity = request.body.productsquantity;
        const userid = request.userid;
        const facture = await Facture.create({
            Userid: userid,
            total: 0,
            profit: 0,
            capital: 0,
            listofproducts: []
        });
        for (let i = 0; i < productsid.length; i++) {
            const product = await Product.findOne({
                where: { id_product: productsid[i], Userid: userid },
                attributes: ['id_product', 'name', 'stock', 'price_sell', 'price_bought']
            });
            if (product === null) {
                response.status(404).json({ error: "Product not found" });
                return;
            }
            if (product.stock < productsquantity[i]) {
                response.status(400).json({ error: "Not enough stock" });
                return;
            }
            facture.total += product.price_sell * productsquantity[i];
            facture.profit += (product.price_sell - product.price_bought) * productsquantity[i];
            facture.capital += product.price_bought * productsquantity[i];
            facture.listofproducts.push({ productname: product.name, quantity: productsquantity[i], price: product.price_sell });
            product.stock -= productsquantity[i];
            await product.save();
            await facture.save();
        }
        response.json(facture);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.get("/sell/search", async (request, response) => {
    try {
        const query = request.query.product;
        const userid = request.userid;
        console.log(query);
        const products = await Product.findAll({
            where: {
                Userid: userid,
                name: { [Op.like]: `%${query}%` }
            },
            attributes: ['id_product', 'name', 'price_sell']
        });
        response.json(products);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.post("/sell/client/checkout", async (request, response) => {
    const total = request.body.total;
    const profit = request.body.profit;
    const capital = request.body.capital;
    const listofproducts = request.body.listofproducts;
    const userid = request.userid;
    const facture = await Facture.create({
        Userid: userid,
        total: total,
        profit: profit,
        capital: capital,
        listofproducts: listofproducts
    });
    for (let i = 0; i < productsid.length; i++) {
        const product = await Product.findOne({
            where: { id_product: productsid[i], Userid: userid },
            attributes: ['id_product', 'name', 'stock', 'price_sell', 'price_bought']
        });
        if (product === null) {
            response.status(404).json({ error: "Product not found" });
            return;
        }
        if (product.stock < productsquantity[i]) {
            response.status(400).json({ error: "Not enough stock" });
            return;
        }
        facture.total += product.price_sell * productsquantity[i];
        facture.profit += (product.price_sell - product.price_bought) * productsquantity[i];
        facture.capital += product.price_bought * productsquantity[i];
        facture.listofproducts.push({ productname: product.name, quantity: productsquantity[i], price: product.price_sell });
        product.stock -= productsquantity[i];
        await product.save();
        await facture.save();
    }
    response.json(facture);
});
export default router;