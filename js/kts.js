import { CihuyPostKTS, ShowDataKTS } from "../js/config/configkts.js"
import { UrlKts, token } from "../js/template/template.js";
import {
    CihuyDataAPI,
  } from "https://c-craftjs.github.io/simpelbi/api.js";
  
CihuyDataAPI(UrlKts, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
    //   console.log("Data yang diterima:", data);
      ShowDataKTS(data);
    }
  });

const Tombol = document.getElementById("buttoninsert");

Tombol.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("Button Clicked");

  const ktsval = document.getElementById("kts").value;
  
  var raw = JSON.stringify({
    "kts": ktsval
  });
  

  const url = "https://simbe-dev.ulbi.ac.id/api/v1/kts/add"; // Gantilah dengan URL yang sesuai

  // Mengirim permintaan POST menggunakan fungsi CihuyPostApi
  CihuyPostKTS(url, token, raw)
  .then((responseText) => {
    console.log("Response:", responseText);
    window.alert("Data berhasil ditambahkan!");
    window.location.replace("https://euis.ulbi.ac.id/simpelbi/ami/kts.html")
  })
  .catch((error) => {
    console.error("Error:", error);
    // Tangani kesalahan jika terjadi
  });

});

