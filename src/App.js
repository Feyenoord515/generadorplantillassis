import React, { useState, useRef, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NotificationTemplate from "./NotificationTemplate";
import TemplateCarousel from "./TemplateCarousel";
import { getAccessToken, sendEmail } from "./sender";
import { TailSpin } from "react-loader-spinner";

import Header from "./Header";
import Footer from "./Footer";

const App = ({ onLogout, currentUser }) => {
  // Estado para manejar los datos editables
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [severity, setSeverity] = useState("high");
  const [title, setTitle] = useState("Mantenimiento Urgente!");
  const [showPersistentIssueSection, setShowPersistentIssueSection] =
    useState(true);
  const [reason, setReason] = useState(
    "Debido a un mantenimiento urgente en SAP (espacio de almacenamiento lleno), se ha decidido apagar temporalmente uno de los servidores."
  );
  const [impact, setImpact] = useState(
    "Algunos usuarios podrían experimentar desconexiones y problemas de acceso."
  );
  const [instructions, setInstructions] = useState([
    "Abrir 'Conexión a Escritorio Remoto' desde el menú de inicio de Windows.",
    "Conectar usando 10.0.0.76 o 10.0.0.3, los servidores restantes.",
  ]);

  // Estado para manejar la visibilidad del formulario de edición
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [customSections, setCustomSections] = useState([
    { title: "", content: "" },
  ]);
  const [isSendFormVisible, setIsSendFormVisible] = useState(false);
  const [recipients, setRecipients] = useState([]); // Nuevo estado para destinatarios
  const [emailSubject, setEmailSubject] = useState("Comunicado desde Sistemas");
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [isLoading, SetIsLoading] = useState(false);
  const [availableAddresses, setAvailableAddresses] = useState([]); // Lista inicial de direcciones disponibles
  const [isAddAddressVisible, setIsAddAddressVisible] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [templates, setTemplates] = useState([]);
  const templatesCollection = `templates-${currentUser}`;
  const templateRef = useRef(null);

  useEffect(() => {
    const fetchRecipients = async () => {
      const querySnapshot = await getDocs(collection(db, "recipients"));
      const addresses = querySnapshot.docs.map((doc) => doc.data().address);

      // Combina las direcciones predeterminadas con las obtenidas de Firebase, evitando duplicados
      const allAddresses = [
        ...new Set([
          ...availableAddresses, // Direcciones predeterminadas
          ...addresses, // Direcciones obtenidas de Firestore
        ]),
      ];

      // Actualiza el estado con las direcciones combinadas
      setAvailableAddresses(allAddresses);
    };

    fetchRecipients();
  }, [availableAddresses]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const querySnapshot = await getDocs(collection(db, templatesCollection));
      const userTemplates = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTemplates(userTemplates);
    };

    fetchTemplates();
  }, [templatesCollection]);
  // console.log(templateRef.current.outerHTML)
  const saveTemplate = async () => {
    const templateData = {
      createdAt: new Date().toISOString(),
      state: {
        // Incluye el estado actual para fácil reutilización
        severity,
        title,
        reason,
        impact,
        instructions,
        customSections,
        showPersistentIssueSection,
      },
    };

    try {
      await addDoc(collection(db, templatesCollection), templateData);
      setTemplates((prevTemplates) => [...prevTemplates, templateData]);
      toast.success("Plantilla guardada con éxito!");
    } catch (e) {
      console.error("Error guardando plantilla: ", e);
      toast.error("Error al guardar la plantilla.");
    }
  };

  const loadTemplate = (template) => {
    const { state } = template;
    setSeverity(state.severity || "low");
    setTitle(state.title || "Nuevo Comunicado");
    setReason(state.reason || "");
    setImpact(state.impact || "");
    setInstructions(state.instructions || []);
    setCustomSections(state.customSections || [{ title: "", content: "" }]);
    setShowPersistentIssueSection(state.showPersistentIssueSection || false);

    toast.success("Plantilla cargada con éxito.");
  };
  const deleteTemplate = async (id) => {
    try {
      await deleteDoc(doc(db, templatesCollection, id));
      setTemplates(templates.filter((template) => template.id !== id));
      toast.success("Plantilla eliminada con éxito.");
    } catch (e) {
      console.error("Error al eliminar plantilla: ", e);
      toast.error("Error al eliminar la plantilla.");
    }
  };

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    setIsLoggedIn(false);
    onLogout(false); // Notifica al componente raíz que el usuario salió
  };

  // Renderizar el Login si no está logueado
  if (!isLoggedIn) {
    console.log("Usuario deslogueado, regresando al login.");
    return null; // Evita renderizar si el usuario no está logueado
  }
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
  const addAddress = async () => {
    if (newAddress.trim() === "") {
      toast.error("La dirección no puede estar vacía.");
      return;
    }

    try {
      await addDoc(collection(db, "recipients"), {
        address: newAddress.trim(),
      });
      setRecipients([...recipients, newAddress.trim()]);
      setNewAddress("");
      toast.success("Dirección agregada con éxito.");
    } catch (e) {
      console.error("Error añadiendo documento: ", e);
    }
  };

  // Eliminar dirección de Firestore
  const removeAddress = async (address) => {
    try {
      // Buscar el documento correspondiente a la dirección en Firestore
      const addressRef = await getDocs(collection(db, "recipients"));
      const addressDoc = addressRef.docs.find(
        (doc) => doc.data().address === address
      );
  
      if (addressDoc) {
        // Eliminar el documento en Firestore
        await deleteDoc(doc(db, "recipients", addressDoc.id));
  
        // Actualizar los estados locales
        setAvailableAddresses((prev) =>
          prev.filter((availableAddress) => availableAddress !== address)
        );
        setRecipients((prev) =>
          prev.filter((recipient) => recipient !== address)
        );
  
        toast.success("Dirección eliminada correctamente.");
      } else {
        toast.error("No se encontró la dirección en la base de datos.");
      }
    } catch (error) {
      console.error("Error al eliminar dirección:", error);
      toast.error("Hubo un problema al eliminar la dirección.");
    }
  };

  const enviarCorreo = async () => {
    try {
      SetIsLoading(true);
      const tokenResponse = await getAccessToken();

      const token = tokenResponse ? tokenResponse.access_token : null;

      if (!token) {
        SetIsLoading(false);
        toast.error("No se pudo obtener el token de autenticación.", {
          theme: "colored",
        });
        return;
      }
      // const contacts = await obtenerContactos(token)
      // console.log(contacts)
      const htmlContent = templateRef.current
        ? templateRef.current.innerHTML
        : "";

      const emailObj = {
        message: {
          subject: emailSubject,
          body: {
            contentType: "HTML",
            content: htmlContent,
          },
          toRecipients: recipients.map((email) => ({
            emailAddress: { address: email },
          })),
        },
      };

      await sendEmail(emailObj, token);
      setIsMessageSent(true);
      SetIsLoading(false);
      toast.success("Correo enviado exitosamente.", { theme: "colored" });
    } catch (error) {
      // console.error("Error al enviar el correo:", error);
      toast.error("Hubo un problema al enviar el correo.", {
        theme: "colored",
      });
    }
  };
  const handleRecipientChange = (event) => {
    const options = event.target.options;
    const selectedRecipients = [];

    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedRecipients.push(options[i].value);
      }
    }

    // Combina el estado actual de recipients con los nuevos seleccionados y elimina duplicados
    setRecipients((prevRecipients) => [
      ...new Set([...prevRecipients, ...selectedRecipients]),
    ]);

    // console.log("Destinatarios acumulados:", recipients);
  };
  const removeRecipient = (recipientToRemove) => {
    setRecipients((prevRecipients) =>
      prevRecipients.filter((recipient) => recipient !== recipientToRemove)
    );
  };
  return (
    <div className="flex flex-col min-h-screen min-w-screen md:w-full md:h-full bg-gradient-to-r from-blue-300 to-gray-500 overflow-x-hidden">
  <div className="w-full border border-blue-700 rounded-lg">
      <Header
        title="Comunicados desde el area de sistemas"
        currentUser={currentUser}
      />

</div>

      <button
        onClick={handleLogout}
        className="fixed top-2 xs:p-0 xs:right-0 xs:top-0 right-5 z-50 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Salir
      </button>
      {/* Botón para mostrar/ocultar el formulario de edición */}
      <button
  onClick={() => setIsFormVisible(!isFormVisible)}
  className={`fixed top-12 z-50 p-1 rounded-md text-white transition ${
    isFormVisible
      ? "right-0 md:right-96 md:px-4 md:py-2 bg-gray-700"
      : "right-0 top-0 md:right-0 md:px-4 md:py-2 bg-blue-600"
  } hover:bg-blue-700 ${
    isSendFormVisible ? "hidden sm:block" : "" /* Ocultar si otro formulario está abierto */
  }`}
>
  {isFormVisible ? ">>>" : "Editar Plantilla"}
</button>

{/* Botón para mostrar/ocultar el formulario de envío */}
<button
  onClick={() => setIsSendFormVisible(!isSendFormVisible)}
  className={`fixed top-12 z-50 p-1 rounded-md text-white transition ${
    isSendFormVisible
      ? "left-0 md:left-96 md:px-4 md:py-2 bg-gray-700"
      : "left-0 top-0 md:left-0 md:px-4 md:py-2 bg-blue-600"
  } hover:bg-blue-700 ${
    isFormVisible ? "hidden sm:block" : "" /* Ocultar si el otro formulario está abierto */
  }`}
>
  {isSendFormVisible ? "<<<" : "Configurar Envio"}
</button>
      {/* Contenedor del formulario, se despliega desde la derecha */}

      <div
        className={`fixed top-0 right-0 border border-blue-700 rounded-lg h-[85vh] w-96 bg-gray-800 text-white p-5 shadow-lg transition-transform overflow-y-auto ${
          isFormVisible
            ? "transform translate-x-0"
            : "transform translate-x-full"
        }`}
        style={{ zIndex: 40 }}
      >
        {/* Formulario de edición */}
        <h3 className="text-xl font-bold mb-4">Editar Plantilla</h3>
        <div className="space-y-4 mt-4">
          <label className="block">
            Nivel de severidad:
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="block w-full mt-2 p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-600"
            >
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
              <option value="announcement">Anuncio</option>
            </select>
          </label>
          <label className="block">
            Título:
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-2 p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-600"
            />
          </label>

          <label className="block">
            Motivo:
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-2 p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-600"
            />
          </label>

          <label className="block">
            Impacto:
            <textarea
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              className="w-full mt-2 p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-600"
            />
          </label>

          <label className="block">
            Instrucciones:
            <textarea
              value={instructions.join("\n")}
              onChange={(e) =>
                setInstructions(
                  e.target.value
                    .split("\n")
                    .filter((inst) => inst.trim() !== "")
                )
              }
              className="w-full mt-2 p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-600"
            />
          </label>

          <h3 className="font-bold mt-6">Secciones Personalizadas</h3>
          {customSections.map((section, index) => (
            <div key={index} className="bg-gray-700 p-2 rounded mb-2">
              <input
                type="text"
                placeholder="Título de la sección"
                value={section.title}
                onChange={(e) =>
                  handleCustomSectionChange(index, "title", e.target.value)
                }
                className="w-full mb-2 p-2 bg-gray-600 rounded border border-gray-500 focus:ring focus:ring-blue-600"
              />
              <textarea
                placeholder="Contenido de la sección"
                value={section.content}
                onChange={(e) =>
                  handleCustomSectionChange(index, "content", e.target.value)
                }
                className="w-full mb-2 p-2 bg-gray-600 rounded border border-gray-500 focus:ring focus:ring-blue-600"
              />
              <button
                onClick={() => removeCustomSection(index)}
                className="w-full py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Eliminar Sección
              </button>
            </div>
          ))}
          <button
            onClick={addCustomSection}
            className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Agregar Sección
          </button>

          <label className="block mt-4">
            <input
              type="checkbox"
              checked={showPersistentIssueSection}
              onChange={(e) => setShowPersistentIssueSection(e.target.checked)}
              className="mr-2"
            />
            Mostrar sección "Si el problema persiste"
          </label>
        </div>
      </div>
      {/* Contenedor del formulario de envio, se despliega desde la izquierda */}
      <div
        className={`fixed top-0 border border-blue-700 rounded-lg left-0 h-[85vh] w-96 bg-gray-800 text-white p-5 shadow-lg transition-transform overflow-y-auto ${
          isSendFormVisible
            ? "transform translate-x-0"
            : "transform -translate-x-full"
        }`}
        style={{ zIndex: 40 }}
      >
        <div className="space-y-6 mt-1">
          <h3 className="text-xl font-bold mb-4">
            Datos de Envío del Comunicado
          </h3>
          <label className="block mb-4">
            Destinatarios:
            <select
              multiple
              onChange={handleRecipientChange}
              className="w-full mt-2 p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-600"
            >
              {availableAddresses.map((address, index) => (
                <option key={index} value={address}>
                  {address}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-4">
            Asunto:
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full mt-2 p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-600"
            />
          </label>
          {/* Mostrar destinatarios seleccionados con opción de eliminar */}
          {recipients.length > 0 && (
            <div>
              <p>Vas a enviar a:</p>
              <ul>
                {recipients.map((recipient, index) => (
                  <li key={index} className="flex items-center">
                    {recipient}
                    <button
                      onClick={() => removeRecipient(recipient)}
                      className="ml-2 text-white bg-red-600 rounded-full p-1 flex justify-center items-center w-5 h-5"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => setIsAddAddressVisible(!isAddAddressVisible)}
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 w-full"
          >
            {isAddAddressVisible
              ? "Ocultar sección dirección de mail"
              : "Agregar/editar dirección de mail:"}
          </button>
          {/* Agregar nueva dirección */}
          {isAddAddressVisible && (
            <div className="mt-4">
              {/* Agregar nueva dirección */}
              <label className="block">
                <div className="flex mt-2">
                  <input
                    type="email"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="example@domain.com"
                    className="flex-grow p-2 rounded bg-gray-700 border border-gray-600 focus:ring focus:ring-blue-600"
                  />
                  <button
                    onClick={addAddress}
                    className="ml-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                  >
                    +
                  </button>
                </div>
              </label>

              {/* Lista de direcciones disponibles */}
              {availableAddresses.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold">Direcciones disponibles:</h4>
                  <ul>
                    {availableAddresses.map((address, index) => (
                      <li key={index} className="flex items-center mt-2">
                        {address}
                        <button
                          onClick={() => removeAddress(address)}
                          className="ml-2 text-white bg-red-600 rounded-full p-1 flex justify-center items-center w-5 h-5"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {isLoading && (
            <TailSpin
              visible={true}
              height="60"
              width="60"
              color="#4fa94d"
              ariaLabel="tail-spin-loading"
            />
          )}
          {isMessageSent && (
            <p className="text-green-500 font-semibold mt-2">
              Mensaje enviado exitosamente.
            </p>
          )}
          {/* Botón para enviar comunicado */}
          <button
            onClick={enviarCorreo}
            className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700 text-white mt-4"
          >
            Enviar Comunicado
          </button>
        </div>
      </div>

      {/* Contenido principal, separado del formulario */}
      <div
        className="flex flex-col items-center justify-center w-full"
        style={{
          paddingLeft: isSendFormVisible ? "20px" : "0",
          paddingRight: isFormVisible ? "20px" : "0",
          transition: "padding 0.3s ease",
        }}
      >
        <div
          ref={templateRef}
          className="px-5 sm:px-8 py-6 max-w-md md:max-w-lg lg:max-w-3xl w-auto border border-transparent mx-0.5 bg-white rounded-lg shadow-lg mt-5 mb-14"
        >
          <NotificationTemplate
            title={title}
            severity={severity}
            reason={reason}
            impact={impact}
            instructions={instructions}
            customSections={customSections}
            showPersistentIssueSection={showPersistentIssueSection}
          />
        </div>
        <button
          onClick={saveTemplate}
          className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-green-700 mr-2"
        >
          Guardar Template
        </button>

        {templates && templates.length > 0 ? (
          <TemplateCarousel
            className="w-full max-w-full overflow-hidden"
            templates={templates}
            onTemplateSelect={loadTemplate}
            onDelete={deleteTemplate}
          />
        ) : (
          <div className="mt-5 text-center text-gray-500">
            Aún no tienes plantillas guardadas.
          </div>
        )}
      </div>
      <div className="w-full border border-blue-700 rounded-lg">
      <Footer text="© 2024 Distrinando sistemas" />
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;

// Referencia para copiar solo la plantilla sin el formulario
// const copiaralclipboard = async () => {
//   if (templateRef.current) {
//     const htmlContent = templateRef.current.innerHTML;
//     console.log(htmlContent);

//     try {
//       const item = new clipboard.ClipboardItem({
//         "text/html": new Blob([htmlContent], { type: "text/html" }),
//       });
//       await clipboard.write([item]);
//       alert(
//         "HTML copiado al portapapeles. Puedes pegarlo en tu cliente de correo."
//       );
//     } catch (err) {
//       console.error("Error al copiar HTML al portapapeles:", err);
//       alert("No se pudo copiar el HTML al portapapeles.");
//     }
//   }
// };

// const copyHtmlToClipboard = async () => {
//   if (templateRef.current) {
//     // Obtén el HTML del componente, pero excluyendo el formulario de edición
//     const htmlContent = templateRef.current.innerHTML;
//     console.log(htmlContent);
//     // Usa la API de Clipboard con MIME tipo `text/html`
//     try {
//       await navigator.clipboard.write([
//         new ClipboardItem({
//           "text/html": new Blob([htmlContent], { type: "text/html" }),
//         }),
//       ]);
//       alert(
//         "HTML copiado al portapapeles. Puedes pegarlo en tu cliente de correo."
//       );
//     } catch (err) {
//       console.error("Error al copiar HTML al portapapeles:", err);
//       alert("No se pudo copiar el HTML al portapapeles.");
//     }
//   }
// };
//   return (
//     <div style={{ display: "flex", padding: "20px" }}>
//       {/* Botón para desplegar u ocultar el formulario de edición */}
//       <button
//         onClick={() => setIsFormVisible(!isFormVisible)}
//         style={{
//           padding: "10px 15px",
//           backgroundColor: "#28a745",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           marginBottom: "20px",
//           cursor: "pointer",
//         }}
//       >
//         {isFormVisible ? "Ocultar Formulario" : "Editar Plantilla"}
//       </button>

//       {/* Formulario de edición de la plantilla */}
//       {isFormVisible && (
//         <div
//           style={{
//             marginBottom: "20px",
//             background: "#f4f4f4",
//             padding: "15px",
//             borderRadius: "8px",
//           }}
//         >
//           <label style={{ display: "block", marginBottom: "10px" }}>
//             Nivel de severidad:
//             <select
//               value={severity}
//               onChange={(e) => setSeverity(e.target.value)}
//               style={{
//                 padding: "8px",
//                 width: "100%",
//                 borderRadius: "5px",
//                 marginTop: "5px",
//               }}
//             >
//               <option value="high">Alta</option>
//               <option value="medium">Media</option>
//               <option value="low">Baja</option>
//               <option value="announcement">Anuncio</option>
//             </select>
//           </label>

//           <label style={{ display: "block", marginBottom: "10px" }}>
//             Titulo:
//             <textarea
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               style={{
//                 width: "100%",
//                 height: "80px",
//                 padding: "8px",
//                 borderRadius: "5px",
//               }}
//             />
//           </label>

//           <label style={{ display: "block", marginBottom: "10px" }}>
//             Motivo:
//             <textarea
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               style={{
//                 width: "100%",
//                 height: "80px",
//                 padding: "8px",
//                 borderRadius: "5px",
//               }}
//             />
//           </label>

//           <label style={{ display: "block", marginBottom: "10px" }}>
//             Impacto:
//             <textarea
//               value={impact}
//               onChange={(e) => setImpact(e.target.value)}
//               style={{
//                 width: "100%",
//                 height: "80px",
//                 padding: "8px",
//                 borderRadius: "5px",
//               }}
//             />
//           </label>

//           <label style={{ display: "block", marginBottom: "10px" }}>
//             Instrucciones:
//             <textarea
//               value={instructions.join("\n")}
//               onChange={(e) => {
//                 const newInstructions = e.target.value
//                   .split("\n")
//                   .filter((instruction) => instruction.trim() !== "");
//                 setInstructions(
//                   newInstructions.length > 0 ? newInstructions : []
//                 );
//               }}
//               style={{
//                 width: "100%",
//                 height: "100px",
//                 padding: "8px",
//                 borderRadius: "5px",
//               }}
//             />
//           </label>

//           <label style={{ display: "block", marginBottom: "10px" }}>
//             <input
//               type="checkbox"
//               checked={showPersistentIssueSection}
//               onChange={(e) => setShowPersistentIssueSection(e.target.checked)}
//             />
//             Mostrar sección "Si el problema persiste"
//           </label>
//           {/* Secciones personalizadas */}
//           <h3>Secciones Personalizadas</h3>
//           {customSections.map((section, index) => (
//             <div key={index} style={{ marginBottom: "10px" }}>
//               <input
//                 type="text"
//                 placeholder="Título de la sección"
//                 value={section.title}
//                 onChange={(e) => handleCustomSectionChange(index, "title", e.target.value)}
//                 style={{ width: "100%", marginBottom: "5px" }}
//               />
//               <textarea
//                 placeholder="Contenido de la sección"
//                 value={section.content}
//                 onChange={(e) => handleCustomSectionChange(index, "content", e.target.value)}
//                 style={{ width: "100%", height: "60px", marginBottom: "5px" }}
//               />
//               <button onClick={() => removeCustomSection(index)}>Eliminar Sección</button>
//             </div>
//           ))}
//           <button onClick={addCustomSection}>Agregar Sección</button>
//         </div>

//       )}

//       {/* Plantilla editable */}
//       <div ref={templateRef}>
//         <NotificationTemplate
//           title={title}
//           severity={severity}
//           reason={reason}
//           impact={impact}
//           instructions={instructions}
//           customSections={customSections}
//           showPersistentIssueSection={showPersistentIssueSection}
//         />
//       </div>
//       {/* Botón para copiar el HTML */}
//       <button onClick={copiaralclipboard}
//        style={{
//         padding: "10px 20px",
//         backgroundColor: "#007bff",
//         marginRight: "6px",
//         color: "white",
//         border: "none",
//         borderRadius: "5px",
//         cursor: "pointer",
//       }}
//       > Copiar HTML(otra api)</button>
//       <button
//         onClick={copyHtmlToClipboard}
//         style={{
//           padding: "10px 20px",
//           backgroundColor: "#007bff",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//       >
//         Copiar HTML al Portapapeles
//       </button>

//     </div>
//   );
// };

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
