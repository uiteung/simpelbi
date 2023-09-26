import { CihuyPostAMI, ShowDataAMI } from "../js/config/configami.js"
import { UrlAMI, token } from "../js/template/template.js";
import {
    CihuyDataAPI,
  } from "https://c-craftjs.github.io/simpelbi/api.js";

// Untuk GET All Data
CihuyDataAPI(UrlAMI, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      // console.log("Data yang diterima:", data);
      ShowDataAMI(data);
    }
  });

// Untuk POST Data
const fakultasApi = "https://simbe-dev.ulbi.ac.id/api/v1/fakultas/";
const prodiApi = "https://simbe-dev.ulbi.ac.id/api/v1/prodi/";
const auditorApi = "https://simbe-dev.ulbi.ac.id/api/v1/auditors/";
const siklusApi = "https://simbe-dev.ulbi.ac.id/api/v1/siklus/";

// Untuk ambil nilai dari FAKULTAS ke dropdown
function fakultasData(data) {
  const selectElement = document.getElementById("fakultas");
  // Kosongkan Isi dropdown saat ini
  selectElement.innerHTML = "";

  // Loop data yang diterima dari API
  data.forEach((item, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index + 1;
    optionElement.textContent = `${item.fakultas} - ${index + 1}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function (){
    const selectedValue = this.value;
    // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
    console.log("Nilai yang dipilih: ", selectedValue);
  });
}

// Untuk ambil nilai dari PRODI ke dropdown
function prodiData(data) {
  const selectElement = document.getElementById("prodi");
  // Kosongkan isi dropdown saat ini
  selectElement.innerHTML = "";

  // Loop data yang diterima dari API
  data.forEach((item, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index + 1;
    optionElement.textContent = `${item.prodi} - ${index + 1}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function (){
    const selectedValue = this.value;
    // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
    console.log("Nilai yang dipilih: ", selectedValue);
  });
}

// Untuk ambil nilai dari AUDITOR ke dropdown
function auditorData(data) {
  const selectElement = document.getElementById("auditor");
  // Kosongkan isi dropdown saat ini
  selectElement.innerHTML = "";

  // Loop data yang diterima dari API
  data.forEach((item, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index + 1;
    optionElement.textContent = `${item.auditor} - ${index + 1}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function (){
    const selectedValue = this.value;
    // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
    console.log("Nilai yang dipilih: ", selectedValue);
  });
}

// Untuk ambil nilai dari SIKLUS ke dropdown
function siklusData(data) {
  const selectElement = document.getElementById("siklus");
  // Kosongkan isi dropdown saat ini
  selectElement.innerHTML = "";

  // Loop data yang diterima dari API
  data.forEach((item, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index + 1;
    optionElement.textContent = `${item.siklus} - ${index + 1}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function (){
    const selectedValue = this.value;
    // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
    console.log("Nilai yang dipilih: ", selectedValue);
  });
}