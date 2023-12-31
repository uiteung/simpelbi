// import { ShowDataAMI } from "../js/config/configami.js"
import {
  UrlGetSiklus,
  UrlGetAmi,
  UrlGetUsersFakultas,
  UrlGetUsersProdi,
  UrlGetUsersAuditor,
  UrlPostAmi,
  token,
} from "../js/template/template.js";
import {
  CihuyDataAPI,
  CihuyPostApi,
  CihuyDeleteAPI,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

// Untuk GET Data Profile
populateUserProfile();

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
          ${item.prodi}
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
          ${item.nm_auditor_2}
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
          ${item.tglRtm}
       </div>
    </td>
    <td>
    <div class="userDatatable-content">
       ${item.tglSelesai}
    </div>
 </td>
    <td>
       <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
          <li>
             <a href="#" class="view">
                <i class="uil uil-eye"></i>
             </a>
          </li>
          <li>
             <a href="#" class="edit" data-target="#new-member-update" data-ami-id="${item.idAmi}">
                <i class="uil uil-edit"></i>
             </a>
          </li>
          <li>
             <a href="#" class="remove" data-ami-id=${item.idAmi}>
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
      const idAmi = removeButton.getAttribute("data-ami-id");
      if (idAmi) {
        deleteAmi(idAmi);
      } else {
        console.error("ID AMI tidak ditemukan");
      }
    });
    // Untuk Update Button
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      console.log("Tombol remove diklik");
      const idAmi = editButton.getAttribute("data-ami-id");
      if (idAmi) {
        editData(idAmi);
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
    console.log("Data yang diterima:", data);
    ShowDataAMI(data);
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
        const id_ami = amiData.idAmi;
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
function fakultasData(data) {
  const selectElement = document.getElementById("fakultas");
  // Kosongkan Isi dropdown saat ini
  selectElement.innerHTML = "";

  // Loop data yang diterima dari API
  data.forEach((item) => {
    const optionElement = document.createElement("option");
    optionElement.value = item.id_fakultas;
    optionElement.textContent = `${item.fakultas} - ${item.id_fakultas}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function () {
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
  data.forEach((item) => {
    const optionElement = document.createElement("option");
    optionElement.value = item.id_prodi;
    optionElement.textContent = `${item.prodi_unit} - ${item.id_prodi}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function () {
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
  data.forEach((item) => {
    const optionElement = document.createElement("option");
    optionElement.value = item.idAuditor;
    optionElement.textContent = `${item.auditor} - ${item.idAuditor}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function () {
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

// Untuk ambil nilai dari Anggota 1 ke dropdown
function anggota1Data(data) {
  const selectElement = document.getElementById("anggota1");
  // Kosongkan isi dropdown saat ini
  selectElement.innerHTML = "";

  // Loop data yang diterima dari API
  data.forEach((item) => {
    const optionElement = document.createElement("option");
    optionElement.value = item.idAuditor;
    optionElement.textContent = `${item.auditor} - ${item.idAuditor}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function () {
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
    anggota1Data(data);
  }
});

// Untuk ambil nilai dari Anggota 2 ke dropdown
function anggota2Data(data) {
  const selectElement = document.getElementById("anggota2");
  // Kosongkan isi dropdown saat ini
  selectElement.innerHTML = "";

  // Loop data yang diterima dari API
  data.forEach((item) => {
    const optionElement = document.createElement("option");
    optionElement.value = item.idAuditor;
    optionElement.textContent = `${item.auditor} - ${item.idAuditor}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function () {
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
    anggota2Data(data);
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
    optionElement.textContent = `Tahun ${item.tahun} - ${index + 1}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function () {
    const selectedValue = this.value;
    // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
    console.log("Nilai yang dipilih: ", selectedValue);
  });
}
// Panggil API untuk mendapatkan data siklus
CihuyDataAPI(UrlGetSiklus, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    siklusData(data);
  }
});

// Untuk ambil nilai di form
const Tombol = document.getElementById("buttoninsert");

Tombol.addEventListener("click", async function (e) {
  e.preventDefault();
  console.log("Button Clicked");

  // Untuk Ambil nilai dari elemen
  const fakultasInput = document.getElementById("fakultas").value;
  const prodiInput = document.getElementById("prodi").value;
  const auditorInput = document.getElementById("auditor").value;
  const anggota1Input = document.getElementById("anggota1").value;
  const anggota2Input = document.getElementById("anggota2").value;
  const siklusInput = document.getElementById("siklus").value;

  // Atur nilai status ke "Proses"
  const statusInput = "";

  // Biarkan tglRtm dan tglSelesai kosong
  const tglRtmInput = "";
  const tglSelesaiInput = "";

  const data = {
    idFakultas: parseInt(fakultasInput),
    idProdi: parseInt(prodiInput),
    idAuditorKetua: parseInt(auditorInput),
    idAnggota1: parseInt(anggota1Input),
    idAnggota2: parseInt(anggota2Input),
    idSiklus: parseInt(siklusInput),
    status: statusInput,
    tglRtm: tglRtmInput,
    tglSelesai: tglSelesaiInput,
  };

  // Tutup modal setelah menampilkan SweetAlert
  $("#new-member").modal("hide");

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
      // Mengirimkan Permintaan POST Menggunakan Fungsi CihuyPostApi
      CihuyPostApi(UrlPostAmi, token, data)
        .then((responseText) => {
          console.log("Respon sukses:", responseText);
          // Tutup modal setelah menampilkan SweetAlert
          $("#new-member").modal("hide");
          // Lakukan tindakan lain setelah permintaan POST berhasil
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
    document.getElementById("fakultas-update").value = amiData.idFakultas;
    document.getElementById("prodi-update").value = amiData.idProdi;
    document.getElementById("auditor-update").value = amiData.idAuditorKetua;
    document.getElementById("anggota1-update").value = amiData.idAnggota1;
    document.getElementById("anggota2-update").value = amiData.idAnggota2;
    document.getElementById("siklus-update").value = amiData.idSiklus;

    // Menampilkan modal edit
    const modal = new bootstrap.Modal(
      document.getElementById("new-member-update")
    );
    modal.show();

    // Membuat event listener untuk button update
    const simpanPerubahanButton = document.getElementById("updateDataButton");
    simpanPerubahanButton.addEventListener("click", function () {
      // Untuk ambil nilai dari element form edit
      const fakultasBaru = document.getElementById("fakultas-update").value;
      const prodiBaru = document.getElementById("prodi-update").value;
      const auditorBaru = document.getElementById("auditor-update").value;
      const anggota1Baru = document.getElementById("anggota1-update").value;
      const anggota2Baru = document.getElementById("anggota2-update").value;
      const siklusBaru = document.getElementById("siklus-update").value;

      // Buat const untuk nampung semuanya
      const dataAmiToUpdate = {
        fakultas: parseInt(fakultasBaru),
        prodi: parseInt(prodiBaru),
        nm_auditor_ketua: parseInt(auditorBaru),
        nm_auditor_1: parseInt(anggota1Baru),
        nm_auditor_2: parseInt(anggota2Baru),
        siklus: parseInt(siklusBaru),
      };

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
        window.location.reload();
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
  selectElement.addEventListener("change", function () {
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
    fakultasDataUpdate(data);
  }
});

// Untuk ambil nilai dari PRODI ke dropdown
function prodiDataUpdate(data) {
  const selectElement = document.getElementById("prodi-update");
  // Kosongkan isi dropdown saat ini
  selectElement.innerHTML = "";

  // Loop data yang diterima dari API
  data.forEach((item) => {
    const optionElement = document.createElement("option");
    optionElement.value = item.id_prodi;
    optionElement.textContent = `${item.prodi} - ${item.id_prodi}`;
    selectElement.appendChild(optionElement);
  });
  selectElement.addEventListener("change", function () {
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
  selectElement.addEventListener("change", function () {
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
  selectElement.addEventListener("change", function () {
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
  selectElement.addEventListener("change", function () {
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
  selectElement.addEventListener("change", function () {
    const selectedValue = this.value;
    // Lakukan sesuatu dengan nilai yang dipilih, misalnya, tampilkan di konsol
    console.log("Nilai yang dipilih: ", selectedValue);
  });
}
// Panggil API untuk mendapatkan data siklus
CihuyDataAPI(UrlGetSiklus, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    siklusDataUpdate(data);
  }
});
