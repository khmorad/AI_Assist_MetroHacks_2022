// Critique.js

import { useEffect, useState } from "react";

const Critique = ({ critique }) => {


  return (
    <div className="critique">
      <h3><span>Critique</span></h3>
    <div className="critique-container">
      
      <p>{critique}</p>

    </div>
    </div>
  );
}

export default Critique;
