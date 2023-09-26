import { ShowDataAMI } from "../js/config/configami.js"
import { Url, UrlAMI, UrlGetUsersAuditor, UrlGetUsersFakultas, UrlGetUsersProdi, UrlPostAmi, token } from "../js/template/template.js";
import {
    CihuyDataAPI,
    CihuyPostApi
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
// Panggil API untuk mendapatkan data fakultas
CihuyDataAPI(UrlGetUsersFakultas, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    fakultasData(data);
  }
});

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
// Panggil API untuk mendapatkan data prodi
CihuyDataAPI(UrlGetUsersProdi, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    prodiData(data);
  }
});

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
// Panggil API untuk mendapatkan data auditor
CihuyDataAPI(UrlGetUsersAuditor, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    auditorData(data);
  }
});

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
// Panggil API untuk mendapatkan data siklus
CihuyDataAPI(Url, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    siklusData(data);
  }
});

// Untuk ambil nilai di form
const form = document.getElementById("myForm");
const fakultasInput = document.getElementById("fakultas").value;
const prodiInput = document.getElementById("prodi").value;
const auditorInput = document.getElementById("auditor").value;
const anggota1Input = document.getElementById("anggota1").value;
const anggota2Input = document.getElementById("anggota2").value;

document
  .getElementById("buttoninsert")
  .addEventListener("click", async function () {
    if  (!fakultasInput || !prodiInput || !auditorInput || !anggota1Input || !anggota2Input) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Harap isi semua bidang formulir!",
      });
      return;
    }

      // Membuat objek data yang akan dikirim ke server
      const data = {
        fakultasInput: parseInt(fakultasInput),
        prodiInput: parseInt(prodiInput),
        auditorInput: parseInt(auditorInput),
        anggota1Input: parseInt(anggota1Input),
        anggota2Input: parseInt(anggota2Input),
      };

      try {
        // Kirim permintaan POST ke server menggunakan fungsi CihuyPostApi
        await CihuyPostApi(UrlPostAmi, token, data);

        // Sembunyikan modal setelah berhasil
        document.getElementById("new-member").style.display = "none";

        // Tampilkan SweetAlert
        window.location.reload();
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
        console.log("Data yang dikirimkan:", data);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Terjadi kesalahan saat menyimpan data.",
        });
        // Handle kesalahan jika terjadi
      }
  })