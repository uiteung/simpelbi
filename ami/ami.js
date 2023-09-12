import { CihuyPostAMI, ShowDataAMI } from "../js/config/configami.js"
import { UrlAMI, token, UrlPostAMI } from "../js/template/template.js";
import {
    CihuyDataAPI,
  } from "https://c-craftjs.github.io/simpelbi/api.js";
  
CihuyDataAPI(UrlAMI, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
    //   console.log("Data yang diterima:", data);
      ShowDataAMI(data);
    }
  });

const Tombol = document.getElementById("buttoninsert");

Tombol.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("Button Clicked");

  const amival = document.getElementById("ami").value;
  
  var raw = JSON.stringify({
    "ami": amival
  });

  // Mengirim permintaan POST menggunakan fungsi CihuyPostApi
  CihuyPostAMI(UrlPostAMI, token, raw)
  .then((responseText) => {
    console.log("Response:", responseText);
    window.alert("Data berhasil ditambahkan!");
    window.location.replace("https://euis.ulbi.ac.id/simpelbi/ami/ami.html")
  })
  .catch((error) => {
    console.error("Error:", error);
    // Tangani kesalahan jika terjadi
  });

});

