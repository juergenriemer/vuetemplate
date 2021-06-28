require("dotenv").config();
const clientUrl = process.env.CLIENT_HOST;
const serverUrl = process.env.SERVER_HOST;
const fs = require("fs");
const path = require("path");
const User = require("mongoose").model("User");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const AppleStrategy = require("@nicokaiser/passport-apple");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const utils = require("../lib/utils");

const registerSocial = (socialUser, cb) => {
	console.log( 123, socialUser );
  return Promise.resolve()
    .then(() => {
      // add accessToken and check agiainst it? yes!
      // but this changes from time to time so we cannot
      //
      return User.findOne({ providerId : socialUser.providerId });
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
  return `${serverUrl}/users/social/${provider}/request`;
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
	  console.log( 123132, profile );
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
	  console.log( user );
    registerSocial(user, cb);
  }
);
const apple = new AppleStrategy(
  {
    clientID: "app.listle.app.web",
    teamID: "445TV6E7HN",
    callbackURL: callbackURL("apple"),
  keyID: "Z7L8567766",
	key: fs.readFileSync(path.join(__dirname, 'AuthKey_Z7L8567766.p8')),
	scope: ['name', 'email']
  },
	(accessToken, refreshToken, profile, done) => {
		const p = profile;
		const firstName = ( p.name && p.name.firstName ) ? p.name.firstName : "Listle";
		const lastName = ( p.name && p.name.lastName ) ? p.name.lastName : "User";
		const email = ( p.email ) ? p.email : "";
	    const user = {
	      provider: "apple",
	      providerId: p.id,
	      firstName,
	      lastName,
	    email,
	      name: `${firstName} ${lastName}`,
	      short: firstName.charAt(0) + lastName.charAt(0),
	    };
		console.log( user );
	    registerSocial(user, done);
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
