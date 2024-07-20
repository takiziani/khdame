import { Router } from "express";
import { Product } from "../sequelize/schemas/relation.js";
import verifyjwt from "../utils/jwt.js";
const router = Router();
router.use(verifyjwt);
router.post("/stock/add", async (request, response) => {
    const product = request.body;
    product.Userid = request.userid;
    console.log(request.userid);
    try {
        const newproduct = await Product.create(product);
        response.json(newproduct);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.get("/stock", async (request, response) => {
    try {
        const products = await Product.findAll({ where: { Userid: request.userid } });
        response.json(products);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.get("/stock/:id", async (request, response) => {
    const id = request.params.id;
    try {
        const product = await Product.findOne({ where: { id: id } });
        if (product === null) {
            response.status(404).json({ error: "Product not found" });
            return;
        }
        response.json(product);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.delete("/stock/:id", async (request, response) => {
    const id = request.params.id;
    try {
        const product = await Product.findOne({ where: { id: id } });
        if (product === null) {
            response.status(404).json({ error: "Product not found" });
            return;
        }
        await product.destroy();
        response.json(product);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.patch("/stock/:id", async (request, response) => {
    const id = request.params.id;
    const product = request.body;
    try {
        const productToUpdate = await Product.findOne({ where: { id: id } });
        if (productToUpdate === null) {
            response.status(404).json({ error: "Product not found" });
            return;
        }
        if (product.name) productToUpdate.name = product.name;
        if (product.price) productToUpdate.price = product.price;
        if (product.stock) productToUpdate.stock = product.stock;
        if (product.barcode) productToUpdate.barcode = product.barcode;
        await productToUpdate.save();
        response.json(productToUpdate);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
export default router;