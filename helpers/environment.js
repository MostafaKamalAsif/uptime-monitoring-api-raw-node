// ================= MODULE SCAFFOLDING =================
const environment = {};
// create an empty object to store all environment configurations

// ================= STAGING (DEVELOPMENT) CONFIG =================
environment.staging = {
    port: 3000, // app will run on port 3000 in development
    envName: 'staging', // name of the environment
    secretKey:'aksdhfasdfgkasofhsdnglkasl'
};

// ================= PRODUCTION CONFIG =================
environment.production = {
    port: 5000, // app will run on port 5000 in production
    envName: 'production', // name of the environment
    secretKey:'adas9e4fdosw0jsaf'

};

// ================= DETECT CURRENT ENVIRONMENT =================
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string'
        ? process.env.NODE_ENV // if NODE_ENV exists → use it (e.g. "production")
        : 'staging'; // otherwise → default to "staging"

// ================= SELECT CONFIG TO USE =================
const envToExport =
    typeof environment[currentEnvironment] === 'object'
        ? environment[currentEnvironment] // if environment exists → use it
        : environment.staging; // fallback → staging

// ================= EXPORT FINAL CONFIG =================
module.exports = envToExport;
// export only the selected environment (not all)
