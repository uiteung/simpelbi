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

// const Tombol = document.getElementById("buttonadd");

// Tombol.addEventListener("click", async function (e) {
//   e.preventDefault();
//   console.log("Button Clicked");

//   const standarval = document.getElementById("standar").value;
//   const pilihanval = document.getElementById("utkpilihan").value;
//   const isival = document.getElementById("isi").value;
  
//   var raw = JSON.stringify({
//     "standar": standarval,
//     "utkPilihan": pilihanval,
//     "isi": isival,
//     "idSiklus": 1
//   });
// });

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

// Untuk Ambil nilai dari elemen
const standarInput = document.getElementById("standar").value;
const untukPilihan = document.getElementById("utkpilihan").value;
const isiInput = document.getElementById("isi").value;
const siklusInput = document.getElementById("siklus").value;

// Menambahkan event listener ke tombol simpan
document
  .getElementById("buttonadd")
  .addEventListener("click", async function () {
      // Menambahkan nilai dari elemen formulir
      const Standar = standarInput.value;
      const Pilihan = untukPilihan.value;
      const Isi = isiInput.value;
      const Siklus = siklusInput.value;

      // Cek apakah ada field yang kosong pada form
      if (!Standar || !Pilihan || !Isi || !Siklus) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Harap isi semua bidang formulir!"
        });
        return;
      }

      reader.onload = async function () {
        const data = {
          Standar: Standar,
          Pilihan: Pilihan,
          Isi: Isi,
          Siklus: parseInt(Siklus),
        };

        try {
          // Mengirim permintaan POST ke server menggunakan fungsi CihuyPostApi
          await CihuyPostApi(UrlPostStandar, token, data);

          // Sembunyikan modal setelah berhasil
          document.getElementById("new-member").style.display = "none";

          // Tampilkan SweetAlert
          window.location.reload();
        } catch (error) {
          console.error("Terjadi kesalahan: ", error);
          console.log("Data yang dikirimkan: ", data);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Terjadi kesalahan saat menyimpan data.",
          });
          // Handle kesalahan jika terjadi
        }
      };
})

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

// // Mengirim permintaan POST menggunakan fungsi CihuyPostApi
// CihuyPostKTS(UrlPostStandar, token, raw)
//   .then((responseText) => {
//     console.log("Response:", responseText);
//     window.alert("Data berhasil ditambahkan!");
//     window.location.replace("https://euis.ulbi.ac.id/simpelbi/ami/standar.html")
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//     // Tangani kesalahan jika terjadi
//   });
