export async function getAccessToken() {
    const requestOptions = {
      method: "POST",
      redirect: "follow",
    };
  
    try {
      const response = await fetch(process.env.REACT_APP_ENDPOINTTOKEN, requestOptions);
  
      if (!response.ok) throw new Error("Error al obtener el token");
  
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
    const raw = JSON.stringify(obj);
 
    const requestOptions = {
      method: "POST",
      headers: myHeader,
      body: raw,
      redirect: "follow",
    };
  
    try {
        
      const response = await fetch(process.env.REACT_APP_ENDPOINTSENDER, requestOptions);
      const result = await response.text();
      console.log("respuesta envio",result);
     
    } catch (error) {
      console.log("Error al enviar el correo:", error);
    }
  }

  
  