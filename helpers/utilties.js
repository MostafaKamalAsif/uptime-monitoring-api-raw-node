// ================= MODULE SCAFFOLDING =================
const utilites = {};

// parse json string to object
utilites.parseJSON=(jsonString)=>{
let output;
try{
    output=JSON.parse(jsonString)
}
catch{
    output={}
}
return output
}

module.exports = utilites;

