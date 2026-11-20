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
import BrandLogo from "./components/BrandLogo";

import Header from "./Header";
import Footer from "./Footer";

const App = ({ onLogout, currentUser, theme = "dark", onToggleTheme }) => {
  const isDark = theme === "dark";
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
      try {
        const querySnapshot = await getDocs(collection(db, "recipients"));
        const addresses = querySnapshot.docs.map((doc) => doc.data().address);

        setAvailableAddresses((prev) => [...new Set([...prev, ...addresses])]);
      } catch (error) {
        console.error("Error al obtener destinatarios:", error);
        toast.error("No se pudieron cargar los destinatarios.");
      }
    };

    fetchRecipients();
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, templatesCollection)
        );
        const userTemplates = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTemplates(userTemplates);
      } catch (error) {
        console.error("Error al obtener plantillas:", error);
        toast.error("No se pudieron cargar las plantillas guardadas.");
      }
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
      const docRef = await addDoc(
        collection(db, templatesCollection),
        templateData
      );
      setTemplates((prevTemplates) => [
        ...prevTemplates,
        { id: docRef.id, ...templateData },
      ]);
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
    const trimmed = newAddress.trim();
    if (trimmed === "") {
      toast.error("La dirección no puede estar vacía.");
      return;
    }

    try {
      await addDoc(collection(db, "recipients"), {
        address: trimmed,
      });
      setAvailableAddresses((prev) => [...new Set([...prev, trimmed])]);
      setRecipients((prev) => [...new Set([...prev, trimmed])]);
      setNewAddress("");
      toast.success("Dirección agregada con éxito.");
    } catch (e) {
      console.error("Error añadiendo documento: ", e);
      toast.error("No se pudo agregar la dirección.");
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
    if (recipients.length === 0) {
      toast.warning("Seleccioná al menos un destinatario.", {
        theme: "colored",
      });
      return;
    }

    try {
      SetIsLoading(true);
      setIsMessageSent(false);
      const tokenResponse = await getAccessToken();

      const token = tokenResponse ? tokenResponse.access_token : null;

      if (!token) {
        toast.error("No se pudo obtener el token de autenticación.", {
          theme: "colored",
        });
        return;
      }

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
      toast.success("Correo enviado exitosamente.", { theme: "colored" });
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      toast.error(error?.message || "Hubo un problema al enviar el correo.", {
        theme: "colored",
      });
    } finally {
      SetIsLoading(false);
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
  const drawerClass = isDark
    ? "bg-slate-900 border-slate-800 text-slate-100"
    : "bg-white border-slate-200 text-[#102F45]";

  const inputClass = isDark
    ? "bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0879CB]"
    : "bg-slate-50 border-slate-300 text-[#102F45] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0879CB]";

  return (
    <div
      className={`flex flex-col min-h-screen w-full overflow-x-hidden transition-colors ${
        isDark ? "bg-[#0A2338] text-slate-100" : "bg-[#F1F7FB] text-[#102F45]"
      }`}
    >
      <Header
        title="Comunicados desde el área de sistemas"
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onLogout={handleLogout}
      />

      {/* Botón para mostrar/ocultar el formulario de edición */}
      <button
        type="button"
        onClick={() => setIsFormVisible(!isFormVisible)}
        className={`fixed top-20 z-50 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-white shadow-md transition-all ${
          isFormVisible
            ? "right-2 md:right-[24.5rem] bg-slate-700 hover:bg-slate-600"
            : "right-3 bg-[#0879CB] hover:bg-[#0667AE]"
        } ${isSendFormVisible ? "hidden sm:block" : ""}`}
      >
        {isFormVisible ? "Cerrar edición" : "Editar Plantilla"}
      </button>

      {/* Botón para mostrar/ocultar el formulario de envío */}
      <button
        type="button"
        onClick={() => setIsSendFormVisible(!isSendFormVisible)}
        className={`fixed top-20 z-50 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-white shadow-md transition-all ${
          isSendFormVisible
            ? "left-2 md:left-[24.5rem] bg-slate-700 hover:bg-slate-600"
            : "left-3 bg-[#0879CB] hover:bg-[#0667AE]"
        } ${isFormVisible ? "hidden sm:block" : ""}`}
      >
        {isSendFormVisible ? "Cerrar envío" : "Configurar Envío"}
      </button>

      {/* Contenedor del formulario, se despliega desde la derecha */}
      <div
        className={`fixed top-16 right-0 border-l h-[calc(100vh-4rem)] w-full sm:w-96 p-5 shadow-xl transition-transform overflow-y-auto z-40 ${drawerClass} ${
          isFormVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Formulario de edición */}
        <h3 className="text-lg font-bold mb-4">Editar Plantilla</h3>
        <div className="space-y-4 mt-4 text-sm">
          <label className="block">
            <span className="font-medium">Nivel de severidad:</span>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className={`block w-full mt-1.5 p-2 rounded-lg border ${inputClass}`}
            >
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
              <option value="announcement">Anuncio</option>
            </select>
          </label>
          <label className="block">
            <span className="font-medium">Título:</span>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full mt-1.5 p-2 rounded-lg border ${inputClass}`}
            />
          </label>

          <label className="block">
            <span className="font-medium">Motivo:</span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={`w-full mt-1.5 p-2 rounded-lg border ${inputClass}`}
            />
          </label>

          <label className="block">
            <span className="font-medium">Impacto:</span>
            <textarea
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              className={`w-full mt-1.5 p-2 rounded-lg border ${inputClass}`}
            />
          </label>

          <label className="block">
            <span className="font-medium">Instrucciones:</span>
            <textarea
              value={instructions.join("\n")}
              onChange={(e) =>
                setInstructions(
                  e.target.value
                    .split("\n")
                    .filter((inst) => inst.trim() !== "")
                )
              }
              className={`w-full mt-1.5 p-2 rounded-lg border ${inputClass}`}
            />
          </label>

          <h3 className="font-bold pt-2">Secciones Personalizadas</h3>
          {customSections.map((section, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border mb-2 ${
                isDark
                  ? "bg-slate-800/70 border-slate-700"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <input
                type="text"
                placeholder="Título de la sección"
                value={section.title}
                onChange={(e) =>
                  handleCustomSectionChange(index, "title", e.target.value)
                }
                className={`w-full mb-2 p-2 rounded-lg border ${inputClass}`}
              />
              <textarea
                placeholder="Contenido de la sección"
                value={section.content}
                onChange={(e) =>
                  handleCustomSectionChange(index, "content", e.target.value)
                }
                className={`w-full mb-2 p-2 rounded-lg border ${inputClass}`}
              />
              <button
                type="button"
                onClick={() => removeCustomSection(index)}
                className="w-full py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar Sección
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCustomSection}
            className="w-full py-2 bg-[#0879CB] hover:bg-[#0667AE] text-white font-medium rounded-lg transition-colors"
          >
            Agregar Sección
          </button>

          <label className="flex items-center gap-2 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPersistentIssueSection}
              onChange={(e) => setShowPersistentIssueSection(e.target.checked)}
              className="rounded border-slate-400 text-[#0879CB] focus:ring-[#0879CB]"
            />
            <span>Mostrar sección "Si el problema persiste"</span>
          </label>
        </div>
      </div>

      {/* Contenedor del formulario de envío, se despliega desde la izquierda */}
      <div
        className={`fixed top-16 left-0 border-r h-[calc(100vh-4rem)] w-full sm:w-96 p-5 shadow-xl transition-transform overflow-y-auto z-40 ${drawerClass} ${
          isSendFormVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-5 mt-1 text-sm">
          <h3 className="text-lg font-bold">Datos de Envío del Comunicado</h3>
          <label className="block">
            <span className="font-medium">Destinatarios:</span>
            <select
              multiple
              onChange={handleRecipientChange}
              className={`w-full mt-1.5 p-2 rounded-lg border min-h-[120px] ${inputClass}`}
            >
              {availableAddresses.map((address, index) => (
                <option key={index} value={address}>
                  {address}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="font-medium">Asunto:</span>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className={`w-full mt-1.5 p-2 rounded-lg border ${inputClass}`}
            />
          </label>

          {/* Mostrar destinatarios seleccionados con opción de eliminar */}
          {recipients.length > 0 && (
            <div>
              <p className="font-medium mb-1.5">Vas a enviar a:</p>
              <ul className="space-y-1.5">
                {recipients.map((recipient, index) => (
                  <li
                    key={index}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs ${
                      isDark
                        ? "bg-slate-800 border-slate-700"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <span className="truncate">{recipient}</span>
                    <button
                      type="button"
                      onClick={() => removeRecipient(recipient)}
                      className="ml-2 text-white bg-red-600 hover:bg-red-700 rounded-full flex justify-center items-center w-5 h-5 shrink-0"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsAddAddressVisible(!isAddAddressVisible)}
            className={`w-full px-4 py-2 rounded-lg font-medium border transition-colors ${
              isDark
                ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-100"
                : "bg-slate-100 border-slate-300 hover:bg-slate-200 text-[#102F45]"
            }`}
          >
            {isAddAddressVisible
              ? "Ocultar sección dirección de mail"
              : "Agregar/editar dirección de mail"}
          </button>

          {/* Agregar nueva dirección */}
          {isAddAddressVisible && (
            <div className="mt-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="example@domain.com"
                  className={`flex-grow p-2 rounded-lg border ${inputClass}`}
                />
                <button
                  type="button"
                  onClick={addAddress}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Lista de direcciones disponibles */}
              {availableAddresses.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold mb-1.5">Direcciones disponibles:</h4>
                  <ul className="space-y-1.5">
                    {availableAddresses.map((address, index) => (
                      <li
                        key={index}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs ${
                          isDark
                            ? "bg-slate-800 border-slate-700"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <span className="truncate">{address}</span>
                        <button
                          type="button"
                          onClick={() => removeAddress(address)}
                          className="ml-2 text-white bg-red-600 hover:bg-red-700 rounded-full flex justify-center items-center w-5 h-5 shrink-0"
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
            <div className="flex items-center gap-3 py-2">
              <div className="relative flex items-center justify-center w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-[#0879CB]/25 border-t-[#0879CB] animate-spin" />
                <BrandLogo size={36} />
              </div>
              <span className="text-xs font-medium opacity-80">
                Enviando comunicado...
              </span>
            </div>
          )}
          {isMessageSent && (
            <p className="text-emerald-500 font-semibold mt-2">
              Mensaje enviado exitosamente.
            </p>
          )}

          {/* Botón para enviar comunicado */}
          <button
            type="button"
            disabled={isLoading}
            onClick={enviarCorreo}
            className="w-full py-2.5 bg-[#0879CB] hover:bg-[#0667AE] disabled:opacity-60 text-white font-semibold rounded-lg transition-colors"
          >
            Enviar Comunicado
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <main
        className="flex-1 flex flex-col items-center justify-center max-w-full w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10"
        style={{
          paddingLeft: isSendFormVisible ? "20px" : undefined,
          paddingRight: isFormVisible ? "20px" : undefined,
          transition: "padding 0.3s ease",
        }}
      >
        <div
          ref={templateRef}
          className="px-5 sm:px-8 py-6 max-w-md md:max-w-lg lg:max-w-3xl w-full bg-white text-[#333] rounded-xl shadow-lg mt-4 mb-8"
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
          type="button"
          onClick={saveTemplate}
          className="px-5 py-2.5 bg-[#0879CB] hover:bg-[#0667AE] rounded-lg text-white font-medium shadow-sm transition-colors"
        >
          Guardar Template
        </button>

        {templates && templates.length > 0 ? (
          <TemplateCarousel
            className="w-full max-w-full overflow-hidden"
            templates={templates}
            onTemplateSelect={loadTemplate}
            onDelete={deleteTemplate}
            theme={theme}
          />
        ) : (
          <div
            className={`mt-5 text-center text-sm ${
              isDark ? "text-slate-400" : "text-[#536F83]"
            }`}
          >
            Aún no tienes plantillas guardadas.
          </div>
        )}
      </main>

      <Footer
        text={`© ${new Date().getFullYear()} Distrinando S.A. · Sistemas`}
        theme={theme}
      />
      <ToastContainer theme={isDark ? "dark" : "light"} />
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
