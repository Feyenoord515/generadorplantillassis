import React, { useState, useRef } from "react";

import NotificationTemplate from "./NotificationTemplate";

const App = () => {
  // Estado para manejar los datos editables
  const [severity, setSeverity] = useState("high");
  const [title, setTitle] = useState("Mantenimiento Urgente!");
  const [reason, setReason] = useState(
    "Debido a un mantenimiento urgente en SAP (espacio de almacenamiento lleno), se ha decidido apagar temporalmente uno de los servidores."
  );
  const [impact, setImpact] = useState(
    "Algunos usuarios podrían experimentar desconexiones y problemas de acceso."
  );
  const [instructions, setInstructions] = useState([
    // "Abrir 'Conexión a Escritorio Remoto' desde el menú de inicio de Windows.",
    // "Conectar usando 10.0.0.76 o 10.0.0.3, los servidores restantes.",
  ]);

  // Estado para manejar la visibilidad del formulario de edición
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [customSections, setCustomSections] = useState([
    { title: "", content: "" },
  ]);

  const addCustomSection = () =>
    setCustomSections([...customSections, { title: "", content: "" }]);
  const removeCustomSection = (index) => {
    setCustomSections(customSections.filter((_, i) => i !== index));
  };

  const handleCustomSectionChange = (index, field, value) => {
    const updatedSections = customSections.map((section, i) =>
      i === index ? { ...section, [field]: value } : section
    );
    setCustomSections(updatedSections);
  };

  // Referencia para copiar solo la plantilla sin el formulario
  const templateRef = useRef(null);

  const copyHtmlToClipboard = async () => {
    if (templateRef.current) {
      // Obtén el HTML del componente, pero excluyendo el formulario de edición
      const htmlContent = templateRef.current.innerHTML;

      // Usa la API de Clipboard con MIME tipo `text/html`
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([htmlContent], { type: "text/html" }),
          }),
        ]);
        alert(
          "HTML copiado al portapapeles. Puedes pegarlo en tu cliente de correo."
        );
      } catch (err) {
        console.error("Error al copiar HTML al portapapeles:", err);
        alert("No se pudo copiar el HTML al portapapeles.");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Botón para desplegar u ocultar el formulario de edición */}
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        style={{
          padding: "10px 15px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        {isFormVisible ? "Ocultar Formulario" : "Editar Plantilla"}
      </button>

      {/* Formulario de edición de la plantilla */}
      {isFormVisible && (
        <div
          style={{
            marginBottom: "20px",
            background: "#f4f4f4",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <label style={{ display: "block", marginBottom: "10px" }}>
            Nivel de severidad:
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              style={{
                padding: "8px",
                width: "100%",
                borderRadius: "5px",
                marginTop: "5px",
              }}
            >
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
              <option value="announcement">Anuncio</option>
            </select>
          </label>

          <label style={{ display: "block", marginBottom: "10px" }}>
            Titulo:
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                height: "80px",
                padding: "8px",
                borderRadius: "5px",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: "10px" }}>
            Motivo:
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: "100%",
                height: "80px",
                padding: "8px",
                borderRadius: "5px",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: "10px" }}>
            Impacto:
            <textarea
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              style={{
                width: "100%",
                height: "80px",
                padding: "8px",
                borderRadius: "5px",
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: "10px" }}>
            Instrucciones:
            <textarea
              value={instructions.join("\n")}
              onChange={(e) => {
                const newInstructions = e.target.value
                  .split("\n")
                  .filter((instruction) => instruction.trim() !== "");
                setInstructions(
                  newInstructions.length > 0 ? newInstructions : []
                );
              }}
              style={{
                width: "100%",
                height: "100px",
                padding: "8px",
                borderRadius: "5px",
              }}
            />
          </label>
          {/* Secciones personalizadas */}
          <h3>Secciones Personalizadas</h3>
          {customSections.map((section, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Título de la sección"
                value={section.title}
                onChange={(e) => handleCustomSectionChange(index, "title", e.target.value)}
                style={{ width: "100%", marginBottom: "5px" }}
              />
              <textarea
                placeholder="Contenido de la sección"
                value={section.content}
                onChange={(e) => handleCustomSectionChange(index, "content", e.target.value)}
                style={{ width: "100%", height: "60px", marginBottom: "5px" }}
              />
              <button onClick={() => removeCustomSection(index)}>Eliminar Sección</button>
            </div>
          ))}
          <button onClick={addCustomSection}>Agregar Sección</button>
        </div>

        
      )}

      {/* Plantilla editable */}
      <div ref={templateRef}>
        <NotificationTemplate
          title={title}
          severity={severity}
          reason={reason}
          impact={impact}
          instructions={instructions}
          customSections={customSections}
        />
      </div>
      {/* Botón para copiar el HTML */}
      <button
        onClick={copyHtmlToClipboard}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Copiar HTML al Portapapeles
      </button>
    </div>
  );
};

export default App;

// import React, { useRef } from "react";
// import NotificationTemplate from "./NotificationTemplate";

// const App = () => {
//   const templateRef = useRef(null);

//   const copyHtmlToClipboard = async () => {
//     if (templateRef.current) {
//       // Obtén el HTML del componente
//       const htmlContent = templateRef.current.innerHTML;

//       // Usa la API de Clipboard con MIME tipo `text/html`
//       try {
//         await navigator.clipboard.write([
//           new ClipboardItem({
//             "text/html": new Blob([htmlContent], { type: "text/html" }),
//           }),
//         ]);
//         alert("HTML copiado al portapapeles. Puedes pegarlo en tu cliente de correo.");
//       } catch (err) {
//         console.error("Error al copiar HTML al portapapeles:", err);
//         alert("No se pudo copiar el HTML al portapapeles.");
//       }
//     }
//   };

//   return (
//     <div>
//       {/* Ejemplo de Mantenimiento Urgente */}
//       <div ref={templateRef}>
//         <NotificationTemplate
//           severity="high"
//           reason="Debido a un mantenimiento urgente en SAP (espacio de almacenamiento lleno), se ha decidido apagar temporalmente uno de los servidores."
//           impact="Algunos usuarios podrían experimentar desconexiones y problemas de acceso."
//           instructions={[
//             "Abrir 'Conexión a Escritorio Remoto' desde el menú de inicio de Windows.",
//             "Conectar usando 10.0.0.76 o 10.0.0.3, los servidores restantes.",
//           ]}
//         />
//       </div>

//       {/* Botón para copiar el HTML */}
//       <button
//         onClick={copyHtmlToClipboard}
//         style={{
//           marginTop: "20px",
//           padding: "10px 20px",
//           backgroundColor: "#007bff",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//         }}
//       >
//         Copiar HTML al Portapapeles
//       </button>
//     </div>
//   );
// };

// export default App;
