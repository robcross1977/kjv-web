import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Validate required environment variables
const requiredEnvVars = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required Auth0 environment variables: ${missingVars.join(", ")}`
  );
}

const baseUrl = process.env.APP_BASE_URL || process.env.AUTH0_BASE_URL;
if (!baseUrl) {
  throw new Error(
    "Missing APP_BASE_URL or AUTH0_BASE_URL environment variable"
  );
}

export const auth0 = new Auth0Client({
  domain: requiredEnvVars.domain!,
  clientId: requiredEnvVars.clientId!,
  clientSecret: requiredEnvVars.clientSecret!,
  appBaseUrl: baseUrl,
  secret: requiredEnvVars.secret!,
  authorizationParameters: {
    scope: "openid profile email",
  },
});
