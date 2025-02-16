import { Router } from "express";
import { Facture } from "../sequelize/schemas/relation.js";
import verifyjwt from "../utils/jwt.js";
const router = Router();
router.use(verifyjwt);
router.get("/statistic", async (request, response) => {
    try {
        const userid = request.userid;
        const factures = await Facture.findAll({ where: { Userid: userid } });
        const totalprofit = factures.reduce((acc, facture) => acc + facture.profit, 0);
        const totalcapital = factures.reduce((acc, facture) => acc + facture.capital, 0);
        const total = totalcapital + totalprofit;
        const totalselles = factures.length;
        response.json({ total, totalprofit, totalcapital, totalselles });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.get("/statistic/:year", async (request, response) => {
    try {
        const userid = request.userid;
        const year = +request.params.year;
        const factures = await Facture.findAll({ where: { Userid: userid } });
        const yearfactures = factures.filter(facture => facture.created_at.getFullYear() === year);
        if (yearfactures.length === 0) {
            response.status(404).json({ error: "No statice found for this year" });
        }
        const totalprofit = yearfactures.reduce((acc, facture) => acc + facture.profit, 0);
        const totalcapital = yearfactures.reduce((acc, facture) => acc + facture.capital, 0);
        const total = totalcapital + totalprofit;
        const totalselles = yearfactures.length;
        response.json({ yearfactures, total, totalprofit, totalcapital, totalselles });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.get("/statistic/:year/:month", async (request, response) => {
    try {
        const userid = request.userid;
        const year = +request.params.year;
        const month = +request.params.month;
        const factures = await Facture.findAll({ where: { Userid: userid } });
        const monthfactures = factures.filter(facture => facture.created_at.getFullYear() == year && facture.created_at.getMonth() == month - 1);
        if (monthfactures.length === 0) {
            response.status(404).json({ error: "No statice found" });
            return;
        }
        const totalprofit = monthfactures.reduce((acc, facture) => acc + facture.profit, 0);
        const totalcapital = monthfactures.reduce((acc, facture) => acc + facture.capital, 0);
        const total = totalcapital + totalprofit;
        const totalselles = monthfactures.length;
        response.json({ monthfactures, total, totalprofit, totalcapital, totalselles });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.get("/statistic/:year/:month/:day", async (request, response) => {
    try {
        const userid = request.userid;
        const year = +request.params.year;
        const month = +request.params.month;
        const day = +request.params.day;
        const factures = await Facture.findAll({ where: { Userid: userid } });
        const dayfactures = factures.filter(facture => facture.created_at.getFullYear() == year && facture.created_at.getMonth() == month - 1 && facture.created_at.getDate() == day);
        if (dayfactures.length === 0) {
            response.status(404).json({ error: "No statice found" });
            return;
        }
        const totalprofit = dayfactures.reduce((acc, facture) => acc + facture.profit, 0);
        const totalcapital = dayfactures.reduce((acc, facture) => acc + facture.capital, 0);
        const total = totalcapital + totalprofit;
        const totalselles = dayfactures.length;
        response.json({ dayfactures, total, totalprofit, totalcapital, totalselles });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
router.get("/statistic_intervalle", async (request, response) => {
    try {
        const userid = request.userid;
        const intervalle = request.body;
        const startDate = new Date(intervalle.start);
        const endDate = new Date(intervalle.end);
        console.log(startDate, endDate);
        const factures = await Facture.findAll({ where: { Userid: userid } });
        const intervallefactures = factures.filter(facture => {
            const factureDate = new Date(facture.created_at);
            return factureDate >= startDate && factureDate <= endDate
        });
        if (intervallefactures.length === 0) {
            response.status(404).json({ error: "No statice found" });
            return;
        }
        const totalprofit = intervallefactures.reduce((acc, facture) => acc + facture.profit, 0);
        const totalcapital = intervallefactures.reduce((acc, facture) => acc + facture.capital, 0);
        const total = totalcapital + totalprofit;
        const totalselles = intervallefactures.length;
        response.json({ intervallefactures, total, totalprofit, totalcapital, totalselles });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});
export default router;