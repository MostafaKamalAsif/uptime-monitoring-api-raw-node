
// depandancies
const data=require('../../lib/data')
const { hash}=require('../../helpers/utilties')
const { parseJSON}=require('../../helpers/utilties')
//MODULE SCAFFOLDING
const handler = {};


// ================= USERS SUB HANDLERS =================
handler._users = {};

// GET
handler._users.get = (requestProperties, callback) => {
    const phone= typeof(requestProperties.queryStringObject.phone) == 'string' && requestProperties.queryStringObject.phone.trim().length == 11 ? requestProperties.queryStringObject.phone : false;
    data.read('users',phone,(err,data)=>{
        const user={...parseJSON(data)}
        if(!err && user){
            delete user.password
            callback(200,user)
        }else{
            callback(404,{error:'Requested user not found'})
        }
    })
};

// POST
handler._users.post = (requestProperties, callback) => {
   const firstName= typeof(requestProperties.body.firstName) == 'string' && requestProperties.body.firstName.trim().length> 0 ? requestProperties.body.firstName : false;
   const lastName= typeof(requestProperties.body.lastName) == 'string' && requestProperties.body.lastName.trim().length> 0 ? requestProperties.body.lastName : false;
   const phone= typeof(requestProperties.body.phone) == 'string' && requestProperties.body.phone.trim().length == 11 ? requestProperties.body.phone : false;
   const password= typeof(requestProperties.body.password) == 'string' && requestProperties.body.password.trim().length> 0 ? requestProperties.body.password : false;
   const tosAgrement= typeof(requestProperties.body.tosAgrement) == 'boolean' ? requestProperties.body.tosAgrement : false;

   if(firstName && lastName && phone && password && tosAgrement){
     // make sure that the user doesn't alrady exits 
     data.read('users', phone, (err1)=>{
        if(err1){
            const userObject={
                firstName,
                lastName,
                phone,
                password: hash(password),
                tosAgrement
            }
            data.create('users', phone , userObject, (err2)=>{
                if(!err2){
                    callback(200, {success:'User created succesfuly'})
                }else{
                    callback(500,{error:'Could not create user'})
                }
            })
        }else{
            callback(500,{
                error:'User alrady exits'
            })
        }
     })
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
