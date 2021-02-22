const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const pathToKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

const pathToPubKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf8");

const jwt = require("jwt-simple");
const secret = "MIICCgKCAgEA8a9w5sGtJuDXegso3LQOZA3YutQivO/dFnz";

/**
 * -------------- HELPER FUNCTIONS ----------------
 */

/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

/**
 *
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 *
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

function getUserId(token) {
  const decoded = jsonwebtoken.verify(token, PUB_KEY);
  const userId = decoded.sub;
  return userId;
}

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
function issueJWT(user) {
  const _id = user._id;
  const expiresIn = "1m"; //1d';
  const payload = {
    sub: _id,
    iat: Date.now(),
  };
  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });
  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

const clientToken = (user) => {
  const token = issueJWT(user);
  return {
    ok: true,
    userdata: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      _id: user._id,
    },
    token: token.token,
    expiresIn: token.expires,
  };
};

function createToken(info, days = 1) {
  let expiry = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);
  info.expiry = expiry;
  return jwt.encode(info, secret);
}

const validateToken = (token) => {
  try {
    return jwt.decode(token, secret);
  } catch (error) {
    return null;
  }
};

function broadcast(req, list, data) {
  const io = req.app.get("io");
  const userId = req.userId;
  let inform = list.users.filter((user) => user.userId != userId);
  data.listId = list._id;
  inform.forEach((user) => {
    io.sockets.emit(user.userId, data);
  });
}

module.exports.clientToken = clientToken;
module.exports.createToken = createToken;
module.exports.validateToken = validateToken;
module.exports.broadcast = broadcast;
module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.getUserId = getUserId;
