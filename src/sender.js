export async function getAccessToken() {
    const requestOptions = {
      method: "POST",
      redirect: "follow",
    };
  
    try {
      const response = await fetch("https://us-central1-listener-token.cloudfunctions.net/getTokenOutlook", requestOptions);
  
      if (!response.ok) throw new Error("Error al obtener el token");
  
      const result = await response.text();
      
      return JSON.parse(result);
    // const result = {
    //     access_token: 'aca viaja el token'
    // }
    // return result
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
    const raw = JSON.stringify(obj);
  console.log(raw)
    const requestOptions = {
      method: "POST",
      headers: myHeader,
      body: raw,
      redirect: "follow",
    };
  
    try {
        console.log(requestOptions.headers);
        console.log(requestOptions.body);
      const response = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", requestOptions);
      const result = await response.text();
      console.log("respuesta envio", result);
      // alert("Correo enviado exitosamente.");
    } catch (error) {
      console.log("Error al enviar el correo:", error);
    }
  }

  // export async function obtenerContactos(tkn) {
  //   const myHeader = new Headers();
  //   myHeader.append("Content-Type", "application/json");
  //   myHeader.append("Prefer", "outlook.allow-unsafe-html");
  //   myHeader.append("Authorization", "Bearer " + `${tkn}`);
    
  
  //   const requestOptions = {
  //     method: "GET",
  //     headers: myHeader,
  //     redirect: "follow",
  //   };
  
  //   try {
     
  //     const response = await fetch("https://graph.microsoft.com/v1.0/me/people", requestOptions);
  //     console.log(response)
  //     const result = await response.text();
  //     console.log("respuesta get contactos", result);
  //     alert("contactos obtenidos.");
  //   } catch (error) {
  //     console.log("Error EN GET CONTACTOS:", error);
  //   }
  // }
  