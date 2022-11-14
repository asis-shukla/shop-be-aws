"use strict";

const generatePolicy = (principalId, resource, effect = "Allow") => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};

const basicAuthorizer = async (event) => {
  console.log("basicAuthorizer Lambda functon:", event);
  if (!event.headers.authorization) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Authorization header not provided" }),
    };
  }
  console.log("event.headers.authorization is", event.headers.authorization);
  const authBasicToken = event.headers.authorization.split(" ")[1];
  const decodedString = Buffer.from(authBasicToken, "base64");
  const [username, password] = decodedString.toString("utf-8").split(":");
  console.log("username and password is", username, password);

  const envStordPassword = process.env[username];
  const effect =
    !envStordPassword || envStordPassword !== password ? "Deny" : "Allow";

  if (effect) {
    const policy = generatePolicy(authBasicToken, event.routeArn, effect);
    console.log("policy is: ", JSON.stringify(policy));

    return policy;
  } else {
    return {
      statusCode: 403,
      body: "Access Denied",
    };
  }
};

export { basicAuthorizer };
