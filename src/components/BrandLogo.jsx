import React from "react";
import frame40 from "../assets/frame-40.svg";
import monogram40 from "../assets/monogram-40.svg";
import frame64 from "../assets/frame-64.svg";
import monogram64 from "../assets/monogram-64.svg";

/**
 * Logo oficial de Distrinando S.A. con la superposición exacta de Figma.
 */
export default function BrandLogo({ size = 40, className = "" }) {
  const useLarge = size > 48;
  const frameSrc = useLarge ? frame64 : frame40;
  const monogramSrc = useLarge ? monogram64 : monogram40;

  return (
    <div
      className={`relative shrink-0 overflow-clip rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        alt="Logo Distrinando"
        src={frameSrc}
        className="absolute block inset-0 max-w-none size-full"
      />
      <div className="absolute inset-[16.67%_35%_20.42%_25.42%]">
        <div className="absolute inset-[-6.95%_-11.05%]">
          <img alt="" src={monogramSrc} className="block max-w-none size-full" />
        </div>
      </div>
    </div>
  );
}
