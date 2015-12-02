var cls = require('continuation-local-storage');

var context = {
    startContext: function (req,res,next) {

        var poc = cls.getNamespace('poc');

        //Set request body as cls value
        poc.set('body', req.query);

        // Call the next function so that it can complete its processing.
        next();
       
    },
    middleware: function (req, res, next) {

        // Get Namespace that was created for the app
        var poc = cls.getNamespace('poc');

        // Create a new Context. Run creates context
        poc.run(function () {
            // Anything within this function will keep the context.
            context.startContext(req, res, next);
        })
    }
}

module.exports = context;
