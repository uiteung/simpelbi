import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

import {
    token,
    UrlGetAmi,
    UrlGetMekanisme,
    UrlGetAudit,
    UrlGetKesimpulan,
    // UrlGetFoto,
    UrlGetFileProdi,
    UrlGetAmiByProdi,
    UrlGetFotoByProdiunit,
} from "../js/template/template.js";

function ShowDataProsesAMI(dataAmi, mekanismeData, auditData) {
    const tableBody = document.getElementById("content");
    tableBody.innerHTML = "";
    let nomor = 1;

    console.log(dataAmi);

    dataAmi.forEach((item) => {
        const barisBaru = document.createElement("tr");

        // Column: Nomor
        const kolomNo = createTableColumn(`
      <div class="userDatatable-content">
        <table>
          <tr>
            <td>${nomor}</td>
          </tr>
        </table>
      </div>`);
        barisBaru.appendChild(kolomNo);

        // Column: Status AMI
        const statusAmi = getStatusAmi(item, auditData);
        const kolomStatusAmi = createTableColumn(`
      <div class="userDatatable-content">
        <table>
          <tr>
            <td>
              <a href="${statusAmi.link}" style="pointer-events: ${statusAmi.pointerEvents}">
                ${statusAmi.buttonContent}
              </a>
            </td>
          </tr>
        </table>
      </div>`);
        barisBaru.appendChild(kolomStatusAmi);

        // Column: Informasi Audit
        const kolomInformasiAudit = createTableColumn(`
      <div class="userDatatable-content">
        <table>
          <tr >
            <td">Program Studi / Unit: ${item.prodi_unit}</td>
          </tr>
          <tr>
            <td>Fakultas : ${item.fakultas}</td>
          </tr>
          <tr>
            <td>Ketua Auditor : ${item.nm_auditor_ketua}</td>
          </tr>
          <tr>
            <td>Anggota 1 : ${item.nm_auditor_1}</td>
          </tr>
          <tr>
            <td>Anggota 2 : ${
              item.nm_auditor_2 !== undefined ? item.nm_auditor_2 : "-"
            }</td>
          </tr>
          <tr>
            <td>Periode : <span class="custom-button">${
              item.id_siklus
            } -  Tahun ${item.tahun}</span></td>
          </tr>
        </table>
      </div>`);
        barisBaru.appendChild(kolomInformasiAudit);

        // Column: Laporan AMI
        const kolomLaporanAMI = createTableColumn(`
      <button type="button" class="custom-button print-laporan" data-id_ami="${item.id_ami}">
        <i class="fa fa-print"></i> Print Laporan AMI
      </button>`);
        barisBaru.appendChild(kolomLaporanAMI);

        tableBody.appendChild(barisBaru);
        nomor++;
    });

    // Pastikan tombol dengan ID globalButtonId sudah ada di DOM
    const printButton = document.querySelectorAll(".print-laporan");

    printButton.forEach((button) => {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/ami/laporanami";
            const idAmi = button.dataset.id_ami;

            console.log(idAmi);
            console.log(token);

            Swal.fire({
                title: "Konfirmasi Cetak",
                text: "Apakah Anda yakin ingin mencetak laporan AMI?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Cetak",
                cancelButtonText: "Batal",
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: "info",
                        title: "Sedang mencetak laporan AMI",
                        html: "Proses cetak laporan AMI sedang berlangsung. Mohon tunggu.",
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        didOpen: () => Swal.showLoading(),
                    });

                    fetch(apiUrl, {
                            method: "POST",
                            headers: {
                                LOGIN: token,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                id_ami: parseInt(idAmi), // Pastikan dataAmi tersedia dan memiliki id_ami
                            }),
                        })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then((data) => {
                            Swal.close(); // Menutup SweetAlert "Tunggu"

                            if (data.success && data.data.id_docs) {
                                Swal.fire({
                                    title: "Berhasil",
                                    text: "Laporan AMI berhasil dicetak!",
                                    icon: "success",
                                }).then(() => {
                                    try {
                                        // Membuka halaman PDF di tab baru
                                        const newWindow = window.open(data.data.id_docs);

                                        if (!newWindow ||
                                            newWindow.closed ||
                                            typeof newWindow.closed === "undefined"
                                        ) {
                                            // Jika pop-up diblokir, tampilkan pesan
                                            Swal.fire({
                                                title: "Pop-up Diblokir",
                                                text: "Pop-up browser Anda mungkin diblokir. Mohon izinkan akses pop-up dan coba lagi.",
                                                icon: "info",
                                                showConfirmButton: true,
                                            });
                                        }
                                    } catch (error) {
                                        console.error("Error membuka dokumen:", error);
                                        Swal.fire({
                                            title: "Error",
                                            text: "Terjadi kesalahan saat membuka dokumen.",
                                            icon: "error",
                                        });
                                    }
                                });
                            } else {
                                throw new Error("Document ID not found or API failed");
                            }
                        })
                        .catch((error) => {
                            console.error("Error during fetch or processing:", error);
                            Swal.fire({
                                title: "Error",
                                text: "Gagal mencetak laporan AMI. Silakan coba lagi.",
                                icon: "error",
                            });
                        });
                }
            });
        });
    });
}

function createTableColumn(content) {
    const column = document.createElement("td");
    column.innerHTML = content;
    return column;
}

function getStatusAmi(item, auditData) {
    const hasPerbaikan = auditData.some(
        (audit) => audit.id_ami === item.id_ami && audit.status === "Ada Perbaikan"
    );

    const hasSelesai = auditData.some(
        (audit) => item.status === "Selesai"
    );

    if (hasPerbaikan) {
        return {
            buttonContent: '<span class="custom-button">Tindak Lanjut</span>',
            link: `revisi.html?id_ami=${item.id_ami}&id_prodi_unit=${item.id_prodi_unit}`,
            pointerEvents: "auto",
        };
    } else if (hasSelesai){
        return {
            buttonContent: '<span class="custom-button" style="background-color: green">Selesai</span>',
            link: `update-status.html?id_ami=${item.id_ami}&id_prodi_unit=${item.id_prodi_unit}`,
            pointerEvents: "none",
        };
    } else {
        return {
            buttonContent: '<span class="custom-button">Proses</span>',
            link: `update-status.html?id_ami=${item.id_ami}&id_prodi_unit=${item.id_prodi_unit}`,
            pointerEvents: item.status === "Selesai" ? "none" : "auto",
        };
    }
}

// Call the initial function to start the process
getAmiData();

function ShowDokumentasiAmi(data) {
    const tableBody = document.getElementById("dokumentasi");
    tableBody.innerHTML = "";
    let nomor = 1;

    data.forEach((item) => {
        const barisBaru = document.createElement("tr");

        // Isi kolom-kolom tabel dengan data yang diambil
        barisBaru.innerHTML = `
      <td>
      <div class="userDatatable-content">${nomor}</div>
    </td>
        <td>
            <div class="userDatatable-content">${item.prodi_unit}</div>
          </td>
        <td>
        <div class="userDatatable-content">          
        <img src="https://simbe-dev.ulbi.ac.id/static/pictures/${item.foto}" alt="Foto" width="100" height="100">
        </div>
      </td>
        `;

        tableBody.appendChild(barisBaru);
        nomor++;
    });
}

CihuyDataAPI(UrlGetFotoByProdiunit, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data;
        console.log("Data yang diterima:", data);
        ShowDokumentasiAmi(data);
    }
});

function ShowFilesProdi(data) {
    const tableBody = document.getElementById("filesprodi");
    tableBody.innerHTML = "";
    let nomor = 1;

    data.forEach((item) => {
        const barisBaru = document.createElement("tr");

        // Isi kolom-kolom tabel dengan data yang diambil
        barisBaru.innerHTML = `
        <td>
        <div class="userDatatable-content">${nomor}</div>
      </td>
          <td>
              <div class="userDatatable-content">${item.judul}</div>
            </td>
            <td>          
            <a href="https://simbe-dev.ulbi.ac.id/static/pictures/${item.file}" class="btn btn-primary btn-sm" target="_blank">
              Lihat
            </a>
          </td>
          <td>
              <div class="userDatatable-content">${item.tgl}</div>
            </td>
          `;

        tableBody.appendChild(barisBaru);
        nomor++;
    });
}

CihuyDataAPI(UrlGetFileProdi, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data;
        console.log("Data yang diterima:", data);
        ShowFilesProdi(data);
    }
});

// Panggil API untuk mendapatkan data fakultas
CihuyDataAPI(UrlGetAmi, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data.data_query;
        // console.log("Data yang diterima:", data);
        // statusData(data);
    }
});

// Function to retrieve AMI data
function getAmiData() {
    CihuyDataAPI(UrlGetAmiByProdi, token, (error, responseAmi) => {
        if (error) {
            console.error("Terjadi kesalahan:", error);
        } else {
            const dataAmi = responseAmi.data;

            getMekanismeData(dataAmi);
        }
    });
}

// Function to retrieve Mekanisme data
function getMekanismeData(dataAmi) {
    CihuyDataAPI(UrlGetMekanisme, token, (error, responseMekanisme) => {
        if (error) {
            console.error("Terjadi kesalahan:", error);
        } else {
            const mekanismeData = responseMekanisme.data;

            getAuditData(dataAmi, mekanismeData);
        }
    });
}

// Function to retrieve Audit data
function getAuditData(dataAmi, mekanismeData) {
    CihuyDataAPI(UrlGetAudit, token, (error, responseAudit) => {
        if (error) {
            console.error("Terjadi kesalahan:", error);
        } else {
            const auditData = responseAudit.data;

            ShowDataProsesAMI(dataAmi, mekanismeData, auditData);
            // getKesimpulanData(dataAmi, mekanismeData, auditData);
        }
    });
}

// Function to retrieve Kesimpulan data and display the data
// function getKesimpulanData(dataAmi, mekanismeData, auditData) {
//   CihuyDataAPI(UrlGetKesimpulan, token, (error, responseKesimpulan) => {
//     if (error) {
//       console.error("Terjadi kesalahan:", error);
//     } else {
//       const kesimpulanData = responseKesimpulan.data;

//       console.log("Data Kesimpulan yang diterima:", kesimpulanData);
//       ShowDataProsesAMI(dataAmi, mekanismeData, auditData, kesimpulanData);
//     }
//   });
// }

function updateElementWithData(data) {
    // Mengambil elemen-elemen HTML yang ingin diubah
    const paraElement = document.querySelector(".banner-feature__para");
    const namaprofile = document.getElementById("namaprofile");
    namaprofile.textContent = `Welcome Back ${data.data.nama_user}!`;
    paraElement.textContent = data.data.email;
}

// URL API dan token
const apiUrlprofiles = "https://simbe-dev.ulbi.ac.id/api/v1/profile";

// Panggil fungsi untuk mengambil data
CihuyDataAPI(apiUrlprofiles, token, (error, data) => {
    if (error) {
        console.error("Error fetching data:", error);
    } else {
        // Panggil fungsi untuk memperbarui elemen HTML dengan data yang diterima
        updateElementWithData(data);
    }
});

// Call the initial function to start the process
getAmiData();

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