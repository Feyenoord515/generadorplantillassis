
import React, { useRef } from "react";
import NotificationTemplate from "./NotificationTemplate";
import html2canvas from "html2canvas";

const App = () => {
    const templateRef = useRef(null);
    console.log(templateRef)
    
    const copyHtmlToClipboard = () => {
        if (templateRef.current) {
            html2canvas(templateRef.current, { logging: false, useCORS: true }).then((canvas) => {
                canvas.toBlob((blob) => {
                    // Usamos el API de Clipboard para copiar la imagen al portapapeles
                    navigator.clipboard.write([
                        new ClipboardItem({
                            "image/png": blob
                        })
                    ]).then(() => {
                        alert("La imagen ha sido copiada al portapapeles.");
                    }).catch((err) => {
                        console.error("Error al copiar al portapapeles", err);
                    });
                });
            });
        }
    };

    return (

        <div>
      {/* Ejemplo de Mantenimiento Urgente */}
      <NotificationTemplate
      ref={templateRef}
        severity="high"
        reason="Debido a un mantenimiento urgente en SAP (espacio de almacenamiento lleno), se ha decidido apagar temporalmente uno de los servidores."
        impact="Algunos usuarios podrían experimentar desconexiones y problemas de acceso."
        instructions={[
          "Abrir 'Conexión a Escritorio Remoto' desde el menú de inicio de Windows.",
          "Conectar usando 10.0.0.76 o 10.0.0.3, los servidores restantes."
        ]}
      />

      {/* Ejemplo de Mantenimiento Moderado */}
      {/* <NotificationTemplate
        severity="medium"
        reason="Se realizará un mantenimiento programado de la base de datos el próximo lunes."
        impact="El sistema puede experimentar lentitud y es posible que algunos servicios estén temporalmente inaccesibles."
      /> */}

      {/* Ejemplo de Mantenimiento Informativo */}
      {/* <NotificationTemplate
        severity="low"
        reason="Actualización menor de seguridad en los servidores de correo electrónico."
        impact="No se espera impacto en el servicio. La actualización se completará en segundo plano."
      /> */}

       {/* Botón para copiar el HTML */}
       <button
                onClick={copyHtmlToClipboard}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px'
                }}
            >
                Copiar HTML al Portapapeles
            </button>
    </div>
    
    );
};

export default App;

 
