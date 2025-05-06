import React from "react";
import { Link } from "react-router-dom";

const ProductLogo = ({ size = "text-2xl", clickable = true }) => {
  const content = (
    <span className={`font-bold text-blue-600 ${size}`}>
      MedCard<span className="text-gray-700">+Plus</span>
    </span>
  );

  return clickable ? <Link to="/">{content}</Link> : content;
};

export default ProductLogo;
