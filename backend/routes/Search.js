const express			= require('express');
const SearchController  = require('../controllers/Search.js');
const upload            = require('../middleware/upload.js');
const dotenv            = require('dotenv');
dotenv.config();

const router  = express.Router();

//all routes are starting with /search

router.get("/search/:query", function (req, res) {
    res.render("search", {
        "query": req.params.query
    });
});

// @desc Search for Users
router.get("/:name", SearchController.getUsers);

// @desc Search for Users Friends
router.get("/:id/:name", SearchController.getUsers_Friends);

// @desc Search Users by ID
router.get('/search/id/:id', SearchController.getUsersID);

module.exports = router;