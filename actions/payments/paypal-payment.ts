"use server";

export const paypalCheckPayment = async (
  paypaltransactionId: string | undefined,
) => {
  const authToken = await getPaylPalBearerToken();

  if (!authToken) {
    return {
      ok: false,
      messahe: "No se pudo obtener el token",
    };
  }
};

const getPaylPalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SCRETE;
  const OAUTH2URL = process.env.PAYPAL_OAUTH_URL;

  const base64 = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    "utf-8",
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  try {
    const result = await fetch(`${OAUTH2URL}`, requestOptions as any).then(
      (res) => res.json(),
    );

    return result.access_token;
  } catch (error) {
    return null;
  }
};
