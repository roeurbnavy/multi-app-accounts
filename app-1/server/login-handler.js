import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

Accounts.registerLoginHandler("multiHostLogin", async function(options) {
  if (!options.multiHostLogin) return undefined;

  const { token, origin } = options.multiHostLogin;

  // Resolve Docker internal hostname for token verification in container environment
  let hostUrl = origin;
  const isDocker = process.env.MONGO_URL && process.env.MONGO_URL.includes("mongodb:27017");
  if (isDocker) {
    if (origin.includes("localhost:3000") || origin.includes("127.0.0.1:3000")) {
      hostUrl = "http://main-a-host:3000";
    } else if (origin.includes("localhost:3001") || origin.includes("127.0.0.1:3001")) {
      hostUrl = "http://main-b-host:3000";
    }
  }

  console.log(`[app-1 Server] Verifying token against host: ${hostUrl}`);

  try {
    const response = await fetch(`${hostUrl}/api/verify-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      console.error(`[app-1 Server] Verification failed with status ${response.status}`);
      return { error: new Meteor.Error("unauthorized", "Token verification failed") };
    }

    const data = await response.json();
    if (!data.isValid) {
      console.warn(`[app-1 Server] Token is invalid: ${data.reason}`);
      return { error: new Meteor.Error("unauthorized", "Token is invalid") };
    }

    console.log(`[app-1 Server] Token verified successfully for: ${data.username}`);

    // Prefix/namespace external user ID inside app-1 DB to avoid collisions
    const externalUserId = `${origin}_${data.userId}`;
    let user = await Meteor.users.findOneAsync({ "services.multiHost.id": externalUserId });

    if (!user) {
      // Create user locally in app-1's DB
      const cleanUsername = `${data.username}-${origin.replace(/https?:\/\/|:|\./g, "")}`;
      const newUserId = await Accounts.createUserAsync({
        username: cleanUsername,
      });

      await Meteor.users.updateAsync(newUserId, {
        $set: {
          "services.multiHost": {
            id: externalUserId,
            origin: origin,
            originalUserId: data.userId,
          },
        },
      });

      user = await Meteor.users.findOneAsync(newUserId);
    }

    return { userId: user._id };
  } catch (err) {
    console.error("[app-1 Server] Error validating multi-host token:", err);
    return { error: new Meteor.Error("login-failed", "Could not verify login with host server") };
  }
});
