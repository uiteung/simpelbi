import { CihuyDataAPI, CihuyPostApi } from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetStandar, UrlPostStandar } from "../js/template/template.js"
import { ShowdataStandar } from "../js/config/configstandar.js";
// import { CihuyPostKTS } from "../js/config/configkts.js"

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

// Untuk POST Data dengan menggunakan API
function siklusdata(data) {
  const selectElement = document.getElementById("siklus");
  // Kosongkan isi dropdown saat ini
  selectElement.innerHTML = "";
  // Loop melalui data yang diterima dari API
  data.forEach((item, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = index + 1;
    optionElement.textContent = `${index + 1} - Tahun ${item.tahun}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function () {
    const selectedValue = this.value;
    // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
    console.log("Nilai yang dipilih:", selectedValue);
  });
}

// Panggil API untuk mendapatkan data siklus
const siklusapi = "https://simbe-dev.ulbi.ac.id/api/v1/siklus/";

CihuyDataAPI(siklusapi, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    siklusdata(data);
  }
});

const Tombol = document.getElementById("buttonadd");

Tombol.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("Button Clicked");

  // Untuk Ambil nilai dari elemen
  const standarInput = document.getElementById("standar").value;
  const untukPilihan = document.getElementById("utkpilihan").value;
  const isiInput = document.getElementById("isi").value;
  const siklusInput = document.getElementById("siklus").value;

  const data = {
    standar: standarInput,
    utkPilihan: untukPilihan,
    isi: isiInput,
    idSiklus: parseInt(siklusInput),
  };

  // Mengirimkan Permintaan POST Menggunakan Fungsi CihuyPostApi
  CihuyPostApi(UrlPostStandar, token, data)
  .then((responseText) => {
    console.log("Response :", responseText);
    window.alert("Data Berhasil ditambahkan!");
    window.location.replace("https://euis.ulbi.ac.id/simpelbi/ami/standar.html");
  })
  .catch((error) => {
    console.error("Error: ", error);
    //  Tangani kesalahan jika terjadi
  });
  });

