// This is a placeholder for the Vipps payment initiation.
// In a real application, you would use the Vipps API to create a payment
// and then redirect the user to the Vipps payment URL.

// You would need to install the vipps-node-sdk or use fetch to make requests to the Vipps API.

// Example using fetch:
export async function POST(req: Request) {
  const { orderId, amount } = await req.json();

  const vippsApiUrl = "https://api.vipps.no/epayment/v1/payments";

  // It is recommended to store the client secret and subscription key in environment variables.
  const clientSecret = process.env.VIPPS_CLIENT_SECRET;
  const subscriptionKey = process.env.VIPPS_SUBSCRIPTION_KEY;
  const clientId = "23b26a2c-66a9-436c-a5c3-aead3187418e";

  if (!clientSecret || !subscriptionKey) {
    return new Response("Vipps credentials are not configured.", { status: 500 });
  }

  const body = {
    merchantInfo: {
      merchantSerialNumber: process.env.VIPPS_MERCHANT_SERIAL_NUMBER,
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
    const response = await fetch(vippsApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Authorization": `Bearer ${await getVippsAccessToken(clientId, clientSecret, subscriptionKey)}`,
        "Idempotency-Key": orderId,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      return new Response(JSON.stringify({ redirectUrl: data.url }), { status: 200 });
    } else {
      return new Response(JSON.stringify(data), { status: response.status });
    }
  } catch (error) {
    return new Response("Failed to initiate Vipps payment.", { status: 500 });
  }
}

async function getVippsAccessToken(clientId: string, clientSecret: string, subscriptionKey: string) {
  const tokenUrl = "https://api.vipps.no/accesstoken/get";
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
  return data.access_token;
}
