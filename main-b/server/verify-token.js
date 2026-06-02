import { WebApp } from "meteor/webapp";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

WebApp.connectHandlers.use("/api/verify-token", async (req, res) => {
  // CORS check & headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405);
    res.end("Method Not Allowed");
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const { token } = JSON.parse(body || "{}");
      if (!token) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ isValid: false, reason: "Token is required" }));
        return;
      }

      // Hash the token because Meteor stores hashed login tokens in the DB
      const hashedToken = Accounts._hashLoginToken(token);
      
      const user = await Meteor.users.findOneAsync({
        "services.resume.loginTokens.hashedToken": hashedToken,
      });

      if (user) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            isValid: true,
            userId: user._id,
            username: user.username,
          })
        );
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            isValid: false,
            reason: "Invalid token",
          })
        );
      }
    } catch (e) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ isValid: false, reason: e.message }));
    }
  });
});
