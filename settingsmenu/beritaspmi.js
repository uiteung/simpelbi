import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyUpdateApi,
  CihuyDeleteAPI,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";
import { CihuyPaginations2 } from "https://c-craftjs.github.io/simpelbi/pagenations.js";

// Untuk Get Data Profile
populateUserProfile();

document.addEventListener("DOMContentLoaded", () => {
  // Fungsi untuk menghapus cookie
  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // Ambil elemen Sign Out
  const signoutButton = document.querySelector(".nav-author__signout");

  // Tambahkan event listener untuk logout
  signoutButton.addEventListener("click", (event) => {
    event.preventDefault(); // Mencegah perilaku default <a>

    // Hapus cookie yang terkait dengan login
    deleteCookie("login");

    // Arahkan pengguna ke halaman yang diinginkan
    window.location.href = signoutButton.getAttribute("href");
  });
});


const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/beritaspmi";
const token = CihuyGetCookie("login"); // Get Cookie From SimpelBi
let idFileToUpdate = null;

const itemsPerPage = 3;
let currentPage = 1;

// Function to display data for a specific page
function displayPageData(data, currentPage) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  let nomor = startIndex + 1;

  paginatedData.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `
    <td>${nomor}</td>
    <td>${item.judul}</td>
    <td>${item.isi}</td>
    <td>
    <div class="userDatatable-content">
    <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${
      item.gambar
    }" alt="Foto" width="100" height="100">
    </div>
          
  <td>${item.tanggal}</td>
  <td>${item.nm_admin ? item.nm_admin : "Tidak ada admin"}</td>

    <td>
      <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
        
        <li>
        <a href="#" class="edit" data-target="#new-member-update" data-files-id="${
          item.id_berita_spmi
        }">
        <i class="uil uil-edit"></i>
          </a>
        </li>
        <li>
        <a href="#" class="remove" data-files-id="${item.id_berita_spmi}">
        <i class="uil uil-trash-alt"></i>
          </a>
        </li>
      </ul>
    </td>
  `;
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const id_berita_spmi = removeButton.getAttribute("data-files-id");
      if (id_berita_spmi) {
        deleteFile(id_berita_spmi);
      } else {
        console.error("id hasil survei untuk Auditor tidak ditemukan.");
      }
    });
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const id_berita_spmi = editButton.getAttribute("data-files-id");
      if (id_berita_spmi) {
        editData(id_berita_spmi);
      } else {
        console.error("id hasil survei untuk Auditor tidak ditemukan.");
      }
    });
    tableBody.appendChild(barisBaru);
    nomor++;
  });
}
function createPaginationControls(data) {
  const paginationContainer = document.querySelector(".dm-pagination");

  CihuyPaginations2(
    data,
    currentPage,
    itemsPerPage,
    paginationContainer,
    (newPage) => {
      currentPage = newPage;
      displayPageData(data, currentPage);
      createPaginationControls(data);
    }
  );
}
CihuyDataAPI(apiUrl, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    // ShowDataUsersAuditor(data);
    createPaginationControls(data);
    displayPageData(data, currentPage); // siklusdata(data);
  }
});
function editData(id_berita_spmi) {
  // Gunakan CihuyDataAPI untuk mengambil data dari server
  CihuyDataAPI(
    apiUrl + `?id_berita_spmi=${id_berita_spmi}`,
    token,
    (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
      } else {
        const data = response.data;
        console.log("Data yang diterima:", data);
        const fileData = data.find(
          (item) => item.id_berita_spmi === parseInt(id_berita_spmi)
        );
        document.getElementById("judul-update").value = fileData.judul;
        document.getElementById("isi-update").value = fileData.isi;

        // Set nilai idFileToUpdate dengan idFile yang ingin diupdate
        idFileToUpdate = fileData.id_berita_spmi;

        // Tampilkan modal
        const modal = new bootstrap.Modal(
          document.getElementById("new-member-update")
        );
        modal.show();

        // Isi dropdown "siklus-update"
        const siklusDropdown = document.getElementById("periode-update");
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
    }
  );
}

// Mendapatkan referensi ke elemen-elemen formulir
const isiUpdateInput = document.getElementById("isi-update");
const judulUpdateInput = document.getElementById("judul-update");
const fileUpdateInput = document.getElementById("file-update");
const updateDataButton = document.getElementById("updateDataButton");

// Event listener untuk tombol "Update Data"
updateDataButton.addEventListener("click", function () {
  // Ambil data dari input form
  const isi = isiUpdateInput.value;
  const judul = judulUpdateInput.value;
  const gambar = fileUpdateInput.files[0]; // Ambil file yang diunggah

  // Tutup modal jika diperlukan
  $("#new-member-update").modal("hide");

  // Tampilkan SweetAlert konfirmasi dengan judul, teks, dan ikon yang berbeda
  Swal.fire({
    title: "Update Files pada Auditor?",
    text: "Apakah Anda yakin ingin update Files untuk Auditor?", // Teks yang berbeda
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Update",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Buat objek data yang akan dikirim ke API sesuai dengan format JSON yang diberikan
      const dataToUpdate = {
        isi: isi,
        judul: judul,
        gambar: {
          fileType: "image/jpeg", // Ganti dengan tipe file yang sesuai
          payload: "", // Payload akan diisi nanti
        },
      };

      // Jika ada file yang diunggah, baca file dan konversi ke base64
      if (gambar) {
        const reader = new FileReader();
        reader.readAsDataURL(gambar);
        reader.onload = function () {
          // Hasil bacaan file akan tersedia di reader.result
          dataToUpdate.gambar.payload = reader.result.split(",")[1]; // Ambil base64-nya
          // Panggil fungsi update API
          CihuyUpdateApi(
            apiUrl + `/update?id_berita_spmi=${idFileToUpdate}`, // Anda mungkin perlu menyesuaikan URL ini
            token,
            dataToUpdate,
            function (error, responseData) {
              if (error) {
                console.error("Error updating data:", error);
                // Handle error (tampilkan pesan error ke pengguna jika diperlukan)
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Terjadi kesalahan saat mengupdate data.",
                });
              } else {
                // Data berhasil diupdate
                console.log("Data updated successfully:", responseData);
                // Refresh tampilan data
                CihuyDataAPI(apiUrl, token, (error, response) => {
                  if (error) {
                    console.error("Terjadi kesalahan:", error);
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Terjadi kesalahan saat memuat data baru.",
                    });
                  } else {
                    const data = response.data;
                    console.log("Data yang diterima:", data);
                    // tampilData(data);
                    // Tampilkan SweetAlert sukses
                    Swal.fire({
                      icon: "success",
                      title: "Sukses",
                      text: "Data berhasil diupdate.",
                      showConfirmButton: false,
                      timer: 1500,
                    }).then(() => {
                      window.location.reload();
                    });
                  }
                });
              }
            }
          );
        };
      } else {
        // Panggil fungsi update API jika tidak ada file yang diunggah
        CihuyUpdateApi(
          apiUrl + `/update?id_berita_spmi=${idFileToUpdate}`, // Anda mungkin perlu menyesuaikan URL ini
          token,
          dataToUpdate,
          function (error, responseData) {
            if (error) {
              console.error("Error updating data:", error);
              // Handle error (tampilkan pesan error ke pengguna jika diperlukan)
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Terjadi kesalahan saat mengupdate data.",
              });
            } else {
              // Data berhasil diupdate
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
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Terjadi kesalahan saat memuat data baru.",
                  });
                } else {
                  const data = response.data;
                  console.log("Data yang diterima:", data);
                  // tampilData(data);
                  // Tampilkan SweetAlert sukses
                  Swal.fire({
                    icon: "success",
                    title: "Sukses",
                    text: "Data berhasil diupdate.",
                    showConfirmButton: false,
                    timer: 1500,
                  }).then(() => {
                    window.location.reload();
                  });
                }
              });
            }
          }
        );
      }
    }
  });
});

function deleteFile(id_berita_spmi) {
  // Tampilkan dialog konfirmasi menggunakan SweetAlert2
  Swal.fire({
    title: "Apakah Anda yakin ingin menghapus files?",
    text: "Penghapusan files akan permanen.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Tidak, Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Buat URL untuk mengambil files berdasarkan ID
      const apiUrlGetfileById = `https://simbe-dev.ulbi.ac.id/api/v1/beritaspmi/get?id_berita_spmi=${id_berita_spmi}`;

      // Lakukan permintaan GET untuk mengambil files berdasarkan id hasil survei
      CihuyDataAPI(apiUrlGetfileById, token, (error, response) => {
        if (error) {
          console.error("Terjadi kesalahan saat mengambil files:", error);
        } else {
          const fileData = response.data;
          if (fileData) {
            // Dapatkan id hasil survei dari data yang diterima
            const FileIDtoDelete = fileData.id_berita_spmi;

            // Buat URL untuk menghapus files berdasarkan ID files yang telah ditemukan
            const apiUrlfilesDelete = `https://simbe-dev.ulbi.ac.id/api/v1/beritaspmi/delete?id_berita_spmi=${FileIDtoDelete}`;

            // Lakukan permintaan DELETE untuk menghapus files
            CihuyDeleteAPI(
              apiUrlfilesDelete,
              token,
              (deleteError, deleteData) => {
                if (deleteError) {
                  console.error(
                    "Terjadi kesalahan saat menghapus files:",
                    deleteError
                  );
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Terjadi kesalahan saat menghapus files!",
                  });
                } else {
                  console.log("files berhasil dihapus:", deleteData);
                  Swal.fire({
                    icon: "success",
                    title: "Sukses!",
                    text: "files berhasil dihapus.",
                    showConfirmButton: false,
                    timer: 1500,
                  }).then(() => {
                    // Refresh halaman setelah menutup popup
                    window.location.reload();
                  });
                }
              }
            );
          } else {
            console.error("Data files tidak ditemukan.");
          }
        }
      });
    } else {
      // Tampilkan pesan bahwa penghapusan dibatalkan
      Swal.fire("Dibatalkan", "Penghapusan files dibatalkan.", "info");
    }
  });
}

function siklusupdate() {
  const selectElement = document.getElementById("periode-update");

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
        optionElement.textContent = `${item.idSiklus} - Tahun ${item.tahun}`;
        selectElement.appendChild(optionElement);
      });
    }
  });
}

const siklusapi = "https://simbe-dev.ulbi.ac.id/api/v1/siklus/";
const apiPostFiles = "https://simbe-dev.ulbi.ac.id/api/v1/beritaspmi/add";
const apiAdmin = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";

function siklusdata(data) {
  const selectElement = document.getElementById("periode");

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
    console.log("Nilai yang dipilih:", selectedValue);
  });
}

// Untuk POST Data menggunakan API
// Mendapatkan referensi ke elemen-elemen formulir
// const siklusInput = document.getElementById("periode");
const form = document.getElementById("myForm");
const isiInput = document.getElementById("isi");
const judulInput = document.getElementById("judul");
const fileInput = document.getElementById("file");

// Menambahkan event listener ke tombol Simpan
document
  .getElementById("tambahDataButton")
  .addEventListener("click", async function () {
    // Mendapatkan nilai dari elemen formulir
    // const id_periode = siklusInput.value;
    const isi = isiInput.value;
    const judul = judulInput.value;
    const file = fileInput.files[0];

    // Mengecek apakah semua field telah diisi
    if (!isi || !judul || !file) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Harap isi semua bidang formulir!",
      });
      return;
    }

    // Tutup modal sebelum menampilkan SweetAlert konfirmasi
    $("#new-member").modal("hide");

    // Menampilkan SweetAlert konfirmasi
    Swal.fire({
      title: "Tambahkan File untuk Auditor?",
      text: "Apakah Anda yakin ingin menambahkan File untuk Auditor?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Tambahkan",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Membaca file yang diunggah ke dalam bentuk base64
        const reader = new FileReader();
        reader.onload = async function () {
          const base64Data = reader.result.split(",")[1]; // Mengambil bagian payload dari data base64

          // Membuat objek data yang akan dikirim ke server
          const data = {
            judul: judul,
            isi: isi,
            gambar: {
              fileType: file.type,
              payload: base64Data,
            },
          };

          try {
            // Kirim permintaan POST ke server menggunakan fungsi CihuyPostApi
            await CihuyPostApi(apiPostFiles, token, data);

            // Tampilkan SweetAlert berhasil
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Data telah berhasil disimpan.",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              // Reset form jika diperlukan
              form.reset();

              // Reload halaman setelah menampilkan SweetAlert berhasil
              window.location.reload();
            });
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
      }
    });
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
