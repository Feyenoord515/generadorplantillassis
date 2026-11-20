export async function getAccessToken() {
  const requestOptions = {
    method: "POST",
    redirect: "follow",
  };

  try {
    const response = await fetch(
      process.env.REACT_APP_ENDPOINTTOKEN,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`Error al obtener el token (${response.status})`);
    }

    const result = await response.text();
    return JSON.parse(result);
  } catch (error) {
    console.error("Error al obtener el token de Outlook:", error.message);
    return null;
  }
}

export async function sendEmail(obj, tkn) {
  const myHeader = new Headers();
  myHeader.append("Content-Type", "application/json");
  myHeader.append("Prefer", "outlook.allow-unsafe-html");
  myHeader.append("Authorization", `Bearer ${tkn}`);

  const requestOptions = {
    method: "POST",
    headers: myHeader,
    body: JSON.stringify(obj),
    redirect: "follow",
  };

  const response = await fetch(
    process.env.REACT_APP_ENDPOINTSENDER,
    requestOptions
  );
  const resultText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Error al enviar el correo (${response.status}): ${resultText || response.statusText}`
    );
  }

  return resultText;
}
