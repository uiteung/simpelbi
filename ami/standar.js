import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import {token, UrlGetStandar, UrlPostStandar} from "../js/template/template.js"
import { ShowdataStandar } from "../js/config/configstandar.js";
import {CihuyPostKTS} from "../js/config/configkts.js"

// Untuk Get Data dari API
CihuyDataAPI(UrlGetStandar, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      // console.log("Data yang diterima:", data);
      ShowdataStandar(data);
    }
  });

  const Tombol = document.getElementById("buttonadd");

Tombol.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("Button Clicked");

  const standarval = document.getElementById("standar").value;
  const pilihanval = document.getElementById("utkpilihan").value;
  const isival = document.getElementById("isi").value;
  
  var raw = JSON.stringify({
    "standar": standarval,
    "utkPilihan": pilihanval,
    "isi": isival,
    "idSiklus": 1
  });

// Mengirim permintaan POST menggunakan fungsi CihuyPostApi
CihuyPostKTS(UrlPostStandar, token, raw)
  .then((responseText) => {
    console.log("Response:", responseText);
    window.alert("Data berhasil ditambahkan!");
    window.location.replace("https://euis.ulbi.ac.id/simpelbi/ami/standar.html")
  })
  .catch((error) => {
    console.error("Error:", error);
    // Tangani kesalahan jika terjadi
  });

});
