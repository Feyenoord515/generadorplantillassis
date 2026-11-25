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
import {
  BookmarkPlus,
  Copy,
  Edit3,
  Eye,
  EyeOff,
  FolderOpen,
  Mail,
  Send,
  X,
} from "lucide-react";

import NotificationTemplate from "./NotificationTemplate";
import { getAccessToken, sendEmail } from "./sender";
import Header from "./Header";
import Footer from "./Footer";
import EditorPanel from "./components/EditorPanel";
import SendPanel from "./components/SendPanel";
import TemplatesPanel from "./components/TemplatesPanel";
import ConfirmSendModal from "./components/ConfirmSendModal";

const DEFAULT_TEMPLATE = {
  severity: "high",
  title: "Mantenimiento Urgente!",
  reason:
    "Debido a un mantenimiento urgente en SAP (espacio de almacenamiento lleno), se ha decidido apagar temporalmente uno de los servidores.",
  impact:
    "Algunos usuarios podrían experimentar desconexiones y problemas de acceso.",
  instructions: [
    "Abrir 'Conexión a Escritorio Remoto' desde el menú de inicio de Windows.",
    "Conectar usando 10.0.0.76 o 10.0.0.3, los servidores restantes.",
  ],
  customSections: [{ title: "", content: "" }],
  showPersistentIssueSection: true,
};

const App = ({ onLogout, currentUser, theme = "dark", onToggleTheme }) => {
  const isDark = theme === "dark";

  const [severity, setSeverity] = useState(DEFAULT_TEMPLATE.severity);
  const [title, setTitle] = useState(DEFAULT_TEMPLATE.title);
  const [showPersistentIssueSection, setShowPersistentIssueSection] = useState(
    DEFAULT_TEMPLATE.showPersistentIssueSection
  );
  const [reason, setReason] = useState(DEFAULT_TEMPLATE.reason);
  const [impact, setImpact] = useState(DEFAULT_TEMPLATE.impact);
  const [instructions, setInstructions] = useState(
    DEFAULT_TEMPLATE.instructions
  );
  const [customSections, setCustomSections] = useState(
    DEFAULT_TEMPLATE.customSections
  );

  const [activeTab, setActiveTab] = useState("editor");
  const [recipients, setRecipients] = useState([]);
  const [bccRecipients, setBccRecipients] = useState([]);
  const [emailSubject, setEmailSubject] = useState("Comunicado desde Sistemas");
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [availableAddresses, setAvailableAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [templates, setTemplates] = useState([]);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [pinnedTemplate, setPinnedTemplate] = useState(null);

  const activePreviewTemplate =
    activeTab === "templates" ? hoveredTemplate || pinnedTemplate : null;

  const templatesCollection = `templates-${currentUser}`;
  const templateRef = useRef(null);

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipients"));
        const addresses = querySnapshot.docs.map((d) => d.data().address);
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
        const userTemplates = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setTemplates(userTemplates);
      } catch (error) {
        console.error("Error al obtener plantillas:", error);
        toast.error("No se pudieron cargar las plantillas guardadas.");
      }
    };

    fetchTemplates();
  }, [templatesCollection]);

  const cleanInstructions = instructions.filter((inst) => inst.trim() !== "");

  const resetTemplate = () => {
    setSeverity("announcement");
    setTitle("");
    setReason("");
    setImpact("");
    setInstructions([]);
    setCustomSections([]);
    setShowPersistentIssueSection(true);
    toast.info("Formulario limpio para un nuevo comunicado.");
  };

  const saveTemplate = async () => {
    const templateData = {
      createdAt: new Date().toISOString(),
      state: {
        severity,
        title,
        reason,
        impact,
        instructions: cleanInstructions,
        customSections,
        showPersistentIssueSection,
      },
    };

    try {
      const docRef = await addDoc(
        collection(db, templatesCollection),
        templateData
      );
      setTemplates((prev) => [...prev, { id: docRef.id, ...templateData }]);
      toast.success("Plantilla guardada con éxito.");
    } catch (e) {
      console.error("Error guardando plantilla:", e);
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
    setCustomSections(state.customSections || []);
    setShowPersistentIssueSection(Boolean(state.showPersistentIssueSection));
    setHoveredTemplate(null);
    setPinnedTemplate(null);
    setActiveTab("editor");
    toast.success("Plantilla cargada con éxito.");
  };

  const togglePinPreview = (template) => {
    setPinnedTemplate((prev) =>
      prev?.id === template.id ? null : template
    );
  };

  const deleteTemplate = async (id) => {
    try {
      await deleteDoc(doc(db, templatesCollection, id));
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast.success("Plantilla eliminada con éxito.");
    } catch (e) {
      console.error("Error al eliminar plantilla:", e);
      toast.error("Error al eliminar la plantilla.");
    }
  };

  const addCustomSection = () =>
    setCustomSections((prev) => [...prev, { title: "", content: "" }]);

  const removeCustomSection = (index) => {
    setCustomSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCustomSectionChange = (index, field, value) => {
    setCustomSections((prev) =>
      prev.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    );
  };

  const toggleRecipient = (address, targetField = "to") => {
    const inTo = recipients.includes(address);
    const inBcc = bccRecipients.includes(address);

    if (inTo || inBcc) {
      setRecipients((prev) => prev.filter((item) => item !== address));
      setBccRecipients((prev) => prev.filter((item) => item !== address));
      return;
    }

    if (targetField === "bcc") {
      setBccRecipients((prev) => [...prev, address]);
    } else {
      setRecipients((prev) => [...prev, address]);
    }
  };

  const moveRecipient = (address) => {
    if (recipients.includes(address)) {
      setRecipients((prev) => prev.filter((item) => item !== address));
      setBccRecipients((prev) => [...new Set([...prev, address])]);
    } else if (bccRecipients.includes(address)) {
      setBccRecipients((prev) => prev.filter((item) => item !== address));
      setRecipients((prev) => [...new Set([...prev, address])]);
    }
  };

  const selectAllRecipients = (targetField = "to") => {
    if (targetField === "bcc") {
      setRecipients([]);
      setBccRecipients([...availableAddresses]);
    } else {
      setBccRecipients([]);
      setRecipients([...availableAddresses]);
    }
  };

  const clearRecipients = () => {
    setRecipients([]);
    setBccRecipients([]);
  };

  const removeRecipient = (recipientToRemove) => {
    setRecipients((prev) =>
      prev.filter((recipient) => recipient !== recipientToRemove)
    );
    setBccRecipients((prev) =>
      prev.filter((recipient) => recipient !== recipientToRemove)
    );
  };

  const addAddress = async (targetField = "to") => {
    const trimmed = newAddress.trim();
    if (!trimmed) {
      toast.error("La dirección no puede estar vacía.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Ingresá una dirección de correo válida.");
      return;
    }

    try {
      await addDoc(collection(db, "recipients"), { address: trimmed });
      setAvailableAddresses((prev) => [...new Set([...prev, trimmed])]);
      if (targetField === "bcc") {
        setBccRecipients((prev) => [...new Set([...prev, trimmed])]);
      } else {
        setRecipients((prev) => [...new Set([...prev, trimmed])]);
      }
      setNewAddress("");
      toast.success("Dirección agregada con éxito.");
    } catch (e) {
      console.error("Error añadiendo documento:", e);
      toast.error("No se pudo agregar la dirección.");
    }
  };

  const removeAddress = async (address) => {
    try {
      const addressRef = await getDocs(collection(db, "recipients"));
      const addressDoc = addressRef.docs.find(
        (d) => d.data().address === address
      );

      if (addressDoc) {
        await deleteDoc(doc(db, "recipients", addressDoc.id));
        setAvailableAddresses((prev) =>
          prev.filter((item) => item !== address)
        );
        setRecipients((prev) => prev.filter((item) => item !== address));
        setBccRecipients((prev) => prev.filter((item) => item !== address));
        toast.success("Dirección eliminada correctamente.");
      } else {
        toast.error("No se encontró la dirección en la base de datos.");
      }
    } catch (error) {
      console.error("Error al eliminar dirección:", error);
      toast.error("Hubo un problema al eliminar la dirección.");
    }
  };

  const totalRecipients = recipients.length + bccRecipients.length;

  const requestSendEmail = () => {
    if (totalRecipients === 0) {
      toast.warning("Seleccioná al menos un destinatario.");
      setActiveTab("send");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const enviarCorreo = async () => {
    try {
      setIsLoading(true);
      setIsMessageSent(false);
      const tokenResponse = await getAccessToken();
      const token = tokenResponse ? tokenResponse.access_token : null;

      if (!token) {
        toast.error("No se pudo obtener el token de autenticación.");
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
          ...(recipients.length > 0 && {
            toRecipients: recipients.map((email) => ({
              emailAddress: { address: email },
            })),
          }),
          ...(bccRecipients.length > 0 && {
            bccRecipients: bccRecipients.map((email) => ({
              emailAddress: { address: email },
            })),
          }),
        },
      };

      await sendEmail(emailObj, token);
      setIsMessageSent(true);
      setIsConfirmModalOpen(false);
      toast.success("Correo enviado exitosamente.");
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      toast.error(error?.message || "Hubo un problema al enviar el correo.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyHtmlToClipboard = async () => {
    if (!templateRef.current) return;
    const htmlContent = templateRef.current.innerHTML;

    try {
      if (window.ClipboardItem && navigator.clipboard?.write) {
        const item = new window.ClipboardItem({
          "text/html": new Blob([htmlContent], { type: "text/html" }),
          "text/plain": new Blob([templateRef.current.innerText], {
            type: "text/plain",
          }),
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(htmlContent);
      }
      toast.success("Comunicado copiado al portapapeles.");
    } catch (err) {
      console.error("Error al copiar HTML:", err);
      toast.error("No se pudo copiar al portapapeles.");
    }
  };

  const tabs = [
    { id: "editor", label: "Contenido", icon: Edit3 },
    {
      id: "send",
      label: "Envío",
      icon: Send,
      badge: totalRecipients > 0 ? totalRecipients : null,
    },
    {
      id: "templates",
      label: "Plantillas",
      icon: FolderOpen,
      badge: templates.length > 0 ? templates.length : null,
    },
  ];

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
        onLogout={onLogout}
      />

      <main className="flex-1 max-w-full w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna izquierda: Panel de control con pestañas */}
          <section
            className={`lg:col-span-5 xl:col-span-4 rounded-2xl border shadow-lg overflow-hidden transition-colors ${
              isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            {/* Tabs */}
            <div
              className={`grid grid-cols-3 border-b ${
                isDark
                  ? "border-slate-800 bg-slate-950/50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-1.5 py-3 px-2 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
                      isActive
                        ? "border-[#0879CB] text-[#0879CB]"
                        : isDark
                          ? "border-transparent text-slate-400 hover:text-slate-200"
                          : "border-transparent text-[#536F83] hover:text-[#102F45]"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                    {tab.badge !== null && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? "bg-[#0879CB] text-white"
                            : isDark
                              ? "bg-slate-800 text-slate-300"
                              : "bg-slate-200 text-[#102F45]"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-4 sm:p-5">
              {activeTab === "editor" && (
                <EditorPanel
                  theme={theme}
                  severity={severity}
                  setSeverity={setSeverity}
                  title={title}
                  setTitle={setTitle}
                  reason={reason}
                  setReason={setReason}
                  impact={impact}
                  setImpact={setImpact}
                  instructions={instructions}
                  setInstructions={setInstructions}
                  customSections={customSections}
                  onAddCustomSection={addCustomSection}
                  onRemoveCustomSection={removeCustomSection}
                  onCustomSectionChange={handleCustomSectionChange}
                  showPersistentIssueSection={showPersistentIssueSection}
                  setShowPersistentIssueSection={setShowPersistentIssueSection}
                  onReset={resetTemplate}
                />
              )}

              {activeTab === "send" && (
                <SendPanel
                  theme={theme}
                  emailSubject={emailSubject}
                  setEmailSubject={setEmailSubject}
                  availableAddresses={availableAddresses}
                  recipients={recipients}
                  bccRecipients={bccRecipients}
                  onToggleRecipient={toggleRecipient}
                  onMoveRecipient={moveRecipient}
                  onSelectAllRecipients={selectAllRecipients}
                  onClearRecipients={clearRecipients}
                  onRemoveRecipient={removeRecipient}
                  newAddress={newAddress}
                  setNewAddress={setNewAddress}
                  onAddAddress={addAddress}
                  onDeleteAvailableAddress={removeAddress}
                  isLoading={isLoading}
                  isMessageSent={isMessageSent}
                  onRequestSend={requestSendEmail}
                />
              )}

              {activeTab === "templates" && (
                <TemplatesPanel
                  theme={theme}
                  templates={templates}
                  onSelect={loadTemplate}
                  onDelete={deleteTemplate}
                  onPreview={setHoveredTemplate}
                  pinnedPreviewId={pinnedTemplate?.id || null}
                  onTogglePinPreview={togglePinPreview}
                />
              )}
            </div>
          </section>

          {/* Columna derecha: Barra de acciones + Vista previa en tiempo real */}
          <section className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Barra de acciones */}
            <div
              className={`rounded-2xl border p-3 sm:px-4 flex flex-wrap items-center justify-between gap-2.5 shadow-sm transition-colors ${
                isDark
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  Vista previa del correo
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={copyHtmlToClipboard}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    isDark
                      ? "border-slate-700 bg-slate-950/60 text-slate-200 hover:bg-slate-800"
                      : "border-slate-300 bg-slate-50 text-[#102F45] hover:bg-slate-100"
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copiar HTML
                </button>

                <button
                  type="button"
                  onClick={saveTemplate}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    isDark
                      ? "border-slate-700 bg-slate-950/60 text-slate-200 hover:bg-slate-800"
                      : "border-slate-300 bg-slate-50 text-[#102F45] hover:bg-slate-100"
                  }`}
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-[#0879CB]" />
                  Guardar plantilla
                </button>

                <button
                  type="button"
                  onClick={requestSendEmail}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#0879CB] hover:bg-[#0667AE] text-white transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar ({totalRecipients})
                </button>
              </div>
            </div>

            {/* Simulador de cabecera de cliente de correo + cuerpo HTML */}
            <div
              className={`rounded-2xl border overflow-hidden shadow-xl transition-colors ${
                activePreviewTemplate
                  ? "border-[#0879CB] ring-2 ring-[#0879CB]/30"
                  : isDark
                    ? "border-slate-800"
                    : "border-slate-200"
              }`}
            >
              {activePreviewTemplate && (
                <div className="px-4 sm:px-6 py-2.5 bg-[#0879CB] text-white flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <Eye className="w-4 h-4 shrink-0" />
                    <span className="truncate font-semibold">
                      Vista preliminar: {activePreviewTemplate.state?.title || "Sin título"}
                    </span>
                    <span className="hidden sm:inline opacity-85">
                      (tu borrador actual no se modificó)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => loadTemplate(activePreviewTemplate)}
                      className="px-2.5 py-1 rounded bg-white text-[#0879CB] font-semibold hover:bg-sky-50 transition-colors"
                    >
                      Cargar
                    </button>
                    {pinnedTemplate && (
                      <button
                        type="button"
                        onClick={() => setPinnedTemplate(null)}
                        aria-label="Cerrar vista preliminar"
                        className="p-1 rounded hover:bg-white/20 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div
                className={`px-4 sm:px-6 py-3 border-b text-xs space-y-1 ${
                  isDark
                    ? "bg-slate-900/95 border-slate-800 text-slate-300"
                    : "bg-slate-50 border-slate-200 text-[#536F83]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold w-14 shrink-0">Asunto:</span>
                  <span
                    className={`font-medium truncate ${
                      isDark ? "text-slate-100" : "text-[#102F45]"
                    }`}
                  >
                    {emailSubject || "(Sin asunto)"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold w-14 shrink-0">Para:</span>
                  {recipients.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-[#0879CB] shrink-0" />
                      <span className="truncate">
                        {recipients.slice(0, 3).join(", ")}
                        {recipients.length > 3
                          ? ` y ${recipients.length - 3} más`
                          : ""}
                      </span>
                    </span>
                  ) : bccRecipients.length > 0 ? (
                    <span className="opacity-65 italic">
                      Solo copia oculta
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveTab("send")}
                      className="text-[#0879CB] hover:underline"
                    >
                      Sin destinatarios — Configurar envío
                    </button>
                  )}
                </div>
                {bccRecipients.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold w-14 shrink-0 text-amber-500">
                      CCO:
                    </span>
                    <span className="inline-flex items-center gap-1.5 truncate">
                      <EyeOff className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">
                        {bccRecipients.slice(0, 3).join(", ")}
                        {bccRecipients.length > 3
                          ? ` y ${bccRecipients.length - 3} más`
                          : ""}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-white text-[#333] p-4 sm:p-6 flex justify-center">
                {activePreviewTemplate && (
                  <div className="w-full max-w-2xl">
                    <NotificationTemplate
                      title={activePreviewTemplate.state?.title || ""}
                      severity={activePreviewTemplate.state?.severity || "low"}
                      reason={activePreviewTemplate.state?.reason || ""}
                      impact={activePreviewTemplate.state?.impact || ""}
                      instructions={(
                        activePreviewTemplate.state?.instructions || []
                      ).filter((inst) => inst.trim() !== "")}
                      customSections={
                        activePreviewTemplate.state?.customSections || []
                      }
                      showPersistentIssueSection={Boolean(
                        activePreviewTemplate.state?.showPersistentIssueSection
                      )}
                    />
                  </div>
                )}
                <div
                  ref={templateRef}
                  className={
                    activePreviewTemplate ? "hidden" : "w-full max-w-2xl"
                  }
                >
                  <NotificationTemplate
                    title={title}
                    severity={severity}
                    reason={reason}
                    impact={impact}
                    instructions={cleanInstructions}
                    customSections={customSections}
                    showPersistentIssueSection={showPersistentIssueSection}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <ConfirmSendModal
        isOpen={isConfirmModalOpen}
        theme={theme}
        emailSubject={emailSubject}
        recipients={recipients}
        bccRecipients={bccRecipients}
        isLoading={isLoading}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={enviarCorreo}
      />

      <Footer
        text={`© ${new Date().getFullYear()} Distrinando S.A. · Sistemas`}
        theme={theme}
      />
      <ToastContainer theme={isDark ? "dark" : "light"} />
    </div>
  );
};

export default App;
