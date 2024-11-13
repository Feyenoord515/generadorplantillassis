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

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9f9f9", // Fondo para toda la página
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
          {/* Logo de la Empresa */}
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <img
              src="/Distrinando3.png"
              alt="Logo de la Empresa"
              style={{
                width: "250px", // Fuerza el tamaño de la imagen
                maxWidth: "250px", // Evita que la imagen se expanda más allá de su contenedor
                height: "auto", // Mantiene la proporción de la imagen
              }}
            />
          </div>

          {/* Encabezado con Nivel de Urgencia */}
          <div
            style={{
              padding: "16px",
              marginBottom: "16px",
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "24px" }}>{icon}</span>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", color }}>
                {title || defaultTitle}
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
                padding: "10px",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            >
              <strong
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color,
                }}
              >
                Impacto Potencial:
              </strong>
              <p style={{ fontSize: "14px", color }}>
                {impact}
              </p>
            </div>
          )}
          {/* <div
            style={{
              backgroundColor,
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          >
            <strong
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "bold",
                color,
              }}
            >
              Impacto Potencial:
            </strong>
            <p style={{ fontSize: "14px", color }}>
              {impact ||
                "No se han especificado los impactos para este comunicado."}
            </p>
          </div> */}

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
              <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>
                Si el problema persiste
              </h3>
              <p style={{ fontSize: "14px", color: "#666" }}>
                Por favor, contacte al equipo de Sistemas mediante un ticket en{" "}
                <a href={contactUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
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
