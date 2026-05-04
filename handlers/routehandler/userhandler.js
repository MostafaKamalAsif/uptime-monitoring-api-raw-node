const handler = {};

// ================= USERS SUB HANDLERS =================
handler._users = {};

// GET
handler._users.get = (requestProperties, callback) => {
    callback(200, {
        message: 'GET request success'
    });
};

// POST
handler._users.post = (requestProperties, callback) => {
   const firstName= typeof(requestProperties.body.firstName) == 'string' && requestProperties.body.firstName.trim().length> 0 ? requestProperties.body.firstName : false;
   const lastName= typeof(requestProperties.body.lastName) == 'string' && requestProperties.body.lastName.trim().length> 0 ? requestProperties.body.lastName : false;
   const phone= typeof(requestProperties.body.phone) == 'number' && requestProperties.body.phone.trim().length == 11 ? requestProperties.body.phone : false;
   const password= typeof(requestProperties.body.password) == 'string' && requestProperties.body.password.trim().length> 0 ? requestProperties.body.password : false;
   const tosAgrement= typeof(requestProperties.body.tosAgrement) == 'boolean' && requestProperties.body.tosAgrement.trim().length> 0 ? requestProperties.body.tosAgrement : false;

   if(firstName && lastName && phone && password && tosAgrement){
     // make sure that the user doesn't alrady exits 
   }else{
    callback(400,{
        error:'You have a problem in you request'
    })
   }
};

// PUT
handler._users.put = (requestProperties, callback) => {
    callback(200, {
        message: 'PUT request success'
    });
};

// DELETE
handler._users.delete = (requestProperties, callback) => {
    callback(200, {
        message: 'DELETE request success'
    });
};

// ================= MAIN USER HANDLER =================
handler.userhandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    const method = requestProperties.method;

    if (acceptedMethods.includes(method)) {
        handler._users[method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method not allowed'
        });
    }
};

module.exports = handler;
