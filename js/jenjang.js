import { ShowdataJenjang } from "../js/config/configjenjang.js";
import { UrlGetJenjang, UrlPostJenjang, token } from "../js/template/template.js";
import { CihuyPostKTS } from "./config/configkts.js";
import {
    CihuyDataAPI,
  } from "https://c-craftjs.github.io/simpelbi/api.js";

  CihuyDataAPI(UrlGetJenjang, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);
      ShowdataJenjang(data);
    }
  });

const Tombol = document.getElementById("insbutton");

Tombol.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("Button Clicked");

  const jenjangval = document.getElementById("jenjang").value;
  
  var raw = JSON.stringify({
    "jenjang": jenjangval
  });

  // Mengirim permintaan POST menggunakan fungsi CihuyPostApi
  CihuyPostKTS(UrlPostJenjang, token, raw)
  .then((responseText) => {
    console.log("Response:", responseText);
    window.alert("Data berhasil ditambahkan!");
    window.location.replace("https://euis.ulbi.ac.id/simpelbi/settings/data_jenjang.html")
  })
  .catch((error) => {
    console.error("Error:", error);
    // Tangani kesalahan jika terjadi
  });

});