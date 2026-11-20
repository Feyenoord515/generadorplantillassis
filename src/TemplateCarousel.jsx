import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NotificationTemplate from "./NotificationTemplate";
import './index.css';

const TemplateCarousel = ({ templates, onTemplateSelect, onDelete }) => {
  // Determinamos cuántos slides mostrar según el número de plantillas
  const slidesToShow = templates.length < 3 ? templates.length : 4;
  
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow, // Usa slidesToShow calculado dinámicamente
    slidesToScroll: 1, // Siempre desplazarse de uno en uno
    initialSlide: 0,
    arrows: true, // Agrega flechas de navegación
    appendArrows: ".slick-slider", // Esto le dice a Slick dónde poner las flechas
    responsive: [
      {
        breakpoint: 1536, // Pantallas medianas (tabletas)
        settings: {
          slidesToShow: 2, // Ajuste dinámico para tablets
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024, // Pantallas medianas (tabletas)
        settings: {
          slidesToShow: 2, // Ajuste dinámico para tablets
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 960, 
        settings: {
          slidesToShow: 2, // Mostrar solo una plantilla en móviles
          slidesToScroll: 1,
          
        },
      },
      {
        breakpoint: 768, // Pantallas pequeñas (móviles en paisaje)
        settings: {
          slidesToShow: 2, // Mostrar solo una plantilla en móviles
          slidesToScroll: 1,
          
        },
      },
      {
        breakpoint: 480, // Pantallas muy pequeñas (móviles)
        settings: {
          slidesToShow: 1, // Siempre mostrar solo una plantilla
          slidesToScroll: 1,
         
        },
      },
    ],
  };

  return (
    <div className="mt-5 w-full h-auto max-w-screen-2xl px-14 xs:p-0 sm:px-0 md:px-8 lg:px-10  mb-1 ">
      <h3 className="text-center mb-4 text-lg font-semibold text-gray-800">
        Plantillas Guardadas
      </h3>
      <div className="h-full">
      {templates.length > 0 ? (
        <Slider {...settings} className="overflow-x-visible h-full sm:w-auto mb-8 ">
          {templates.map((template) => (
           <div key={template.id}  className="h-full">
            
              <div
  className="   shadow-lg  p-1 xs:h-auto sm:h-auto md:h-auto lg:h-auto xl:h-auto 2xl:h-auto mb-8 flex flex-col justify-between cursor-pointer"
  onClick={() => onTemplateSelect(template)}
>
                {/* Renderiza una versión compacta de NotificationTemplate */}
                <NotificationTemplate
                severity={template.state.severity}
                title={template.state.title.slice(0, 30)}
                reason={template.state.reason.slice(0, 60)}
                impact={template.state.impact.slice(0, 60)}
                instructions={template.state.instructions.slice(0, 2).map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))} // Asignar clave única para las instrucciones
                customSections={template.state.customSections} // Asignar clave única para customSections
                showPersistentIssueSection={false}
              />
              {/* Botón para eliminar la plantilla */}
              <button
                onClick={() => onDelete(template.id)}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                Eliminar Plantilla
              </button>
                  </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="text-center text-gray-500 mt-4">
          Aún no tienes plantillas guardadas.
        </div>
      )}
      </div>
    </div>
  );
};

export default TemplateCarousel;



