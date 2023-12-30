const express = require("express");
const SellBuy = require("../mongoose/models/sellBuy")

// setting up the router

const sellAndBuyRouter = new express.Router();

// code goes here for routes

sellAndBuyRouter.get('/sellProduct', async (req, res) => {
    if (req.query.product) {
        let data = await SellBuy.find({
            productName: req.query.product
        });

        res.status(200);
        res.send(data);
        return
    } else if (req.query.sortBy) {
        if (req.query.sortBy == "lowerCostPrice") {
            var mySort = { costPrice: 1 }
        } else if (req.query.sortBy == "higherCostPrice") {
            var mySort = { costPrice: -1 }
        } else if (req.query.sortBy == "lowerSoldPrice") {
            var mySort = { soldPrice: 1 }
        } else if (req.query.sortBy == "higherSoldPrice") {
            var mySort = { soldPrice: -1 }
        }

        let data = await SellBuy.find().sort(mySort);

        res.status(200);
        res.send(data)
        return
    } else {
        let data = await SellBuy.find();
        res.status(200);
        res.send(data);
        return
    }
});

sellAndBuyRouter.post('/sellProduct', async (req, res) => {
    if (req.body.productName.length < 4) {
        res.status(400);
        res.send({error: "product name should have minimum of four characters"});
        return
    } else if (req.body.costPrice <= 0) {
        res.status(400);
        res.send({error: "cost price value cannot be zero or negative value"});
        return
    } else {
        let newDoc = {
            productName: req.body.productName,
            costPrice: req.body.costPrice
        }
        await new SellBuy(newDoc).save();
        res.status(201);
        res.send({message: "Product Added"})
        return
    }
});


sellAndBuyRouter.patch('/sellProduct/:id', async (req, res) => {
    // let data = Object.keys(req.body).length
    // console.log(data)
    if (req.body.soldPrice <= 0) {
        res.status(400);
        res.send({error: "sold price value cannot be zero or negative value"});
        return
    } else {
        await SellBuy.updateOne(
            { _id: req.params.id },
            {$set: { soldPrice: req.body.soldPrice }}
        );
        res.status(200);
        res.send({message: "Updated Successfully"})
        return
    }
});


sellAndBuyRouter.delete('/sellProduct/:id', async (req, res) => {
    try{
    await SellBuy.deleteOne(
            { _id: req.params.id });
        res.status(200);
        res.send({message: "Deleted successfully"});
        return;
    } catch(err){
        res.status(400);
        res.send();
    }
})

// exporting the router

module.exports = sellAndBuyRouter;


