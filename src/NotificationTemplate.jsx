import React from "react";

const NotificationTemplate = React.forwardRef(
  (
    {
      severity = "low",
      title,
      reason,
      impact,
      instructions,
      customSections,
      contactUrl = "https://soporte.distrinando.com.ar",
      showPersistentIssueSection,
    },
    ref
  ) => {
    const severityOptions = {
      high: {
        color: "#d32f2f",
        backgroundColor: "#f8d7da",
        title: "Mantenimiento Urgente",
        icon: "⚠️",
      },
      medium: {
        color: "#ed6c02",
        backgroundColor: "#fff3cd",
        title: "Mantenimiento Moderado",
        icon: "ℹ️",
      },
      low: {
        color: "#2e7d32",
        backgroundColor: "#d4edda",
        title: "Mantenimiento Informativo",
        icon: "✅",
      },
      announcement: {
        color: "#0277bd",
        backgroundColor: "#e3f2fd",
        title: "Anuncio",
        icon: "📢",
      },
    };

    const {
      color,
      backgroundColor,
      title: defaultTitle,
      icon,
    } = severityOptions[severity];

    const img64 =
      "data:image/png;base64,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";

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9f9f9", // Fondo para toda la página
          borderRadius: "8px",
        }}
      >
        {/* Contenedor Principal */}
        <div
          ref={ref}
          style={{
            maxWidth: "600px", // Ancho máximo del contenedor
            width: "100%", // Asegura que el contenido se ajuste en pantallas pequeñas
            backgroundColor: "white", // Fondo blanco para el mensaje
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", // Sombra ligera para mejor visualización
            color: "#333",
            lineHeight: "1.5",
          }}
        >
          {/* Logo de la Empresa "/Distrinando3.png" */}
          <div
            style={{ textAlign: "left", marginBottom: "16px", width: "100%" }}
          >
            <img
              src={img64}
              alt="Logo de la Empresa"
              style={{
                width: "100%", // Fuerza el tamaño de la imagen
                maxWidth: "250px", // Evita que la imagen se expanda más allá de su contenedor
                height: "auto", // Mantiene la proporción de la imagen
                display: "block", // Asegura que no quede espacio extra si se coloca en algún cliente de correo
              }}
            />
          </div>

          {/* Encabezado con Nivel de Urgencia */}
          <div
            style={{
              padding: "",

              marginBottom: "16px",
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* <span style={{ fontSize: "24px" }}>{icon}</span> */}
              <h2 style={{ fontSize: "20px", fontWeight: "bold", color }}>
              <span style={{ fontSize: "24px", padding:"5px"}}>{icon}</span>{title || defaultTitle}
              </h2>
            </div>
          </div>

          {/* Cuerpo del Comunicado */}
          <div style={{ marginBottom: "16px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "8px",
                marginTop: "8px",
              }}
            >
              Motivo del Aviso
            </h3>
            <p
              style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}
            >
              {reason || "No se ha proporcionado un motivo específico."}
            </p>
          </div>
          {impact && (
            <div
              style={{
                backgroundColor,
                padding: "10px ",
                borderRadius: "4px ",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color,
                }}
              >
                Impacto Potencial:
              </h3>
              <p style={{ fontSize: "14px", color }}>{impact}</p>
            </div>
          )}

          {/* Instrucciones Alternativas */}
          {instructions && instructions.length > 0 && (
            <>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                Instrucciones:
              </h3>
              <div style={{ margin: "0 0 16px 0" }}>
                {instructions.map((instruction, index) => (
                  <p
                    key={index}
                    style={{
                      color: "#666",
                      fontSize: "14px",
                      marginBottom: "16px",
                    }}
                  >
                    {instruction}
                  </p>
                ))}
              </div>
            </>
          )}

          {/* Renderizado de secciones personalizadas */}
          {customSections.map((section, index) =>
            section.title && section.content ? (
              <div key={index}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  {section.title}
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    marginBottom: "16px",
                  }}
                >
                  {section.content}
                </p>
              </div>
            ) : null
          )}

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #ddd",
              margin: "24px 0",
            }}
          />

          {/* Sección Común para Problemas Persistentes */}
          {showPersistentIssueSection && ( // RENDERIZADO CONDICIONAL
            <div style={{ marginBottom: "16px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                Si el problema persiste
              </h3>
              <p style={{ fontSize: "14px", color: "#666" }}>
                Por favor, contacte al equipo de Sistemas mediante un ticket en{" "}
                <a
                  href={contactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#007bff" }}
                >
                  {contactUrl}
                </a>
              </p>
              <a
                href={contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: "8px",
                }}
              >
                Ir a Soporte
              </a>
            </div>
          )}
          {/* <div style={{ marginBottom: "16px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Si el problema persiste
            </h3>
            <p style={{ fontSize: "14px", color: "#666" }}>
              Por favor, contacte al equipo de Sistemas mediante un ticket en{" "}
              <a
                href={contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007bff" }}
              >
                {contactUrl}
              </a>
              .
            </p>
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "bold",
                textAlign: "center",
                marginTop: "8px",
              }}
            >
              Ir a Soporte
            </a>
          </div> */}
        </div>
      </div>
    );
  }
);

export default NotificationTemplate;

// import React from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Alert,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   Button,
// } from '@mui/material';
// import { WarningAmber, Info, CheckCircle, ContactSupport } from '@mui/icons-material';

// const NotificationTemplate = React.forwardRef(({ severity = "low", title, reason, impact, instructions, contactUrl = "https://soporte.distrinando.com.ar" }, ref) => {
//   // Configuración de colores y textos según la prioridad
//   const severityOptions = {
//     high: { color: 'error', icon: <WarningAmber color="error" fontSize="large" />, title: "Mantenimiento Urgente" },
//     medium: { color: 'warning', icon: <Info color="warning" fontSize="large" />, title: "Mantenimiento Moderado" },
//     low: { color: 'success', icon: <CheckCircle color="success" fontSize="large" />, title: "Mantenimiento Informativo" },
//   };

//   const { color, icon, title: defaultTitle } = severityOptions[severity];

//   return (
//     <Box ref={ref} sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
//       {/* Logo de la Empresa */}
//       <Box
//         component="img"
//         src="/Distrinando.png"
//         alt="Logo de la Empresa"
//         sx={{
//           width: '100%',
//           height: '20vh',
//           objectFit: 'contain',
//           mb: 3,
//           display: 'block',
//         }}
//       />

//       {/* Encabezado con Nivel de Urgencia */}
//       <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: '#f3f4f6' }}>
//         <Box display="flex" alignItems="center" gap={2}>
//           {icon}
//           <Typography variant="h5" fontWeight="bold" color={color}>
//             {title || defaultTitle}
//           </Typography>
//         </Box>
//       </Paper>

//       {/* Cuerpo del Comunicado */}
//       <Box component="section" sx={{ mb: 3 }}>
//         <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Motivo del Aviso</Typography>
//         <Typography variant="body1" color="text.secondary" paragraph>
//           {reason || "No se ha proporcionado un motivo específico."}
//         </Typography>

//         <Alert severity={color} sx={{ mb: 2 }}>
//           <Typography fontWeight="bold">Impacto Potencial:</Typography>
//           <Typography variant="body2">
//             {impact || "No se han especificado los impactos para este comunicado."}
//           </Typography>
//         </Alert>

//         {/* Instrucciones Alternativas */}
//         {instructions && (
//           <>
//             <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Pasos Alternativos</Typography>
//             <List>
//               {instructions.map((instruction, index) => (
//                 <ListItem key={index}>
//                   <ListItemText primary={instruction} />
//                 </ListItem>
//               ))}
//             </List>
//           </>
//         )}
//       </Box>

//       <Divider sx={{ my: 3 }} />

//       {/* Sección Común para Problemas Persistentes */}
//       <Box component="section" sx={{ mb: 3 }}>
//         <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//           Si el problema persiste
//         </Typography>
//         <Typography variant="body2" color="text.secondary" paragraph>
//           Por favor, contacte al equipo de Sistemas mediante un ticket en{" "}
//           <a href={contactUrl} target="_blank" rel="noopener noreferrer">{contactUrl}</a>.
//         </Typography>
//         <Button
//           variant="outlined"
//           color="primary"
//           startIcon={<ContactSupport />}
//           href={contactUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Ir a Soporte
//         </Button>
//       </Box>
//     </Box>
//   );
// });

// export default NotificationTemplate;
