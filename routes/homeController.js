"use strict";

const Product = require("../models/product");

//page index
exports.getIndex = (req, res) => {
    Product.find({})
        .then(product => {
            res.render("index", { title: "Product Database System", products: product });
        })
        .catch(error => {
            res.redirect("/index");
        });
};

//page ajout produit
exports.addProduct = (req, res) => {
    res.render("new", { title: "Add product", product: new Product() });
};

//sauve produit et redirige vers index
exports.saveAndRedirect = (req, res) => {
    const product = new Product({
        code: req.body.code,
        description: req.body.description,
        price: req.body.price
    });
    product.save()
        .then(product => {
            req.flash("success_msg", "Product data added to database successfully");
            res.redirect("/index");
        })
        .catch(error => {
            req.flash("error_msg", `Failed to add product data. ${error.message}`);
            res.render("new", { product: product });
        });
};

//page edition produit
exports.edit = (req, res) => {
    const searchById = { _id: req.params.id };
    Product.findOne(searchById)
        .then(product => {
            res.render("edit", { title: "Edit product", product: product });
        })
        .catch(error => {
            res.redirect("/index");
        });
};

//sauve modification et redirige vers index
exports.updateAndRedirect = (req, res) => {
    const searchQuery = { _id: req.params.id };
    Product.updateOne(searchQuery, {
            $set: {
                code: req.body.code,
                description: req.body.description,
                price: req.body.price
            }
        }).then(product => {
            req.flash("success_msg", "Product data updated successfully");
            res.redirect("/index");
        })
        .catch(error => {
            req.flash("error_msg", `Failed to update product data. ${error.message}`);
            res.redirect(`/edit/${product._id}`); //à vérifier
        });
};

//efface produit de la dB
exports.delete = (req, res) => {
    const searchQuery = { _id: req.params.id };
    Product.deleteOne(searchQuery)
        .then(() => {
            req.flash("success_msg", "Product deleted successfully");
            res.redirect("/index");
        }).catch(error => {
            req.flash("error_msg", `failed to delete product. ${error.message}`);
            res.redirect("/index");
        });
};

//page recherche
exports.searchForm = (req, res) => {
    res.render("search", { title: "Search product", product: null });
};

//donne resultat de la recherche par code
exports.giveResult = (req, res) => {
    const searchByCode = { code: req.query.code };
    Product.findOne(searchByCode)
        .then(product => {
            if (!!product) {
                res.render("search", { title: "Search result", product: product });
            } else {
                req.flash("error_msg", "Product does not exist with this name.");
                res.redirect("/search");
            }
        })
        .catch(error => {
            res.redirect("/index");
        });
};