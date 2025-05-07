// import { ShowDataAMI } from "../js/config/configami.js"
import {
    UrlGetSiklus,
    UrlGetAmi,
    UrlGetUsersFakultas,
    UrlGetUsersProdi,
    UrlGetUsersAuditor,
    UrlPostAmi,
    token,
    UrlGetStandar,
} from "../js/template/template.js";
import {
    CihuyDataAPI,
    CihuyPostApi,
    CihuyDeleteAPI,
    CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";
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

const formatDate = (params) => {
    const dateObj = new Date(params);

    // Format ulang tanggal
    return dateObj.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

// Untuk GET All Data
export function ShowDataAMI(data) {
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
       <div class="userDatatable-content">
          ${item.prodi_unit}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.nm_auditor_ketua}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.nm_auditor_1}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.nm_auditor_2 !== undefined ? item.nm_auditor_2 : "-"}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.tahun}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${item.status}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
       ${formatDate(item.restanggal_pelaksanaan)}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${formatDate(item.tgl_rtm)}
       </div>
    </td>
    <td>
       <div class="userDatatable-content">
          ${formatDate(item.tgl_selesai)}
       </div>
    </td>
    <td>
       <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
          <li>
             <a href="#" class="edit" data-target="#new-member-update" data-ami-id="${
               item.id_ami
             }">
                <i class="uil uil-edit"></i>
             </a>
          </li>
          <li>
             <a href="#" class="remove" data-ami-id=${item.id_ami}>
                <i class="uil uil-trash-alt"></i>
             </a>
          </li>
       </ul>
    </td>
      `;
        // Untuk Remove Button
        const removeButton = barisBaru.querySelector(".remove");
        removeButton.addEventListener("click", () => {
            console.log("Tombol remove diklik");
            const id_ami = removeButton.getAttribute("data-ami-id");
            if (id_ami) {
                deleteAmi(id_ami);
            } else {
                console.error("ID AMI tidak ditemukan");
            }
        });
        // Untuk Update Button
        const editButton = barisBaru.querySelector(".edit");
        editButton.addEventListener("click", () => {
            console.log("Tombol remove diklik");
            const id_ami = editButton.getAttribute("data-ami-id");
            if (id_ami) {
                editData(id_ami);
            } else {
                console.error("ID AMI tidak ditemukan");
            }
        });

        tableBody.appendChild(barisBaru);
        nomor++;
    });
}

CihuyDataAPI(UrlGetAmi, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data;
        console.log("Data AMI yang diterima:", data);
        // console.log("Data AMI yang diterima:", data);
        ShowDataAMI(data.data_query);
    }
});

// Untuk DELETE Data AMI menggunakan API Fix
function deleteAmi(id_ami) {
    // Buat URL untuk mengambil data Ami berdasarkan id
    const UrlGetAmiById = `https://simbe-dev.ulbi.ac.id/api/v1/ami/get?id_ami=${id_ami}`;

    // Lakukan permintaan GET untuk mengambil standar berdasarkan id
    CihuyDataAPI(UrlGetAmiById, token, (error, response) => {
        if (error) {
            console.error("Terjadi kesalahan saat mengambil Proses AMI: ", error);
        } else {
            const amiData = response.data;
            if (amiData) {
                // Dapatkan id admin dari data yang diterima
                const id_ami = amiData.id_ami;
                const UrlDeleteAmi = `https://simbe-dev.ulbi.ac.id/api/v1/ami/delete?id_ami=${id_ami}`;

                // Menampilkan pesan konfirmasi SweetAlert
                Swal.fire({
                    title: "Hapus Proses AMI?",
                    text: "Apakah Anda yakin ingin menghapus Proses AMI?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Ya, Hapuskan",
                    cancelButtonText: "Batal",
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Lakukan permintaan DELETE
                        CihuyDeleteAPI(UrlDeleteAmi, token, (deleteError, deleteData) => {
                            if (deleteError) {
                                console.error(
                                    "Terjadi kesalahan saat menghapus Proses AMI:",
                                    deleteError
                                );
                                Swal.fire({
                                    icon: "error",
                                    title: "Oops...",
                                    text: "Terjadi kesalahan saat menghapus Proses AMI!",
                                });
                            } else {
                                console.log("Proses AMI berhasil dihapus:", deleteData);
                                Swal.fire({
                                    icon: "success",
                                    title: "Sukses!",
                                    text: "Proses AMI berhasil dihapus",
                                    showConfirmButton: false,
                                    timer: 1500,
                                }).then(() => {
                                    // Refresh halaman setelah menutup popup
                                    window.location.reload();
                                });
                            }
                        });
                    }
                });
            } else {
                console.error("Proses AMI tidak ditemukan.");
            }
        }
    });
}

// Untuk POST Data
// Untuk ambil nilai dari FAKULTAS ke dropdown
function prodiAtauUnit(data) {
    const selectElement = document.getElementById("prodiatauunit");
    // Kosongkan Isi dropdown saat ini
    selectElement.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.value = "";
    defaultOption.textContent = " -- Silahkan Pilih --";
    selectElement.appendChild(defaultOption);
    // Loop data yang diterima dari API
    data.forEach((item) => {
        const optionElement = document.createElement("option");
        optionElement.value = item.id_prodi;
        optionElement.textContent = `${item.id_prodi} - ${item.prodi_unit}`;
        selectElement.appendChild(optionElement);
    });
    selectElement.addEventListener("change", function() {
        const selectedValue = this.value;
        // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
        console.log("Nilai prodiunit yang dipilih: ", selectedValue);
    });
}
// Panggil API untuk mendapatkan data fakultas
CihuyDataAPI(UrlGetUsersProdi, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data;
        // console.log("Data prodiunit yang diterima:", data);
        prodiAtauUnit(data);
    }
});

function fakultas(data) {
    const selectElement = document.getElementById("fakultas");
    // Kosongkan Isi dropdown saat ini
    selectElement.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.value = "";
    defaultOption.textContent = " -- Silahkan Pilih --";
    selectElement.appendChild(defaultOption);
    // Loop data yang diterima dari API
    data.forEach((item) => {
        const optionElement = document.createElement("option");
        optionElement.value = item.id_fakultas;
        optionElement.textContent = `${item.id_fakultas} - ${item.fakultas}`;
        selectElement.appendChild(optionElement);
    });
    selectElement.addEventListener("change", function() {
        const selectedValue = this.value;
        // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
        console.log("Nilai fakultas yang dipilih: ", selectedValue);
    });
}
// Panggil API untuk mendapatkan data fakultas
CihuyDataAPI(UrlGetUsersFakultas, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data;
        // console.log("Data fakultas yang diterima:", data);
        fakultas(data);
    }
});

// // Untuk ambil nilai dari PRODI ke dropdown
// function prodiData(data) {
//   const selectElement = document.getElementById("prodi");
//   // Kosongkan isi dropdown saat ini
//   selectElement.innerHTML = "";

//   // Loop data yang diterima dari API
//   data.forEach((item) => {
//     const optionElement = document.createElement("option");
//     optionElement.value = item.id_prodi;
//     optionElement.textContent = `${item.prodi_unit} - ${item.id_prodi}`;
//     selectElement.appendChild(optionElement);
//   });
//   selectElement.addEventListener("change", function () {
//     const selectedValue = this.value;
//     // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
//     console.log("Nilai yang dipilih: ", selectedValue);
//   });
// }
// // Panggil API untuk mendapatkan data prodi
// CihuyDataAPI(UrlGetUsersProdi, token, (error, response) => {
//   if (error) {
//     console.error("Terjadi kesalahan:", error);
//   } else {
//     const data = response.data;
// console.log("Data yang diterima:", data);
//     prodiData(data);
//   }
// });

// Untuk ambil nilai dari AUDITOR ke dropdown
function auditorData(data) {
    const selectElement = document.getElementById("auditor");
    // Kosongkan isi dropdown saat ini
    selectElement.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.value = "";
    defaultOption.textContent = " -- Silahkan Pilih --";
    selectElement.appendChild(defaultOption);
    // Loop data yang diterima dari API
    data.forEach((item) => {
        const optionElement = document.createElement("option");
        optionElement.value = item.idAuditor;
        optionElement.textContent = `${item.auditor} - ${item.idAuditor}`;
        selectElement.appendChild(optionElement);
    });
    selectElement.addEventListener("change", function() {
        const selectedValue = this.value;
        // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
        console.log("Nilai auditor yang dipilih: ", selectedValue);
    });
}
// Panggil API untuk mendapatkan data auditor
CihuyDataAPI(UrlGetUsersAuditor, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data;
        // console.log("Data auditor yang diterima:", data);
        auditorData(data);
    }
});

// Untuk ambil nilai dari Anggota 1 ke dropdown
function anggota1Data(data) {
    const selectElement = document.getElementById("anggota1");
    // Kosongkan isi dropdown saat ini
    selectElement.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.value = "";
    defaultOption.textContent = " -- Silahkan Pilih --";
    selectElement.appendChild(defaultOption);
    // Loop data yang diterima dari API
    data.forEach((item) => {
        const optionElement = document.createElement("option");
        optionElement.value = item.idAuditor;
        optionElement.textContent = `${item.auditor} - ${item.idAuditor}`;
        selectElement.appendChild(optionElement);
    });
    selectElement.addEventListener("change", function() {
        const selectedValue = this.value;
        // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
        console.log("Nilai anggota1 yang dipilih: ", selectedValue);
    });
}
// Panggil API untuk mendapatkan data auditor
CihuyDataAPI(UrlGetUsersAuditor, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data;
        // console.log("Data anggota1 yang diterima:", data);
        anggota1Data(data);
    }
});

// Untuk ambil nilai dari Anggota 2 ke dropdown
function anggota2Data(data) {
    const selectElement = document.getElementById("anggota2");
    // Kosongkan isi dropdown saat ini
    selectElement.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.value = "";
    defaultOption.textContent = " -- Silahkan Pilih --";
    selectElement.appendChild(defaultOption);
    // Loop data yang diterima dari API
    data.forEach((item) => {
        const optionElement = document.createElement("option");
        optionElement.value = item.idAuditor;
        optionElement.textContent = `${item.auditor} - ${item.idAuditor}`;
        selectElement.appendChild(optionElement);
    });
    selectElement.addEventListener("change", function() {
        const selectedValue = this.value;
        // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
        console.log("Nilai anggota2 yang dipilih: ", selectedValue);
    });
}
// Panggil API untuk mendapatkan data auditor
CihuyDataAPI(UrlGetUsersAuditor, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data;
        // console.log("Data anggota2 yang diterima:", data);
        anggota2Data(data);
    }
});

// Untuk ambil nilai dari SIKLUS ke dropdown
function siklusData(data) {
    const selectElement = document.getElementById("siklus");
    // Kosongkan isi dropdown saat ini
    selectElement.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.value = "";
    defaultOption.textContent = " -- Silahkan Pilih --";
    selectElement.appendChild(defaultOption);
    // Loop data yang diterima dari API
    data.forEach((item, index) => {
        const optionElement = document.createElement("option");
        optionElement.value = index + 1;
        optionElement.textContent = `Tahun ${item.tahun} - ${index + 1}`;
        selectElement.appendChild(optionElement);
    });
    selectElement.addEventListener("change", function() {
        const selectedValue = this.value;
        // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
        console.log("Nilai siklus yang dipilih: ", selectedValue);
    });
}
// Panggil API untuk mendapatkan data siklus
CihuyDataAPI(UrlGetSiklus, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data;
        // console.log("Data siklus yang diterima:", data);
        siklusData(data);
    }
});

// function standar(data) {
//   const selectElement = document.getElementById("standar");
//   // Kosongkan isi dropdown saat ini
//   selectElement.innerHTML = "";
//   const defaultOption = document.createElement("option");
//   defaultOption.disabled = true;
//   defaultOption.selected = true;
//   defaultOption.value = "";
//   defaultOption.textContent = " -- Silahkan Pilih --";
//   selectElement.appendChild(defaultOption);
//   // Loop data yang diterima dari API
//   data.forEach((item) => {
//     const optionElement = document.createElement("option");

//     optionElement.value = item.id_standar;
//     optionElement.textContent = `${item.standar} `;
//     selectElement.appendChild(optionElement);
//   });
//   selectElement.addEventListener("change", function () {
//     const selectedValue = this.value;
//     // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
//     console.log("Nilai yang dipilih: ", selectedValue);
//   });
// }
// Panggil API untuk mendapatkan data auditor
// CihuyDataAPI(UrlGetStandar, token, (error, response) => {
//   if (error) {
//     console.error("Terjadi kesalahan:", error);
//   } else {
//     const data = response.data;
//     console.log("standar Data yang diterima: ", data);
//     standar(data);
//   }
// });

// Untuk ambil nilai di form
const Tombol = document.getElementById("buttoninsert");

Tombol.addEventListener("click", async function(e) {
    e.preventDefault();

    // Untuk Ambil nilai dari elemen
    const fakultasInput = document.getElementById("fakultas").value;
    const prodiunitInput = document.getElementById("prodiatauunit").value;
    const auditorInput = document.getElementById("auditor").value;
    const anggota1Input = document.getElementById("anggota1").value;
    const anggota2Input = document.getElementById("anggota2").value;
    const siklusInput = document.getElementById("siklus").value;
    const tanggalPelaksanaan =
        document.getElementById("tanggalPelaksanaan").value;
    // const standar = document.getElementById("standar").value;

    // Atur nilai status ke "Proses"
    const statusInput = "";
    // const id_fakultas = null;
    // Biarkan tglRtm dan tglSelesai kosong
    const tglRtmInput = "";
    const tglSelesaiInput = "";

    const data = {
        id_fakultas: parseInt(fakultasInput),
        id_prodi_unit: parseInt(prodiunitInput),
        id_auditor_ketua: parseInt(auditorInput),
        id_anggota1: parseInt(anggota1Input),
        id_anggota2: parseInt(anggota2Input),
        id_siklus: parseInt(siklusInput),
        tanggal_pelaksanaan: tanggalPelaksanaan,
        // id_standar: parseInt(standar),

        status: statusInput,
        tglRtm: tglRtmInput,
        tglSelesai: tglSelesaiInput,
    };

    // console.log(data);

    // Tutup modal setelah menampilkan SweetAlert
    $("#new-member").modal("hide");

    console.log("Token yang dikirim:", token);
    // Menampilkan pesan konfirmasi SweetAlert
    Swal.fire({
        title: "Tambahkan AMI?",
        text: "Apakah Anda yakin ingin menambahkan AMI?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Tambahkan",
        cancelButtonText: "Batal",
    }).then((result) => {
        if (result.isConfirmed) {
            if (!token || token.trim() === "") {
                console.error("Token LOGIN kosong atau tidak valid.");
                Swal.fire({
                    icon: "error",
                    title: "Token Tidak Valid",
                    text: "Token LOGIN tidak tersedia. Silakan autentikasi ulang.",
                });
                return;
            }

            fetch(UrlPostAmi, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        login: token, // Header LOGIN untuk autentikasi
                    },
                    body: JSON.stringify(data), // Data yang dikirim dalam format JSON
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json(); // Parsing respons ke JSON
                })
                .then((responseText) => {
                    console.log("Respon sukses:", responseText);
                    // Tutup modal setelah menampilkan SweetAlert
                    $("#new-member").modal("hide");
                    Swal.fire({
                        icon: "success",
                        title: "Sukses!",
                        text: "Proses AMI berhasil ditambahkan",
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(() => {
                        // Reload halaman
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
        }
    });
});

// Untuk PUT Data dengan menggunakan API
function getAmiDataById(id_ami, callback) {
    const UrlGetAmiById = `https://simbe-dev.ulbi.ac.id/api/v1/ami/get?id_ami=${id_ami}`;

    CihuyDataAPI(UrlGetAmiById, token, (error, response) => {
        if (error) {
            console.error("Terjadi kesalahan saat mengambil data : ", error);
            callback(error, null);
        } else {
            const amiData = response.data;
            console.log("update data", amiData);

            callback(null, amiData);
        }
    });
}

function editData(id_ami) {
    getAmiDataById(id_ami, (error, amiData) => {
        if (error) {
            console.error("Gagal mengambil data AMI : ", error);
            return;
        }
        // Untuk ambil nilai dari form
        document.getElementById("prodiatauunit-update").value =
            amiData.id_prodi_unit;
        document.getElementById("fakultas-update").value = amiData.id_fakultas;
        document.getElementById("auditor-update").value = amiData.id_auditor_ketua;
        document.getElementById("anggota1-update").value = amiData.id_anggota1;
        document.getElementById("anggota2-update").value = amiData.id_anggota2;
        document.getElementById("siklus-update").value = amiData.id_siklus;
        document.getElementById("tanggalPelaksanaan-update").value =
            amiData.restanggal_pelaksanaan;
        // document.getElementById("prodi-update").value = amiData.idProdi;

        // Menampilkan modal edit
        const modal = new bootstrap.Modal(
            document.getElementById("new-member-update")
        );
        modal.show();

        // Membuat event listener untuk button update
        const simpanPerubahanButton = document.getElementById("updateDataButton");
        simpanPerubahanButton.addEventListener("click", function() {
            // Untuk ambil nilai dari element form edit
            // const prodiatauunitBaru = document.getElementById("prodiatauunit-update").value;
            const fakultasBaru = document.getElementById("fakultas-update").value;
            const prodiBaru = document.getElementById("prodiatauunit-update").value;
            const auditorBaru = document.getElementById("auditor-update").value;
            const anggota1Baru = document.getElementById("anggota1-update").value;
            const anggota2Baru = document.getElementById("anggota2-update").value;
            const siklusBaru = document.getElementById("siklus-update").value;
            const tanggalPelaksanaan = document.getElementById(
                "tanggalPelaksanaan-update"
            ).value;

            // Buat const untuk nampung semuanya
            const dataAmiToUpdate = {
                id_prodi_unit: parseInt(prodiBaru),
                id_fakultas: parseInt(fakultasBaru),
                nm_auditor_ketua: parseInt(auditorBaru),
                nm_auditor_1: parseInt(anggota1Baru),
                nm_auditor_2: parseInt(anggota2Baru),
                id_siklus: parseInt(siklusBaru),
                tanggal_pelaksanaan: tanggalPelaksanaan,
            };

            console.log(dataAmiToUpdate);

            // Hide modal ketika sudah selesai isi
            $("#new-member-update").modal("hide");

            // Tampilkan SweetAlet konfirmasi sebelum mengirim permintaan
            Swal.fire({
                title: "Update Proses AMI?",
                text: "Apakah Anda yakin ingin update Proses AMI?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Ya, Update",
                cancelButtonText: "Bata;",
            }).then((result) => {
                if (result.isConfirmed) {
                    sendUpdateAmi(id_ami, dataAmiToUpdate, modal);
                }
            });
        });
    });
}
// function untuk kirim update data
function sendUpdateAmi(id_ami, dataAmiToUpdate, modal) {
    const UrlPutAmi = `https://simbe-dev.ulbi.ac.id/api/v1/ami/update?id_ami=${id_ami}`;

    CihuyUpdateApi(UrlPutAmi, token, dataAmiToUpdate, (error, responseText) => {
        if (error) {
            console.error("Terjadi kesalahan saat update data AMI : ", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Terjadi kesalahan saat update data AMI",
            });
        } else {
            console.log("Respon sukses :", responseText);
            // Tutup modal
            modal.hide();
            // Tampilkan Sweet Alert sukses
            Swal.fire({
                icon: "success",
                title: "Sukses!",
                text: "Data Proses AMI berhasil diperbarui",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                // window.location.reload();
            });
        }
    });
}

// Untuk ambil nilai dari FAKULTAS ke dropdown
function fakultasDataUpdate(data) {
    const selectElement = document.getElementById("fakultas-update");
    // Kosongkan Isi dropdown saat ini
    selectElement.innerHTML = "";

    // Loop data yang diterima dari API
    data.forEach((item) => {
        const optionElement = document.createElement("option");
        optionElement.value = item.id_fakultas;
        optionElement.textContent = `${item.fakultas} - ${item.id_fakultas}`;
        selectElement.appendChild(optionElement);
    });
    selectElement.addEventListener("change", function() {
        const selectedValue = this.value;
        // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
        console.log("Nilai fakultas-update yang dipilih: ", selectedValue);
    });
}
// Panggil API untuk mendapatkan data fakultas
CihuyDataAPI(UrlGetUsersFakultas, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data;
        // console.log("Data fakultas-update yang diterima:", data);
        fakultasDataUpdate(data);
    }
});

// Untuk ambil nilai dari PRODI ke dropdown
function prodiDataUpdate(data) {
    const selectElement = document.getElementById("prodiatauunit-update");
    // Kosongkan isi dropdown saat ini
    selectElement.innerHTML = "";

    // Loop data yang diterima dari API
    data.forEach((item) => {
        const optionElement = document.createElement("option");
        optionElement.value = item.id_prodi;
        optionElement.textContent = `${item.id_prodi} - ${item.prodi_unit}`;
        selectElement.appendChild(optionElement);
    });
    selectElement.addEventListener("change", function() {
        const selectedValue = this.value;
        // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
        console.log("Nilai prodiatauunit-update yang dipilih: ", selectedValue);
    });
}
// Panggil API untuk mendapatkan data prodi
CihuyDataAPI(UrlGetUsersProdi, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data;
        // console.log("Data prodiatauunit-update yang diterima:", data);
        prodiDataUpdate(data);
    }
});

// Untuk ambil nilai dari AUDITOR ke dropdown
function auditorDataUpdate(data) {
    const selectElement = document.getElementById("auditor-update");
    // Kosongkan isi dropdown saat ini
    selectElement.innerHTML = "";

    // Loop data yang diterima dari API
    data.forEach((item) => {
        const optionElement = document.createElement("option");
        optionElement.value = item.idAuditor;
        optionElement.textContent = `${item.auditor} - ${item.idAuditor}`;
        selectElement.appendChild(optionElement);
    });
    selectElement.addEventListener("change", function() {
        const selectedValue = this.value;
        // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
        console.log("Nilai auditor-update yang dipilih: ", selectedValue);
    });
}
// Panggil API untuk mendapatkan data auditor
CihuyDataAPI(UrlGetUsersAuditor, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data;
        // console.log("Data auditor-update yang diterima:", data);
        auditorDataUpdate(data);
    }
});

// Untuk ambil nilai dari Anggota 1 ke dropdown
function anggota1DataUpdate(data) {
    const selectElement = document.getElementById("anggota1-update");
    // Kosongkan isi dropdown saat ini
    selectElement.innerHTML = "";

    // Loop data yang diterima dari API
    data.forEach((item) => {
        const optionElement = document.createElement("option");
        optionElement.value = item.idAuditor;
        optionElement.textContent = `${item.auditor} - ${item.idAuditor}`;
        selectElement.appendChild(optionElement);
    });
    selectElement.addEventListener("change", function() {
        const selectedValue = this.value;
        // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
        console.log("Nilai anggota1-update yang dipilih: ", selectedValue);
    });
}
// Panggil API untuk mendapatkan data auditor
CihuyDataAPI(UrlGetUsersAuditor, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data;
        // console.log("Data anggota1-update yang diterima:", data);
        anggota1DataUpdate(data);
    }
});

// Untuk ambil nilai dari Anggota 2 ke dropdown
function anggota2DataUpdate(data) {
    const selectElement = document.getElementById("anggota2-update");
    // Kosongkan isi dropdown saat ini
    selectElement.innerHTML = "";

    // Loop data yang diterima dari API
    data.forEach((item) => {
        const optionElement = document.createElement("option");
        optionElement.value = item.idAuditor;
        optionElement.textContent = `${item.auditor} - ${item.idAuditor}`;
        selectElement.appendChild(optionElement);
    });
    selectElement.addEventListener("change", function() {
        const selectedValue = this.value;
        // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
        console.log("Nilai anggota2-update yang dipilih: ", selectedValue);
    });
}
// Panggil API untuk mendapatkan data auditor
CihuyDataAPI(UrlGetUsersAuditor, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data;
        // console.log("Data anggota2-update yang diterima:", data);
        anggota2DataUpdate(data);
    }
});

// Untuk ambil nilai dari SIKLUS ke dropdown
function siklusDataUpdate(data) {
    const selectElement = document.getElementById("siklus-update");
    // Kosongkan isi dropdown saat ini
    selectElement.innerHTML = "";

    // Loop data yang diterima dari API
    data.forEach((item, index) => {
        const optionElement = document.createElement("option");
        optionElement.value = index + 1;
        optionElement.textContent = `Tahun ${item.tahun} - ${index + 1}`;
        selectElement.appendChild(optionElement);
    });
    selectElement.addEventListener("change", function() {
        const selectedValue = this.value;
        // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
        console.log("Nilai siklus-update yang dipilih: ", selectedValue);
    });
}
// Panggil API untuk mendapatkan data siklus
CihuyDataAPI(UrlGetSiklus, token, (error, response) => {
    if (error) {
        console.error("Terjadi kesalahan:", error);
    } else {
        const data = response.data;
        //  console.log("Data siklus-update yang diterima:", data);
        siklusDataUpdate(data);
    }
});

// function handlePilihanChange() {
//   var pilihanElement = document.getElementById("pilihan");
//   var prodiFormGroup = document.getElementById("prodiFormGroup");
//   var fakultasFormGroup = document.getElementById("fakultasFormGroup");
//   var unitFormGroup = document.getElementById("unitFormGroup");

//   // Menyembunyikan semua form terlebih dahulu
//   prodiFormGroup.style.display = "none";
//   fakultasFormGroup.style.display = "none";
//   unitFormGroup.style.display = "none";

//   // Menampilkan form yang sesuai dengan pemilihan
//   if (pilihanElement.value === "prodi") {
//     prodiFormGroup.style.display = "block";
//     fakultasFormGroup.style.display = "block";
//   } else if (pilihanElement.value === "unit") {
//     unitFormGroup.style.display = "block";
//   }
// }

// // Menambahkan event listener untuk pemilihan
// document
//   .getElementById("pilihan")
//   .addEventListener("change", handlePilihanChange);

// // Inisialisasi tampilan awal berdasarkan pemilihan awal
// handlePilihanChange();
// Fungsi untuk mengekspor data ke Excel

// Fungsi untuk mengekspor data ke dalam file Excel
// Fungsi untuk mendapatkan data yang akan diekspor

// function exportToExcel(data, filename) {
//   const workbook = XLSX.utils.book_new();
//   const worksheet = XLSX.utils.json_to_sheet(data);
//   XLSX.utils.book_append_sheet(workbook, worksheet, "AMI Data");
//   XLSX.writeFile(workbook, filename);
// }

// // Function untuk mengekspor data ke CSV
// function exportToCSV(data, filename) {
//   const csv = Papa.unparse(data);
//   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//   const csvURL = window.URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = csvURL;
//   link.setAttribute("download", filename + ".csv");
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }

// // Function untuk mencetak data
// function printData(data) {
//   let printContent = `
//     <h1>AMI Data</h1>
//     <table border="1">
//       <thead>
//         <tr>
//           <th>No</th>
//           <th>Fakultas</th>
//           <th>Program Studi/Unit</th>
//           <th>Nama Auditor Ketua</th>
//           <th>Nama Auditor 1</th>
//           <th>Nama Auditor 2</th>
//           <th>Tahun</th>
//           <th>Status</th>
//           <th>Tanggal RTM</th>
//           <th>Tanggal Selesai</th>
//         </tr>
//       </thead>
//       <tbody>
//   `;

//   data.forEach((item, index) => {
//     printContent += `
//       <tr>
//         <td>${index + 1}</td>
//         <td>${item.fakultas}</td>
//         <td>${item.prodi_unit}</td>
//         <td>${item.nm_auditor_ketua}</td>
//         <td>${item.nm_auditor_1}</td>
//         <td>${item.nm_auditor_2}</td>
//         <td>${item.tahun}</td>
//         <td>${item.status}</td>
//         <td>${item.tgl_rtm}</td>
//         <td>${item.tgl_selesai}</td>
//       </tr>
//     `;
//   });

//   printContent += `
//       </tbody>
//     </table>
//   `;

//   const printWindow = window.open("", "_blank");
//   printWindow.document.write(`
//     <html>
//       <head>
//         <title>AMI Data - Cetak</title>
//         <style>
//           table {
//             border-collapse: collapse;
//             width: 100%;
//           }
//           th, td {
//             border: 1px solid #dddddd;
//             text-align: left;
//             padding: 8px;
//           }
//           h1 {
//             text-align: center;
//           }
//         </style>
//       </head>
//       <body>
//         ${printContent}
//       </body>
//     </html>
//   `);

//   printWindow.document.close();
//   printWindow.print();
// }

// // Function untuk mendapatkan dan memproses data AMI
// function processDataAndExport(exportType, filename) {
//   CihuyDataAPI(UrlGetAmi, token, (error, response) => {
//     if (error) {
//       console.error("Terjadi kesalahan:", error);
//     } else {
//       const data = response.data;
// console.log("Data yang diterima:", data);

//       // Panggil fungsi sesuai dengan jenis ekspor yang diinginkan
//       switch (exportType) {
//         case "excel":
//           exportToExcel(data, filename + ".xlsx");
//           break;
//         case "csv":
//           exportToCSV(data, filename);
//           break;
//         case "print":
//           printData(data);
//           break;
//         default:
//           console.error("Jenis ekspor tidak valid");
//       }
//     }
//   });
// }

// // Panggil fungsi ini ketika tombol Ekspor Excel diklik
// document.getElementById("exportexcel").addEventListener("click", function () {
//   processDataAndExport("excel", "ami_export");
// });

// // Panggil fungsi ini ketika tombol Ekspor CSV diklik
// document.getElementById("exportcsv").addEventListener("click", function () {
//   processDataAndExport("csv", "ami_export");
// });

// // Panggil fungsi ini ketika tombol Cetak diklik
// document.getElementById("print").addEventListener("click", function () {
//   processDataAndExport("print");
// });