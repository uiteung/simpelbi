import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyUpdateApi,
  // CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
// import { UrlGetFileProdi } from "../js/template/template";
const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/filesprodi";
const token = CihuyGetCookie("login"); // Get Cookie From SimpelBi
let idFileToUpdate = null;

function tampilData(data) {
  const tableBody = document.getElementById("tableBody");

  // Kosongkan isi tabel saat ini
  tableBody.innerHTML = "";
  let nomor = 1;

  // Loop melalui data yang diterima dari API
  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `
            <td>${nomor}</td>
            <td>${item.idFile}</td>
            <td>${item.tahun}</td>
            <td>${item.judul}</td>
            <td>
            <a href="https://simbe-dev.ulbi.ac.id/static/pictures/${item.file}" class="btn btn-primary btn-sm" target="_blank">
              Lihat
            </a>
          </td>            
            <td>${item.tgl}</td>
            <td>${item.nm_admin}</td>
            <td>
              <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
               
                <li>
                <a href="#" class="edit"  data-target="#new-member-update" data-untuk-prodi-id="${item.idFile}">
                <i class="uil uil-edit"></i>
                  </a>
                </li>
                <li>
                <a href="#" class="remove" data-untuk-prodi-id="${item.idFile}">
                <i class="uil uil-trash-alt"></i>
                  </a>
                </li>
              </ul>
            </td>
          `;
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const idFile = removeButton.getAttribute("data-untuk-prodi-id");
      if (idFile) {
        deletefileprodi(idFile);
      } else {
        console.error("ID filesprodi untuk prodi tidak ditemukan.");
      }
    });
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const idFile = editButton.getAttribute("data-untuk-prodi-id");
      if (idFile) {
        editData(idFile);
      } else {
        console.error("ID filesprodi untuk prodi tidak ditemukan.");
      }
    });
    tableBody.appendChild(barisBaru);
    nomor++;
  });
}
function editData(idFile) {
  // Gunakan CihuyDataAPI untuk mengambil data dari server
  CihuyDataAPI(apiUrl + `?idFile=${idFile}`, token, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      const data = response.data;
      console.log("Data yang diterima:", data);
      const fileData = data.find((item) => item.idFile === parseInt(idFile));
      document.getElementById("judul-update").value = fileData.judul;

      // Set nilai idFileToUpdate dengan idFile yang ingin diupdate
      idFileToUpdate = fileData.idFile;

      // Tampilkan modal
      const modal = new bootstrap.Modal(
        document.getElementById("new-member-update")
      );
      modal.show();

      // Isi dropdown "siklus-update"
      const siklusDropdown = document.getElementById("siklus-update");
      if (siklusDropdown) {
        // Panggil fungsi untuk mengisi dropdown siklus
        CihuyDataAPI(siklusapi, token, (siklusError, siklusResponse) => {
          if (siklusError) {
            console.error("Terjadi kesalahan:", siklusError);
          } else {
            siklusupdate(fileData); // Gunakan fungsi untuk mengisi dropdown siklus
          }
        });
      }
    }
  });
}

// Mendapatkan referensi ke elemen-elemen formulir
const siklusUpdateInput = document.getElementById("siklus-update");
const judulUpdateInput = document.getElementById("judul-update");
const fileUpdateInput = document.getElementById("file-update");
const updateDataButton = document.getElementById("updateDataButton");

// Event listener untuk tombol "Update Data"
updateDataButton.addEventListener("click", function () {
  // Ambil data dari input form
  const siklus = siklusUpdateInput.value;
  const judul = judulUpdateInput.value;
  const file = fileUpdateInput.files[0]; // Ambil file yang diunggah

  // Validasi data jika diperlukan

  // Buat objek data yang akan dikirim ke API sesuai dengan format JSON yang diberikan
  const dataToUpdate = {
    idSiklus: parseInt(siklus),
    judul: judul,
    file: {
      fileType: "application/pdf", // Ganti dengan tipe file yang sesuai
      payload: "", // Payload akan diisi nanti
    },
  };

  // Jika ada file yang diunggah, baca file dan konversi ke base64
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      // Hasil bacaan file akan tersedia di reader.result
      dataToUpdate.file.payload = reader.result.split(",")[1]; // Ambil base64-nya
      // Panggil fungsi update API
      CihuyUpdateApi(
        apiUrl + `/update?idfilesprodi=${idFileToUpdate}`, // Anda mungkin perlu menyesuaikan URL ini
        token,
        dataToUpdate,
        function (error, responseData) {
          if (error) {
            console.error("Error updating data:", error);
            // Handle error (tampilkan pesan error ke pengguna jika diperlukan)
          } else {
            // Data berhasil diupdate, mungkin Anda ingin melakukan sesuatu di sini
            console.log("Data updated successfully:", responseData);
            // Tutup modal jika diperlukan
            const modal = new bootstrap.Modal(
              document.getElementById("new-member-update")
            );
            modal.hide();
            // Refresh tampilan data
            CihuyDataAPI(apiUrl, token, (error, response) => {
              if (error) {
                console.error("Terjadi kesalahan:", error);
              } else {
                const data = response.data;
                console.log("Data yang diterima:", data);
                window.location.reload();
                tampilData(data);
              }
            });
          }
        }
      );
    };
  } else {
    // Panggil fungsi update API jika tidak ada file yang diunggah
    CihuyUpdateApi(
      apiUrl + `/update?idfilesprodi=${idFileToUpdate}`, // Anda mungkin perlu menyesuaikan URL ini
      token,
      dataToUpdate,
      function (error, responseData) {
        if (error) {
          console.error("Error updating data:", error);
          // Handle error (tampilkan pesan error ke pengguna jika diperlukan)
        } else {
          // Data berhasil diupdate, mungkin Anda ingin melakukan sesuatu di sini
          console.log("Data updated successfully:", responseData);
          // Tutup modal jika diperlukan
          const modal = new bootstrap.Modal(
            document.getElementById("new-member-update")
          );
          modal.hide();
          // Refresh tampilan data
          CihuyDataAPI(apiUrl, token, (error, response) => {
            if (error) {
              console.error("Terjadi kesalahan:", error);
            } else {
              const data = response.data;
              console.log("Data yang diterima:", data);
              tampilData(data);
            }
          });
        }
      }
    );
  }
});
function siklusupdate() {
  const selectElement = document.getElementById("siklus-update");

  // Kosongkan isi dropdown saat ini
  selectElement.innerHTML = "";

  // Panggil fungsi untuk mengambil data siklus dari API
  CihuyDataAPI(siklusapi, token, (siklusError, siklusResponse) => {
    if (siklusError) {
      console.error("Terjadi kesalahan:", siklusError);
    } else {
      const siklusData = siklusResponse.data;
      console.log("Data Siklus yang diterima:", siklusData);

      // Loop melalui data yang diterima dari API
      siklusData.forEach((item, index) => {
        const optionElement = document.createElement("option");
        optionElement.value = item.idSiklus;
        optionElement.textContent = `${item.idSiklus} - Siklus ${item.tahun}`;
        selectElement.appendChild(optionElement);
      });
    }
  });
}

const siklusapi = "https://simbe-dev.ulbi.ac.id/api/v1/siklus/";
const apiPostFiles = "https://simbe-dev.ulbi.ac.id/api/v1/filesprodi/add";

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
// Mendapatkan referensi ke elemen-elemen formulir
const form = document.getElementById("myForm");
const siklusInput = document.getElementById("siklus");
const judulInput = document.getElementById("judul");
const fileInput = document.getElementById("file");

// Menambahkan event listener ke tombol Simpan

document
  .getElementById("tambahDataButton")
  .addEventListener("click", async function () {
    // Mendapatkan nilai dari elemen formulir
    const idSiklus = siklusInput.value;
    const judul = judulInput.value;
    const file = fileInput.files[0];

    // Mengecek apakah file telah dipilih
    if (!idSiklus || !judul || !file) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Harap isi semua bidang formulir!",
      });
      return;
    }

    // Membaca file yang diunggah ke dalam bentuk base64
    const reader = new FileReader();
    reader.onload = async function () {
      const base64Data = reader.result.split(",")[1]; // Mengambil bagian payload dari data base64

      // Membuat objek data yang akan dikirim ke server
      const data = {
        idSiklus: parseInt(idSiklus),
        judul: judul,
        file: {
          fileType: file.type,
          payload: base64Data,
        },
      };

      try {
        // Kirim permintaan POST ke server menggunakan fungsi CihuyPostApi
        await CihuyPostApi(apiPostFiles, token, data);

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
    };

    // Membaca file sebagai base64
    reader.readAsDataURL(file);
  });
// Panggil API untuk mendapatkan data siklus
CihuyDataAPI(siklusapi, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    siklusdata(data);
  }
});

// get data
CihuyDataAPI(apiUrl, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    tampilData(data);
  }
});

// CihuyPostApi(UrlPostUsersAdmin, token, dataToSend)
//   .then((responseText) => {
//     console.log("Respon sukses:", responseText);
//     // Lakukan tindakan lain setelah permintaan POST berhasil
//   })
//   .catch((error) => {
//     console.error("Terjadi kesalahan:", error);
//     // Handle kesalahan jika terjadi
//   });
