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


const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/formulirspmi";
const token = CihuyGetCookie("login");
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
    <td>${item.keterangan}</td>
    <td>${item.tahun}</td>
    <td>
    <a href="https://simbe-dev.ulbi.ac.id/static/pictures/${item.file}" class="btn btn-primary btn-sm" target="_blank">
      Lihat
    </a>
  </td>   
    <td>${item.tanggal}</td>
  
      <td>
        <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
          
          <li>
          <a href="#" class="edit" data-target="#new-member-update" data-files-id="${item.id_formulir_spmi}">
          <i class="uil uil-edit"></i>
            </a>
          </li>
          <li>
          <a href="#" class="remove" data-files-id="${item.id_formulir_spmi}">
          <i class="uil uil-trash-alt"></i>
            </a>
          </li>
        </ul>
      </td>
    `;
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const id_formulir_spmi = removeButton.getAttribute("data-files-id");
      if (id_formulir_spmi) {
        deleteFile(id_formulir_spmi);
      } else {
        console.error("id hasil survei untuk Dokumen SPMI tidak ditemukan.");
      }
    });
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const id_formulir_spmi = editButton.getAttribute("data-files-id");
      if (id_formulir_spmi) {
        editData(id_formulir_spmi);
      } else {
        console.error("id hasil survei untuk Dokumen SPMI tidak ditemukan.");
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
    // ShowDataUsersDokumen SPMI(data);
    createPaginationControls(data);
    displayPageData(data, currentPage); // siklusdata(data);
  }
});
function editData(id_formulir_spmi) {
  // Gunakan CihuyDataAPI untuk mengambil data dari server
  CihuyDataAPI(
    apiUrl + `?id_formulir_spmi=${id_formulir_spmi}`,
    token,
    (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
      } else {
        const data = response.data;
        console.log("Data yang diterima:", data);
        const fileData = data.find(
          (item) => item.id_formulir_spmi === parseInt(id_formulir_spmi)
        );
        document.getElementById("judul-update").value = fileData.judul;
        document.getElementById("keterangan-update").value =
          fileData.keterangan;

        // Set nilai idFileToUpdate dengan idFile yang ingin diupdate
        idFileToUpdate = fileData.id_formulir_spmi;

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
const periodeUpdateInput = document.getElementById("periode-update");
const judulUpdateInput = document.getElementById("judul-update");
const fileUpdateInput = document.getElementById("file-update");
const keteranganUpdateInput = document.getElementById("keterangan-update");

const updateDataButton = document.getElementById("updateDataButton");

// Event listener untuk tombol "Update Data"
updateDataButton.addEventListener("click", function () {
  // Ambil data dari input form
  const periode = periodeUpdateInput.value;
  const judul = judulUpdateInput.value;
  const keterangan = keteranganUpdateInput.value;

  const file = fileUpdateInput.files[0]; // Ambil file yang diunggah

  // Tutup modal jika diperlukan
  $("#new-member-update").modal("hide");

  // Tampilkan SweetAlert konfirmasi dengan judul, teks, dan ikon yang berbeda
  Swal.fire({
    title: "Update Files pada Dokumen SPMI?",
    text: "Apakah Anda yakin ingin update Files untuk Dokumen SPMI?", // Teks yang berbeda
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Update",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      // Buat objek data yang akan dikirim ke API sesuai dengan format JSON yang diberikan
      const dataToUpdate = {
        id_periode: parseInt(periode),
        judul: judul,
        file: {
          fileType: "application/pdf", // Ganti dengan tipe file yang sesuai
          payload: "", // Payload akan diisi nanti
        },
        keterangan: keterangan,
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
            apiUrl + `/update?id_formulir_spmi=${idFileToUpdate}`, // Anda mungkin perlu menyesuaikan URL ini
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
          apiUrl + `/update?id_formulir_spmi=${idFileToUpdate}`, // Anda mungkin perlu menyesuaikan URL ini
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

function deleteFile(id_formulir_spmi) {
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
      const apiUrlGetfileById = `https://simbe-dev.ulbi.ac.id/api/v1/formulirspmi/get?id_formulir_spmi=${id_formulir_spmi}`;

      // Lakukan permintaan GET untuk mengambil files berdasarkan id hasil survei
      CihuyDataAPI(apiUrlGetfileById, token, (error, response) => {
        if (error) {
          console.error("Terjadi kesalahan saat mengambil files:", error);
        } else {
          const fileData = response.data;
          if (fileData) {
            // Dapatkan id hasil survei dari data yang diterima
            const FileIDtoDelete = fileData.id_formulir_spmi;

            // Buat URL untuk menghapus files berdasarkan ID files yang telah ditemukan
            const apiUrlfilesDelete = `https://simbe-dev.ulbi.ac.id/api/v1/formulirspmi/delete?id_formulir_spmi=${FileIDtoDelete}`;

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
const apiPostFiles = "https://simbe-dev.ulbi.ac.id/api/v1/formulirspmi/add";
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
const siklusInput = document.getElementById("periode");
const form = document.getElementById("myForm");
const judulInput = document.getElementById("judul");
const fileInput = document.getElementById("file");
const keteranganInput = document.getElementById("keterangan");

// Menambahkan event listener ke tombol Simpan
document
  .getElementById("tambahDataButton")
  .addEventListener("click", async function () {
    // Mendapatkan nilai dari elemen formulir
    const id_periode = siklusInput.value;
    const judul = judulInput.value;
    const file = fileInput.files[0];
    const keterangan = keteranganInput.value;
    // Mengecek apakah semua field telah diisi
    if (!id_periode || !judul || !file) {
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
      title: "Tambahkan File untuk Dokumen SPMI?",
      text: "Apakah Anda yakin ingin menambahkan File untuk Dokumen SPMI?",
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
            id_periode: parseInt(id_periode),
            judul: judul,
            file: {
              fileType: file.type,
              payload: base64Data,
            },
            keterangan: keterangan,
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
            settingsmenu / kepuasantendik.js;
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
