var models = require('./models');
var Page = models.Page;
var User = models.User;
var app = require('./app');

User.sync({ force: true })
    .then(function () {
        return Page.sync({ force: true });
    })
    .then(function () {
        app.listen(3001, function () {
            console.log('Server is listening on port 3001!');
        });
    });

