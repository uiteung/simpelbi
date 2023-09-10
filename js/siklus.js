import { tampilData } from "../js/config/configsiklus.js";
import { CihuyPostKTS } from "../js/config/configkts.js"
import { Url, token, urlPostSiklus } from "../js/template/template.js";
import {
    CihuyDataAPI,
  } from "https://c-craftjs.github.io/simpelbi/api.js";
  
CihuyDataAPI(Url, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
    //   console.log("Data yang diterima:", data);
      tampilData(data);
    }
  });

const Tombol = document.getElementById("simpanbutt");

Tombol.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("Button Clicked");

  const thnval = document.getElementById("thn").value;
  
  var raw = JSON.stringify({
    "tahun": thnval
  });

  // Mengirim permintaan POST menggunakan fungsi CihuyPostApi
  CihuyPostKTS(urlPostSiklus, token, raw)
  .then((responseText) => {
    console.log("Response:", responseText);
    window.alert("Data berhasil ditambahkan!");
    window.location.replace("https://euis.ulbi.ac.id/simpelbi/ami/siklus.html")
  })
  .catch((error) => {
    console.error("Error:", error);
    // Tangani kesalahan jika terjadi
  });

});
