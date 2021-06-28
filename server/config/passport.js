const fs = require("fs");
const path = require("path");
const User = require("mongoose").model("User");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const AppleStrategy = require("passport-apple");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const utils = require("../lib/utils");

const registerSocial = (socialUser, cb) => {
  return Promise.resolve()
    .then(() => {
      // add accessToken and check agiainst it? yes!
      // but this changes from time to time so we cannot
      //
      return User.findOne({ email: socialUser.email });
    })
    .then((user) => {
      if (!user) {
        const newUser = new User(socialUser);
        return newUser.save();
      } else {
        return user;
      }
    })
    .then((user) => {
      return cb(null, user);
    });
};
const callbackURL = (provider) => {
  return `http://localhost:3003/users/social/${provider}/request`;
};

const keys = {
  GOOGLE: {
    clientID:
      "701401166500-dqgpnoli336lnu5u5jv4vqvs9hiav1pk.apps.googleusercontent.com",
    clientSecret: "ax5InQH4VdCqUr4A5xrw3x2d",
  },
  FACEBOOK: {
    clientID: "659724655424382",
    clientSecret: "3a5ba858f94108aac38ab7a516d71727",
  },
};

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const facebook = new FacebookStrategy(
  {
    clientID: keys.FACEBOOK.clientID,
    clientSecret: keys.FACEBOOK.clientSecret,
    callbackURL: callbackURL("facebook"),
    profileFields: [
      "id",
      "displayName",
      "email",
      "first_name",
      "last_name",
      "picture",
    ],
  },
  (accessToken, refreshToken, profile, cb) => {
    const p = profile._json;
    const picture =
      p.picture && p.picture.data && p.picture.data.url
        ? p.picture.data.url
        : "";
    const user = {
      provider: profile.provider,
      providerId: p.id,
      picture,
      firstName: p.first_name,
      lastName: p.last_name,
      name: p.name,
      email: p.email,
      short: p.first_name.charAt(0) + p.last_name.charAt(0),
    };
    registerSocial(user, cb);
  }
);

const apple = new AppleStrategy(
  {
    clientID: "app.listle.app",
    teamID: "445TV6E7HN",
    callbackURL: callbackURL("apple"),
    keyID: "JWV8V7W88D",
    privateKeyLocation: fs.readFileSync(
      path.join(__dirname, "", "AuthKey_JWV8V7W88D.p8")
    ),
    passReqToCallback: true,
  },
  function (req, accessToken, refreshToken, idToken, profile, cb) {
    console.log(21123123);
    console.log("------");
    console.log(jwt.decode(idToken));
    console.log("------");
    console.log(profile);
    console.log("------");

    // The idToken returned is encoded. You can use the jsonwebtoken library via jwt.decode(idToken)
    // to access the properties of the decoded idToken properties which contains the user's
    // identity information.
    // Here, check if the idToken.sub exists in your database!
    // idToken should contains email too if user authorized it but will not contain the name
    // `profile` parameter is REQUIRED for the sake of passport implementation
    // it should be profile in the future but apple hasn't implemented passing data
    // in access token yet https://developer.apple.com/documentation/sign_in_with_apple/tokenresponse
    cb(null, idToken);
  }
);

const google = new GoogleStrategy(
  {
    clientID: keys.GOOGLE.clientID,
    clientSecret: keys.GOOGLE.clientSecret,
    callbackURL: callbackURL("google"),
  },
  (accessToken, refreshToken, profile, cb) => {
    const p = profile._json;
    const user = {
      provider: profile.provider,
      providerId: p.sub,
      picture: p.picture,
      firstName: p.given_name,
      lastName: p.family_name,
      name: p.name,
      email: p.email,
      short: p.given_name.charAt(0) + p.family_name.charAt(0),
      locale: p.locale,
    };
    registerSocial(user, cb);
  }
);

const strategy = new JwtStrategy(options, (payload, done) => {
  User.findOne({ _id: payload.sub })
    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err, null));
});
module.exports = (passport) => {
  passport.use(strategy);
  passport.use(google);
  passport.use(facebook);
  passport.use(apple);
};
