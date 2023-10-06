import {
  CihuyDataAPI,
  CihuyPostApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetUsersAuditor } from "../js/template/template.js";
// import { ShowDataUsersAuditor } from "../js/config/configusersauditor.js";

function ShowDataUsersAuditor(data) {
  const tableBody = document.getElementById("content");

  // Kosongkan isi tabel saat ini
  tableBody.innerHTML = "";
  let nomor = 1;

  // Loop melalui data yang diterima dari API
  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `
    <td>
       <div class="userDatatable-content">${nomor}</div>
    </td>
    <td>
       <div class="d-flex">
          <div class="userDatatable-inline-title">
             <a href="#" class="text-dark fw-500">
                <h6>${item.fakultas}</h6>
             </a>
          </div>
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.idAuditor}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.prodi}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.auditor}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.nidn}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.niknip}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.telp}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.email}
       </div>
    </td>
    <td>
    <div class="userDatatable-content">
    <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${item.foto_data}" alt="Foto" width="100" height="100">
    </div>
    </td>
    <td>
       <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
          <li>
             <a href="#" class="edit">
                <i class="uil uil-edit"></i>
             </a>
          </li>
          <li>
             <a href="#" class="remove">
                <i class="uil uil-trash-alt"></i>
             </a>
          </li>
       </ul>
    </td>
    `;
    tableBody.appendChild(barisBaru);
    nomor++;
  });
}
// Untuk Get Data dari API
CihuyDataAPI(UrlGetUsersAuditor, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    ShowDataUsersAuditor(data);
    siklusdata(data);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const tambahDataButton = document.getElementById("tambahDataButton");
  CihuyDataAPI(siklusapi, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);
      siklusdata(data);
    }
  });
  const siklusapi = "https://simbe-dev.ulbi.ac.id/api/v1/siklus/";

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

  tambahDataButton.addEventListener("click", function (e) {
    e.preventDefault();

    // Untuk POST Data menggunakan API
    // Mendapatkan referensi ke elemen-elemen formulir

    // Ambil data dari elemen-elemen formulir
    const namaAuditor = document.getElementById("namaAuditor").value;
    const nidn = document.getElementById("nidn").value;
    const nikNip = document.getElementById("nikNip").value;
    const telepon = document.getElementById("telepon").value;
    const email = document.getElementById("email").value;
    const fotoInput = document.getElementById("fotoInput");
    const fakultasDropdown = document.getElementById("fakultas");
    const prodiDropdown = document.getElementById("prodi"); // Move these variable declarations here// Anda mungkin perlu mengubah ID ini sesuai dengan elemen foto input yang sebenarnya
    const siklusInput = document.getElementById("siklus");
    const idSiklus = siklusInput.value;

    const idFakultas = fakultasDropdown.value;
    const idProdi = prodiDropdown.value;

    if (
      !namaAuditor ||
      !nidn ||
      !nikNip ||
      !telepon ||
      !email ||
      !fakultasDropdown ||
      !siklusInput ||
      !judul ||
      !fotoInput
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Harap isi semua bidang formulir!",
      });
      return;
    }

    // Dapatkan nama file yang diunggah
    let fileName = ""; // Deklarasikan fileName di sini
    const fotoFile = fotoInput.files[0];
    if (fotoFile) {
      fileName = fotoFile.name;
      getBase64Image(fotoFile, function (base64Image) {
        // Buat objek data JSON yang sesuai dengan format yang Anda inginkan
        const dataToSend = {
          user_name: "1204004",
          idFakultas: parseInt(idFakultas), // Gunakan idFakultas dari dropdown
          idProdi: parseInt(idProdi), // Gunakan idProdi dari dropdown
          auditor: namaAuditor,
          nidn: nidn,
          niknip: nikNip,
          telp: telepon,
          email: email,
          foto: {
            fileName: fileName, // Gunakan nama file yang diunggah
            fileType: fotoFile ? fotoFile.type : "",
            payload: base64Image, // Gunakan base64 gambar
          },
          idSiklus: parseInt(idSiklus),
        };

        // Sekarang dataToSend lengkap dengan payload gambar
        // Kirim data ke server dengan fungsi CihuyPostApi
        CihuyPostApi(UrlGetUsersAuditor + "add", token, dataToSend)
          .then((responseText) => {
            console.log("Respon sukses:", responseText);
            // Lakukan tindakan lain setelah permintaan POST berhasil
            Swal.fire({
              icon: "success",
              title: "Sukses!",
              text: "Data berhasil ditambahkan.",
            }).then(() => {
              // Refresh halaman setelah menutup popup
              window.location.reload();
            });
          })
          .catch((error) => {
            console.error("Terjadi kesalahan:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Terjadi kesalahan saat menambahkan data.",
            });
          });
      });
    }
  });
  function getBase64Image(file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      const base64Image = reader.result.split(",")[1];
      callback(base64Image);
    };
  }
  // Fungsi untuk mengambil data Fakultas dan Prodi
  function loadData() {
    // Ambil referensi ke elemen dropdown Fakultas
    const fakultasDropdown = document.getElementById("fakultas");
    // Ambil referensi ke elemen dropdown Prodi
    const prodiDropdown = document.getElementById("prodi");
    const apiUrlFakultas = "https://simbe-dev.ulbi.ac.id/api/v1/fakultas/";
    const apiUrlProdi = "https://simbe-dev.ulbi.ac.id/api/v1/prodi/";

    // Panggil CihuyDataAPI untuk mengambil data Fakultas dari API
    CihuyDataAPI(apiUrlFakultas, token, (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
      } else {
        const data = response.data;
        console.log("Data Fakultas yang diterima:", data);

        // Isi dropdown Fakultas dengan data yang diterima dari API
        data.forEach((fakultas) => {
          const option = document.createElement("option");
          option.value = fakultas.id_fakultas;
          option.textContent = fakultas.fakultas;
          fakultasDropdown.appendChild(option);
        });
      }
    });

    //get siklus
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

    //get username
    const apiUrlConvert = "https://simbe-dev.ulbi.ac.id/api/v1/convert";
    let dataFromApi = [];
    const usernameInput = document.getElementById("username");
    const usernameSuggestions = document.getElementById("username-suggestions");
    //update suggestion
    const usernameInputUpdate = document.getElementById("username-update");
    const usernameSuggestionsUpdate = document.getElementById(
      "username-suggestions-update"
    );
    // Panggil fungsi CihuyDataAPI untuk mengambil data saat halaman dimuat
    CihuyDataAPI(apiUrlConvert, token, (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
      } else {
        const data = response.data;
        dataFromApi = data;
      }
    });

    usernameInput.addEventListener("input", (e) => {
      const inputValue = e.target.value.toLowerCase();

      // Bersihkan daftar saran sebelumnya
      usernameSuggestions.innerHTML = "";

      // Filter opsi-opsi yang cocok dengan input pengguna
      const filteredOptions = dataFromApi.filter((item) =>
        item.id_rtm.toLowerCase().includes(inputValue)
      );

      // Tampilkan opsi-opsi dalam div saran
      filteredOptions.forEach((item) => {
        const suggestion = document.createElement("div");
        suggestion.textContent = item.id_rtm;
        suggestion.addEventListener("click", () => {
          // Setel nilai input saat opsi dipilih
          usernameInput.value = item.id_rtm;
          usernameSuggestions.innerHTML = ""; // Bersihkan daftar saran
        });
        usernameSuggestions.appendChild(suggestion);
      });
    });

    document.addEventListener("click", (e) => {
      if (e.target !== usernameInput && e.target !== usernameSuggestions) {
        usernameSuggestions.innerHTML = "";
      }
    });
    // Panggil CihuyDataAPI untuk mengambil data Prodi dari API
    CihuyDataAPI(apiUrlProdi, token, (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
      } else {
        const data = response.data;
        console.log("Data Prodi yang diterima:", data);

        // Isi dropdown Prodi dengan data yang diterima dari API
        data.forEach((prodi) => {
          const option = document.createElement("option");
          option.value = prodi.id_prodi;
          option.textContent = prodi.prodi;
          prodiDropdown.appendChild(option);
        });
      }
    });
  }

  // Panggil fungsi loadData untuk mengisi data Fakultas dan Prodi saat halaman dimuat
  loadData();
});
