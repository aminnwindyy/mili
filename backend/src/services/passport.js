const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/helpers');

const issueTokensAndAttach = async (user, done) => {
  try {
    const jwt = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    return done(null, { user, auth: { jwt, refreshToken } });
  } catch (err) {
    return done(err);
  }
};

const hasGoogleOauth = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
if (hasGoogleOauth) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.OAUTH_CALLBACK_BASE_URL || 'http://localhost:5000'}/api/auth/oauth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value.toLowerCase() : undefined;
      const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : undefined;

      let user = await User.findOne({ $or: [
        { email },
        { 'oauth.provider': 'google', 'oauth.provider_id': profile.id }
      ] });

      if (!user) {
        user = await User.create({
          full_name: profile.displayName || 'Google User',
          email: email || `google_${profile.id}@example.com`,
          is_verified: true,
          oauth: { provider: 'google', provider_id: profile.id, avatar_url: avatar },
          profile_completed: true
        });
      } else {
        // ensure oauth fields are saved
        user.oauth = { provider: 'google', provider_id: profile.id, avatar_url: avatar };
        await user.save();
      }

      return issueTokensAndAttach(user, done);
    } catch (err) {
      return done(err);
    }
  }));
}

const hasGithubOauth = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
if (hasGithubOauth) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.OAUTH_CALLBACK_BASE_URL || 'http://localhost:5000'}/api/auth/oauth/github/callback`,
    scope: ['user:email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const primaryEmail = (profile.emails && profile.emails.find(e => e.primary)) || (profile.emails && profile.emails[0]);
      const email = primaryEmail ? primaryEmail.value.toLowerCase() : undefined;
      const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : undefined;

      let user = await User.findOne({ $or: [
        { email },
        { 'oauth.provider': 'github', 'oauth.provider_id': profile.id }
      ] });

      if (!user) {
        user = await User.create({
          full_name: profile.displayName || profile.username || 'GitHub User',
          email: email || `github_${profile.id}@example.com`,
          is_verified: true,
          oauth: { provider: 'github', provider_id: profile.id, avatar_url: avatar },
          profile_completed: true
        });
      } else {
        user.oauth = { provider: 'github', provider_id: profile.id, avatar_url: avatar };
        await user.save();
      }

      return issueTokensAndAttach(user, done);
    } catch (err) {
      return done(err);
    }
  }));
}

// Custom callback to expose tokens on req.auth
passport.serializeUser((data, done) => done(null, data));
module.exports = passport;



