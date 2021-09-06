const NewUser  = require('../models/SignUp');

const getUsers = async function (req, res) {
    const users = await NewUser.find({
        $or: [{"firstname": {$regex: req.params.name}},
              {"lastname": {$regex: req.params.name}}]
    },
    {
        _id: 1,
        firstname: 1,
        lastname: 1,
        ProfilePic: 1
    });
    res.send(users);
}

module.exports = {
    getUsers
}