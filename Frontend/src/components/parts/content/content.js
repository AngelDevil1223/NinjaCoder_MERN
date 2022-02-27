import React from "react";
import "./content.css";

const Content = ({ content }) => {
  return (
    <div className="each_content">
        <p className="content_q">{content.question}</p>
        <p className="content_a">{content.answer}</p>
    </div>
  );
};

export default Content;