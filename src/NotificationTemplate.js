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

// const NotificationTemplate = ({ severity = "low", title, reason, impact, instructions, contactUrl = "https://soporte.distrinando.com.ar" }) => {
//   // Configuración de colores y textos según la prioridad
//   const severityOptions = {
//     high: { color: 'error', icon: <WarningAmber color="error" fontSize="large" />, title: "Mantenimiento Urgente" },
//     medium: { color: 'warning', icon: <Info color="warning" fontSize="large" />, title: "Mantenimiento Moderado" },
//     low: { color: 'success', icon: <CheckCircle color="success" fontSize="large" />, title: "Mantenimiento Informativo" },
//   };

//   const { color, icon, title: defaultTitle } = severityOptions[severity];

//   return (
//     <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
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
// };

// export default NotificationTemplate;
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import { WarningAmber, Info, CheckCircle, ContactSupport } from '@mui/icons-material';

const NotificationTemplate = React.forwardRef(({ severity = "low", title, reason, impact, instructions, contactUrl = "https://soporte.distrinando.com.ar" }, ref) => {
  // Configuración de colores y textos según la prioridad
  const severityOptions = {
    high: { color: 'error', icon: <WarningAmber color="error" fontSize="large" />, title: "Mantenimiento Urgente" },
    medium: { color: 'warning', icon: <Info color="warning" fontSize="large" />, title: "Mantenimiento Moderado" },
    low: { color: 'success', icon: <CheckCircle color="success" fontSize="large" />, title: "Mantenimiento Informativo" },
  };

  const { color, icon, title: defaultTitle } = severityOptions[severity];

  return (
    <Box ref={ref} sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Logo de la Empresa */}
      <Box
        component="img"
        src="/Distrinando.png"
        alt="Logo de la Empresa"
        sx={{
          width: '100%',
          height: '20vh',
          objectFit: 'contain',
          mb: 3,
          display: 'block',
        }}
      />

      {/* Encabezado con Nivel de Urgencia */}
      <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: '#f3f4f6' }}>
        <Box display="flex" alignItems="center" gap={2}>
          {icon}
          <Typography variant="h5" fontWeight="bold" color={color}>
            {title || defaultTitle}
          </Typography>
        </Box>
      </Paper>

      {/* Cuerpo del Comunicado */}
      <Box component="section" sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Motivo del Aviso</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {reason || "No se ha proporcionado un motivo específico."}
        </Typography>

        <Alert severity={color} sx={{ mb: 2 }}>
          <Typography fontWeight="bold">Impacto Potencial:</Typography>
          <Typography variant="body2">
            {impact || "No se han especificado los impactos para este comunicado."}
          </Typography>
        </Alert>

        {/* Instrucciones Alternativas */}
        {instructions && (
          <>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Pasos Alternativos</Typography>
            <List>
              {instructions.map((instruction, index) => (
                <ListItem key={index}>
                  <ListItemText primary={instruction} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Sección Común para Problemas Persistentes */}
      <Box component="section" sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Si el problema persiste
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Por favor, contacte al equipo de Sistemas mediante un ticket en{" "}
          <a href={contactUrl} target="_blank" rel="noopener noreferrer">{contactUrl}</a>.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ContactSupport />}
          href={contactUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ir a Soporte
        </Button>
      </Box>
    </Box>
  );
});

export default NotificationTemplate;
