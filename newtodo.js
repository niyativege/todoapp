const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 8000;


// Database Config

// const sequelize = new Sequelize('database', 'postgres', 'ilovesamata', {
//     host: 'localhost',
//     dialect: 'postgres'
// });

const sequelize = new Sequelize('todo', 'postgres', 'ilovesamata', {
    host: 'localhost',
    dialect: 'postgres'
});


// Database connection 


sequelize.authenticate()
    .then(() => {
        console.log("Database Connected");
    }).catch(err => {
        console.error('unable to connect to Database');
    });


// Creating DB schemas and Creating Tables


const users = sequelize.define('users', {

    uid: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false
    },

    email_id: {
        type: Sequelize.TEXT,
        allowNull: false
    },

    profile_pic: {
        type: Sequelize.STRING,
        allowNull: false
    }

}, {
    timestamps: false
});



const todo = sequelize.define('todo', {

    tid: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    uid: {
        type: Sequelize.BIGINT,
        allowNull: false
    },

    title: {
        type: Sequelize.STRING,
        allowNull: false
    },

    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },

    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },

    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }

}, {
    timestamps: false
});




// sequelize.sync({
//     force: true
// });


// Done with Database

// creating API's
app.get('/', function (req, res) {
    res.statusCode(200).json({
        success: true,
        data: "Home Url"
    });
    return;
});


app.post('/create/user', async function (req, res) {

    try {

        if (!req.body.name) {
            res.status(500).json({
                success: true,
                message: "Name is required"
            });
            return;
        }

        if (!req.body.email_id) {
            res.status(500).json({
                success: true,
                message: "Email id is required"
            });
            return;
        }


        if (!req.body.profile_pic) {
            res.status(500).json({
                success: true,
                message: "Profile pic is required"
            });
            return;
        }



        var new_user = {
            name: req.body.name,
            email_id: req.body.email_id,
            profile_pic: req.body.profile_pic
        }

        var result = await users.create(new_user);

        if (result) {
            res.status(200).json({
                success: true,
            });
            return;

        }
        else {
            res.status(500).json({
                success: false
            });
            return;
        }



    } catch (err) {

        console.log(err)

        res.status(500).json({
            success: false,
            error: 'Server error'
        });
        return;
    }


});

app.get('/get/user', async function (req, res) {
    try {

        var all_users = await users.findAll();

        if (all_users.length > 0) {

            res.status(200).json({
                success: true,
                users: all_users
            });
            return;

        }
        else {
            res.status(200).json({
                success: true,
                message: "No users"
            });
            return;
        }


    } catch (err) {

        console.log(err)

        res.status(500).json({
            success: false,
            error: 'Server error'
        });
        return;
    }

});


app.post('/delete/user', async function (req, res) {
    try {


        if (!req.body.uid) {
            res.status(500).json({
                success: true,
                message: "uid is required"
            });
            return;
        }

        var all_users = await users.destroy({
            where: {
                uid: req.body.uid
            }
        })

        if (all_users) {
            res.status(200).json({
                success: true,
                users: all_users
            });
            return;
        }
        else {
            res.status(500).json({
                success: false,
                message: "error"
            });
            return;
        }



    } catch (err) {

        console.log(err)

        res.status(500).json({
            success: false,
            error: 'Server error'
        });
        return;
    }

});


app.post('/update/user', async function (req, res) {

    try {

        if (!req.body.uid) {
            res.status(500).json({
                success: true,
                message: "uid is required"
            });
            return;
        }

        var update_user = {
            name: req.body.name,
            email_id: req.body.email_id,
            profile_pic: req.body.profile_pic
        }

        var all_users = await users.update(update_user, {
            where: {
                uid: req.body.uid
            }
        });

        if (all_users) {
            res.status(200).json({
                success: true,
                users: all_users
            });
            return;
        }
        else {
            res.status(500).json({
                success: false,
                message: "error"
            });
            return;
        }


    } catch (err) {

        console.log(err)

        res.status(500).json({
            success: false,
            error: 'Server error'
        });
        return;
    }

});


app.post('/create/todo', async function (req, res) {


    try {

        if (!req.body.uid) {
            res.status(500).json({
                success: true,
                message: "uid is required"
            });
            return;
        }

        if (!req.body.title) {
            res.status(500).json({
                success: true,
                message: "title is required"
            });
            return;
        }

        if (!req.body.description) {
            res.status(500).json({
                success: true,
                message: "description is required"
            });
            return;
        }

        var new_todo = {
            uid: req.body.uid,
            title: req.body.title,
            description: req.body.description,
        }

        var result = await todo.create(new_todo);

        if (result) {
            res.status(200).json({
                success: true,
                message: ' todo created'
            });
            return;
        }
        else {
            res.status(500).json({
                success: false,
                message: 'error'
            });
            return;
        }

    } catch (err) {

        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
        return;

    }
});


app.get('/get/todo', async function (req, res) {
    try {

        var result = await users.findAll();

        if (result.length > 0) {
            res.status(200).json({
                success: true,
                users: result
            });
            return;

        }
        else {
            res.status(500).json({
                success: false,
                message: "error"
            });
            return;
        }


    } catch (err) {

        console.log(err)

        res.status(500).json({
            success: false,
            error: 'Server error'
        });
        return;
    }

});




app.post('/delete/todo', async function (req, res) {
    try {


        if (!req.body.tid) {
            res.status(500).json({
                success: true,
                message: "tid is required"
            });
            return;
        }

        var update_obj = {
            deleted: true
        }

        var result = await todo.update(update_obj, {
            where: {
                tid: req.body.tid
            }
        });

        if (result) {
            res.status(200).json({
                success: true,
                message: ' todo deleted'
            });
            return;
        }
        else {
            res.status(500).json({
                success: true,
                message: 'error'
            });
            return;
        }


    } catch (err) {

        console.log(err)

        res.status(500).json({
            success: false,
            error: 'Server error'
        });
        return;
    }

})


app.post('/update/todo', async function (req, res) {

    try {

        if (!req.body.tid) {
            res.status(500).json({
                success: true,
                message: "tid is required"
            });
            return;
        }


        var update_obj = {
            title: req.body.title,
            description: req.body.description,
            deleted: req.body.deleted,
            completed: req.body.completed
        }

        var result = await todo.update(update_obj, {
            where: {
                tid: req.body.tid
            }
        })

        if (result) {
            res.status(200).json({
                success: true,
                message: 'todo updated'
            });
            return;
        }
        else{
            res.status(500).json({
                success: true,
                message: 'error'
            });
            return;
        }

    } catch (err) {

        console.log(err)

        res.status(500).json({
            success: false,
            error: 'Server error'
        });
        return;
    }

})




app.listen(port, (req, res) => {
    console.log(`server started on port ${port}`);
});