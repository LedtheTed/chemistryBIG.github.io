import {
  visualizeCompound
} from "./pubChemCode.js";

window.visualizeCompound = visualizeCompound;

// Button event
document.addEventListener("DOMContentLoaded", () => {

  const button = document.getElementById("searchBtn");

  button.addEventListener("click", () => {
    const name = document.getElementById("compoundInput").value;
    visualizeCompound(name);
  });

});