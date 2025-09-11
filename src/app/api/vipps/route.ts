// This is a placeholder for the Vipps payment initiation.
// In a real application, you would use the Vipps API to create a payment
// and then redirect the user to the Vipps payment URL.

// You would need to install the vipps-node-sdk or use fetch to make requests to the Vipps API.

// Example using fetch:
export async function POST(req: Request) {
  console.log("Initiating Vipps payment...");

  const { orderId, amount } = await req.json();
  console.log("Request body:", { orderId, amount });

  const vippsApiUrl = "https://api.vipps.no/epayment/v1/payments";

  const clientSecret = process.env.VIPPS_CLIENT_SECRET;
  const subscriptionKey = process.env.VIPPS_SUBSCRIPTION_KEY;
  const merchantSerialNumber = process.env.VIPPS_MERCHANT_SERIAL_NUMBER;
  const clientId = "23b26a2c-66a9-436c-a5c3-aead3187418e";

  console.log("Vipps credentials:", {
    clientId,
    clientSecret: clientSecret ? "Loaded" : "Not loaded",
    subscriptionKey: subscriptionKey ? "Loaded" : "Not loaded",
    merchantSerialNumber: merchantSerialNumber ? "Loaded" : "Not loaded",
  });

  if (!clientSecret || !subscriptionKey || !merchantSerialNumber) {
    console.error("Vipps credentials are not configured.");
    return new Response("Vipps credentials are not configured.", { status: 500 });
  }

  const body = {
    merchantInfo: {
      merchantSerialNumber,
      callbackUrl: "https://rentcars.example.com/api/vipps/callback",
      returnUrl: "https://rentcars.example.com/confirmation",
    },
    customerInfo: {},
    transaction: {
      orderId,
      amount: amount * 100, // Amount in øre
      transactionText: "Car rental from RentCars",
    },
  };

  try {
    console.log("Getting Vipps access token...");
    const accessToken = await getVippsAccessToken(clientId, clientSecret, subscriptionKey);
    console.log("Vipps access token obtained.");

    console.log("Sending payment request to Vipps...");
    const response = await fetch(vippsApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Authorization": `Bearer ${accessToken}`,
        "Idempotency-Key": orderId,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Vipps API response:", data);

    if (response.ok) {
      console.log("Vipps payment initiated successfully.");
      return new Response(JSON.stringify({ redirectUrl: data.url }), { status: 200 });
    } else {
      console.error("Vipps API error:", data);
      return new Response(JSON.stringify(data), { status: response.status });
    }
  } catch (error) {
    console.error("Failed to initiate Vipps payment:", error);
    return new Response("Failed to initiate Vipps payment.", { status: 500 });
  }
}

async function getVippsAccessToken(clientId: string, clientSecret: string, subscriptionKey: string) {
  const tokenUrl = "https://api.vipps.no/accesstoken/get";
  console.log("Requesting Vipps access token from:", tokenUrl);
  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "client_id": clientId,
        "client_secret": clientSecret,
        "Ocp-Apim-Subscription-Key": subscriptionKey,
      },
    });
    const data = await response.json();
    console.log("Vipps access token response:", data);
    if (!response.ok) {
      console.error("Failed to get Vipps access token:", data);
      throw new Error("Failed to get Vipps access token");
    }
    return data.access_token;
  } catch (error) {
    console.error("Error getting Vipps access token:", error);
    throw error;
  }
}
