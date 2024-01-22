// import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";
// import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";

// import {
//   token,
//   UrlGetAmi,
//   // UrlGetMekanisme,
//   // UrlGetAudit,
//   // UrlGetKesimpulan,
//   // UrlGetFoto,
// } from "../js/template/template.js";

// let dataAmi;

// function createColumn(content) {
//   const column = document.createElement("td");
//   column.innerHTML = `<div class="userDatatable-content">${content}</div>`;
//   return column;
// }

// // Function to fetch the list of audit data
// function fetchAuditList(idAmiNya, callback) {
//   CihuyDataAPI(
//     `https://simbe-dev.ulbi.ac.id/api/v1/audit`,
//     token,
//     (error, response) => {
//       if (error) {
//         console.error("Terjadi kesalahan:", error);
//         callback(error, null);
//         return;
//       }

//       if (response.success) {
//         // Check if the specific id_ami exists in the response data
//         const auditExists = response.data.some(
//           (audit) => audit.id_ami === idAmiNya
//         );

//         // Call the callback with the result
//         callback(null, auditExists);
//       } else {
//         // Data doesn't exist, call the callback with false
//         callback(null, false);
//       }
//     }
//   );
// }

// // Function to handle the audit section
// function handleAuditSection(idAmi, idProdiUnit) {
//   const auditButtonContainer = document.createElement("td");

//   // Fetch the list of audit data
//   fetchAuditList(idAmi, (error, auditExists) => {
//     if (error) {
//       console.error("Terjadi kesalahan:", error);
//       return;
//     }

//     // Check if there is any audit data
//     if (auditExists) {
//       // Data exists, create a button with a link to pengawasan-audit.html
//       const auditButton = document.createElement("button");
//       auditButton.type = "button";
//       auditButton.className = "success-button";
//       auditButton.innerHTML = "Sudah Diisi";
//       auditButton.addEventListener("click", () => {
//         window.location.href = `pengawasan-audit.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
//       });
//       auditButtonContainer.appendChild(auditButton);
//     } else {
//       // Data doesn't exist, create a button with a link to pengawasan-audit-tambah.html
//       const tambahAuditButton = document.createElement("button");
//       tambahAuditButton.type = "button";
//       tambahAuditButton.className = "custom-button";
//       tambahAuditButton.innerHTML = "Belum Diisi";
//       tambahAuditButton.addEventListener("click", () => {
//         window.location.href = `pengawasan-audit-tambah.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
//       });
//       auditButtonContainer.appendChild(tambahAuditButton);
//     }
//   });

//   return auditButtonContainer;
// }
// function fetchKesimpulanData(idAmiNya, callback) {
//   CihuyDataAPI(
//     `https://simbe-dev.ulbi.ac.id/api/v1/kesimpulan/getbyami?id_ami=${idAmiNya}`,
//     token,
//     (error, response) => {
//       if (error) {
//         console.error("Terjadi kesalahan:", error);
//         callback(error, null);
//         return;
//       }

//       if (response.success) {
//         // Check if the data exists in the response
//         const kesimpulanData = response.data;
//         const kesimpulanExists = kesimpulanData !== null;

//         // Call the callback with the result
//         callback(null, kesimpulanExists, kesimpulanData);
//       } else {
//         // Data doesn't exist, call the callback with false
//         callback(null, false, null);
//       }
//     }
//   );
// }

// // Function to handle the kesimpulan section
// function handleKesimpulanSection(idAmi, idProdiUnit) {
//   const kesimpulanButtonContainer = document.createElement("td");

//   // Fetch the kesimpulan data
//   fetchKesimpulanData(idAmi, (error, kesimpulanExists, kesimpulanData) => {
//     if (error || !kesimpulanExists) {
//       // Error or kesimpulan data doesn't exist, create a button with a link to pengawasan-kesimpulan-tambah.html
//       const tambahKesimpulanButton = document.createElement("button");
//       tambahKesimpulanButton.type = "button";
//       tambahKesimpulanButton.className = "custom-button";
//       tambahKesimpulanButton.innerHTML = "Belum Diisi";
//       tambahKesimpulanButton.addEventListener("click", () => {
//         window.location.href = `pengawasan-kesimpulan-add.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
//       });
//       kesimpulanButtonContainer.appendChild(tambahKesimpulanButton);
//     } else {
//       // Data exists, create a button with a link to pengawasan-kesimpulan.html
//       const kesimpulanButton = document.createElement("button");
//       kesimpulanButton.type = "button";
//       kesimpulanButton.className = "success-button";
//       kesimpulanButton.innerHTML = "Sudah Diisi";
//       kesimpulanButton.addEventListener("click", () => {
//         window.location.href = `pengawasan-kesimpulan.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
//       });
//       kesimpulanButtonContainer.appendChild(kesimpulanButton);
//     }
//   });

//   return kesimpulanButtonContainer;
// }
// function handleTanggalRTMSection(idAmi, idProdiUnit) {
//   const tanggalRTMContainer = document.createElement("td");

//   // Fetch the Tanggal RTM data
//   fetchTanggalRTMData(idAmi, (error, tanggalRTMExists, tanggalRTMData) => {
//     if (error || !tanggalRTMExists || !tanggalRTMData) {
//       // Error or Tanggal RTM data doesn't exist, create a button with a link to pengawasan-tanggal-rtm-tambah.html
//       const tambahTanggalRTMButton = document.createElement("button");
//       tambahTanggalRTMButton.type = "button";
//       tambahTanggalRTMButton.className = "custom-button";
//       tambahTanggalRTMButton.innerHTML = "Belum Diisi";
//       tambahTanggalRTMButton.addEventListener("click", () => {
//         window.location.href = `pengawasan-tanggal_rtm-edit.html?id_ami=${idAmi}`;
//       });
//       tanggalRTMContainer.appendChild(tambahTanggalRTMButton);
//     } else {
//       // Data exists, create a button with a link to pengawasan-tanggal-rtm.html
//       const tanggalRTMButton = document.createElement("button");
//       tanggalRTMButton.type = "button";
//       tanggalRTMButton.className = "success-button";
//       tanggalRTMButton.innerHTML = "Sudah Diisi";
//       tanggalRTMButton.addEventListener("click", () => {
//         window.location.href = `pengawasan-tanggal_rtm.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
//       });
//       tanggalRTMContainer.appendChild(tanggalRTMButton);
//     }
//   });

//   return tanggalRTMContainer;
// }

// // Function to fetch Tanggal RTM data
// function fetchTanggalRTMData(idAmiNya, callback) {
//   CihuyDataAPI(
//     `https://simbe-dev.ulbi.ac.id/api/v1/ami/tglrtm?id_ami=${idAmiNya}`,
//     token,
//     (error, response) => {
//       if (error) {
//         console.error("Terjadi kesalahan:", error);
//         callback(error, false, null);
//         return;
//       }

//       if (response.success) {
//         // Check if the data exists in the response
//         const tanggalRTMExists = response.data !== null;

//         // Call the callback with the result
//         callback(null, tanggalRTMExists, response.data);
//       } else {
//         // Data doesn't exist, call the callback with false
//         callback(null, false, null);
//       }
//     }
//   );
// }

// function handleFotoKegiatanSection(idAmi, idProdiUnit) {
//   const fotoKegiatanContainer = document.createElement("td");

//   // Fetch the Foto Kegiatan data
//   fetchFotoKegiatanData(
//     idAmi,
//     (error, fotoKegiatanExists, fotoKegiatanData) => {
//       if (error || !fotoKegiatanExists || !fotoKegiatanData) {
//         // Error or Foto Kegiatan data doesn't exist, create a button with a link to pengawasan-foto-kegiatan-tambah.html
//         const tambahFotoKegiatanButton = document.createElement("button");
//         tambahFotoKegiatanButton.type = "button";
//         tambahFotoKegiatanButton.className = "custom-button";
//         tambahFotoKegiatanButton.innerHTML = "Belum Diisi";
//         tambahFotoKegiatanButton.addEventListener("click", () => {
//           window.location.href = `pengawasan-foto_prodi.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
//         });
//         fotoKegiatanContainer.appendChild(tambahFotoKegiatanButton);
//       } else {
//         // Data exists, create a button with a link to pengawasan-foto-kegiatan.html
//         const fotoKegiatanButton = document.createElement("button");
//         fotoKegiatanButton.type = "button";
//         fotoKegiatanButton.className = "success-button";
//         fotoKegiatanButton.innerHTML = "Sudah Diisi";
//         fotoKegiatanButton.addEventListener("click", () => {
//           window.location.href = `pengawasan-foto_prodi.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
//         });
//         fotoKegiatanContainer.appendChild(fotoKegiatanButton);
//       }
//     }
//   );

//   return fotoKegiatanContainer;
// }

// // Function to fetch Foto Kegiatan data
// function fetchFotoKegiatanData(idAmiNya, callback) {
//   CihuyDataAPI(
//     `https://simbe-dev.ulbi.ac.id/api/v1/foto/get?id_ami=${idAmiNya}`,
//     token,
//     (error, response) => {
//       if (error) {
//         console.error("Terjadi kesalahan:", error);
//         callback(error, false, null);
//         return;
//       }

//       if (response.success) {
//         // Check if the data exists in the response
//         const fotoKegiatanExists =
//           response.data !== null && response.data.length > 0;

//         // Call the callback with the result
//         callback(null, fotoKegiatanExists, response.data);
//       } else {
//         // Data doesn't exist, call the callback with false
//         callback(null, false, null);
//       }
//     }
//   );
// }

// function createAuditTable(item) {
//   const table = document.createElement("table");

//   // Audit
//   const rowAudit = document.createElement("tr");
//   rowAudit.appendChild(document.createElement("td")).innerHTML = "Audit";
//   rowAudit.appendChild(handleAuditSection(item.id_ami, item.id_prodi_unit));
//   table.appendChild(rowAudit);

//   // Kesimpulan
//   const rowKesimpulan = document.createElement("tr");
//   rowKesimpulan.appendChild(document.createElement("td")).innerHTML =
//     "Kesimpulan";
//   rowKesimpulan.appendChild(
//     handleKesimpulanSection(item.id_ami, item.id_prodi_unit)
//   );
//   table.appendChild(rowKesimpulan);

//   const rowTanggalRTM = document.createElement("tr");
//   rowTanggalRTM.appendChild(document.createElement("td")).innerHTML =
//     "Tanggal RTM";
//   rowTanggalRTM.appendChild(
//     handleTanggalRTMSection(item.id_ami, item.id_prodi_unit)
//   );
//   table.appendChild(rowTanggalRTM);

//   // Foto Kegiatan
//   const rowFotoKegiatan = document.createElement("tr");
//   rowFotoKegiatan.appendChild(document.createElement("td")).innerHTML =
//     "Foto Kegiatan";
//   rowFotoKegiatan.appendChild(
//     handleFotoKegiatanSection(item.id_ami, item.id_prodi_unit)
//   );
//   table.appendChild(rowFotoKegiatan);
//   return table;
// }

// //cek audit

// function createInfoTable(item) {
//   const table = document.createElement("table");
//   table.innerHTML = `
//     <tr>
//       <td>Program Studi / Unit: ${item.prodi_unit}</td>
//     </tr>
//     <tr>
//       <td>Fakultas : ${item.fakultas}</td>
//     </tr>
//     <tr>
//       <td>Ketua Auditor : ${item.nm_auditor_ketua}</td>
//     </tr>
//     <tr>
//       <td>Anggota 1 : ${item.nm_auditor_1}</td>
//     </tr>
//     <tr>
//       <td>Anggota 2 : ${item.nm_auditor_2}</td>
//     </tr>
//     <tr>
//       <td>Periode : <span class="custom-button">${item.id_siklus} - Tahun ${
//     item.tahun
//   }</span></td>
//     </tr>
//     <tr>
//       <td>Status Akhir : <span class="${
//         item.status === "Selesai" ? "success-button" : "custom-button"
//       }">${item.status}</span></td>
//     </tr>
//   `;
//   return table;
// }

// function createLaporanButton() {
//   const button = document.createElement("button");
//   button.type = "button";
//   button.className = "custom-button";
//   button.innerHTML = '<i class="fa fa-print"></i> Print Laporan AMI';
//   return button;
// }

// function showDataProsesAMI(data) {
//   const tableBody = document.getElementById("content");
//   tableBody.innerHTML = "";
//   let nomor = 1;

//   data.forEach((item) => {
//     const newRow = document.createElement("tr");

//     newRow.appendChild(createColumn(nomor));

//     const kolomProsesAudit = document.createElement("td");
//     kolomProsesAudit.innerHTML = '<div class="userDatatable-content"></div>';
//     kolomProsesAudit.firstChild.appendChild(createAuditTable(item));
//     newRow.appendChild(kolomProsesAudit);

//     const kolomInformasiAudit = document.createElement("td");
//     kolomInformasiAudit.innerHTML = '<div class="userDatatable-content"></div>';
//     kolomInformasiAudit.firstChild.appendChild(createInfoTable(item));
//     newRow.appendChild(kolomInformasiAudit);

//     const kolomLaporanAMI = document.createElement("td");
//     kolomLaporanAMI.appendChild(createLaporanButton());
//     newRow.appendChild(kolomLaporanAMI);

//     tableBody.appendChild(newRow);
//     nomor++;
//   });
// }

// function getAmiData() {
//   CihuyDataAPI(UrlGetAmi, token, (error, responseAmi) => {
//     if (error) {
//       console.error("Terjadi kesalahan:", error);
//     } else {
//       dataAmi = responseAmi.data;
//       showDataProsesAMI(dataAmi);
//     }
//   });
// }

// getAmiData();
// populateUserProfile();

//update to version proses ami 2
import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";
import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";

import {
  token,
  UrlGetAmibyAuditor,
  // UrlGetMekanisme,
  // UrlGetAudit,
  // UrlGetKesimpulan,
  // UrlGetFoto,
} from "../js/template/template.js";

let dataAmi;

function createColumn(content) {
  const column = document.createElement("td");
  column.innerHTML = `<div class="userDatatable-content">${content}</div>`;
  return column;
}

function fetchAuditList(idAmiNya, callback) {
  CihuyDataAPI(
    `https://simbe-dev.ulbi.ac.id/api/v1/audit`,
    token,
    (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
        callback(error, null);
        return;
      }

      if (response.success) {
        // Find audits with the specific id_ami
        const filteredAudits = response.data.filter(
          (audit) => audit.id_ami === idAmiNya
        );

        // Call the callback with the filtered audits
        callback(null, filteredAudits);
      } else {
        // Data doesn't exist, call the callback with an empty array
        callback(null, []);
      }
    }
  );
}

// Function to handle the audit section
function handleAuditSection(idAmi, idProdiUnit) {
  const auditButtonContainer = document.createElement("td");

  // Fetch the list of audit data with specific id_ami
  fetchAuditList(idAmi, (error, audits) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
      return;
    }

    // Check if there are any audit data
    if (audits.length > 0) {
      // Check if all audit statuses are "Sudah Dilaksanakan"
      const allStatusesDone = audits.every(
        (audit) => audit.status === "Sudah Dilaksanakan"
      );

      // Create button based on the statuses
      const auditButton = document.createElement("button");
      auditButton.type = "button";

      if (allStatusesDone) {
        auditButton.className = "success-button";
        auditButton.innerHTML = "Sudah Diisi";
      } else {
        auditButton.className = "custom-button";
        auditButton.innerHTML = "Belum Diisi";
      }

      auditButton.addEventListener("click", () => {
        window.location.href = `pengawasan-audit.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
      });

      auditButtonContainer.appendChild(auditButton);
    } else {
      // No audit data, create "Belum Diisi" button
      const tambahAuditButton = document.createElement("button");
      tambahAuditButton.type = "button";
      tambahAuditButton.className = "custom-button";
      tambahAuditButton.innerHTML = "Belum Diisi";
      tambahAuditButton.addEventListener("click", () => {
        window.location.href = `pengawasan-audit.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
      });

      auditButtonContainer.appendChild(tambahAuditButton);
    }
  });

  return auditButtonContainer;
}

function fetchKesimpulanData(idAmiNya, callback) {
  CihuyDataAPI(
    `https://simbe-dev.ulbi.ac.id/api/v1/kesimpulan/getbyami?id_ami=${idAmiNya}`,
    token,
    (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
        callback(error, null);
        return;
      }

      if (response.success) {
        // Check if the data exists in the response
        const kesimpulanData = response.data;
        const kesimpulanExists = kesimpulanData !== null;

        // Call the callback with the result
        callback(null, kesimpulanExists, kesimpulanData);
      } else {
        // Data doesn't exist, call the callback with false
        callback(null, false, null);
      }
    }
  );
}

// Function to handle the kesimpulan section
function handleKesimpulanSection(idAmi, idProdiUnit) {
  const kesimpulanButtonContainer = document.createElement("td");

  // Fetch the kesimpulan data
  fetchKesimpulanData(idAmi, (error, kesimpulanExists, kesimpulanData) => {
    if (error || !kesimpulanExists) {
      // Error or kesimpulan data doesn't exist, create a button with a link to pengawasan-kesimpulan-tambah.html
      const tambahKesimpulanButton = document.createElement("button");
      tambahKesimpulanButton.type = "button";
      tambahKesimpulanButton.className = "custom-button";
      tambahKesimpulanButton.innerHTML = "Belum Diisi";
      tambahKesimpulanButton.addEventListener("click", () => {
        window.location.href = `pengawasan-kesimpulan-add.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
      });
      kesimpulanButtonContainer.appendChild(tambahKesimpulanButton);
    } else {
      // Data exists, create a button with a link to pengawasan-kesimpulan.html
      const kesimpulanButton = document.createElement("button");
      kesimpulanButton.type = "button";
      kesimpulanButton.className = "success-button";
      kesimpulanButton.innerHTML = "Sudah Diisi";
      kesimpulanButton.addEventListener("click", () => {
        window.location.href = `pengawasan-kesimpulan.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
      });
      kesimpulanButtonContainer.appendChild(kesimpulanButton);
    }
  });

  return kesimpulanButtonContainer;
}
function handleTanggalRTMSection(idAmi, idProdiUnit) {
  const tanggalRTMContainer = document.createElement("td");

  // Fetch the Tanggal RTM data
  fetchTanggalRTMData(idAmi, (error, tanggalRTMExists, tanggalRTMData) => {
    if (error || !tanggalRTMExists || !tanggalRTMData) {
      // Error or Tanggal RTM data doesn't exist, create a button with a link to pengawasan-tanggal-rtm-tambah.html
      const tambahTanggalRTMButton = document.createElement("button");
      tambahTanggalRTMButton.type = "button";
      tambahTanggalRTMButton.className = "custom-button";
      tambahTanggalRTMButton.innerHTML = "Belum Diisi";
      tambahTanggalRTMButton.addEventListener("click", () => {
        window.location.href = `pengawasan-tanggal_rtm-edit.html?id_ami=${idAmi}`;
      });
      tanggalRTMContainer.appendChild(tambahTanggalRTMButton);
    } else {
      // Data exists, create a button with a link to pengawasan-tanggal-rtm.html
      const tanggalRTMButton = document.createElement("button");
      tanggalRTMButton.type = "button";
      tanggalRTMButton.className = "success-button";
      tanggalRTMButton.innerHTML = "Sudah Diisi";
      tanggalRTMButton.addEventListener("click", () => {
        window.location.href = `pengawasan-tanggal_rtm.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
      });
      tanggalRTMContainer.appendChild(tanggalRTMButton);
    }
  });

  return tanggalRTMContainer;
}

// Function to fetch Tanggal RTM data
function fetchTanggalRTMData(idAmiNya, callback) {
  CihuyDataAPI(
    `https://simbe-dev.ulbi.ac.id/api/v1/ami/tglrtm?id_ami=${idAmiNya}`,
    token,
    (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
        callback(error, false, null);
        return;
      }

      if (response.success) {
        // Check if the data exists in the response
        const tanggalRTMExists = response.data !== null;

        // Call the callback with the result
        callback(null, tanggalRTMExists, response.data);
      } else {
        // Data doesn't exist, call the callback with false
        callback(null, false, null);
      }
    }
  );
}

function handleFotoKegiatanSection(idAmi, idProdiUnit) {
  const fotoKegiatanContainer = document.createElement("td");

  // Fetch the Foto Kegiatan data
  fetchFotoKegiatanData(
    idAmi,
    (error, fotoKegiatanExists, fotoKegiatanData) => {
      if (error || !fotoKegiatanExists || !fotoKegiatanData) {
        // Error or Foto Kegiatan data doesn't exist, create a button with a link to pengawasan-foto-kegiatan-tambah.html
        const tambahFotoKegiatanButton = document.createElement("button");
        tambahFotoKegiatanButton.type = "button";
        tambahFotoKegiatanButton.className = "custom-button";
        tambahFotoKegiatanButton.innerHTML = "Belum Diisi";
        tambahFotoKegiatanButton.addEventListener("click", () => {
          window.location.href = `pengawasan-foto_prodi.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
        });
        fotoKegiatanContainer.appendChild(tambahFotoKegiatanButton);
      } else {
        // Data exists, create a button with a link to pengawasan-foto-kegiatan.html
        const fotoKegiatanButton = document.createElement("button");
        fotoKegiatanButton.type = "button";
        fotoKegiatanButton.className = "success-button";
        fotoKegiatanButton.innerHTML = "Sudah Diisi";
        fotoKegiatanButton.addEventListener("click", () => {
          window.location.href = `pengawasan-foto_prodi.html?id_ami=${idAmi}&id_prodi_unit=${idProdiUnit}`;
        });
        fotoKegiatanContainer.appendChild(fotoKegiatanButton);
      }
    }
  );

  return fotoKegiatanContainer;
}

// Function to fetch Foto Kegiatan data
function fetchFotoKegiatanData(idAmiNya, callback) {
  CihuyDataAPI(
    `https://simbe-dev.ulbi.ac.id/api/v1/foto/get?id_ami=${idAmiNya}`,
    token,
    (error, response) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
        callback(error, false, null);
        return;
      }

      if (response.success) {
        // Check if the data exists in the response
        const fotoKegiatanExists =
          response.data !== null && response.data.length > 0;

        // Call the callback with the result
        callback(null, fotoKegiatanExists, response.data);
      } else {
        // Data doesn't exist, call the callback with false
        callback(null, false, null);
      }
    }
  );
}

function createAuditTable(item) {
  const table = document.createElement("table");

  // Audit
  const rowAudit = document.createElement("tr");
  rowAudit.appendChild(document.createElement("td")).innerHTML = "Audit";
  rowAudit.appendChild(handleAuditSection(item.id_ami, item.id_prodi_unit));
  table.appendChild(rowAudit);

  // Kesimpulan
  const rowKesimpulan = document.createElement("tr");
  rowKesimpulan.appendChild(document.createElement("td")).innerHTML =
    "Kesimpulan";
  rowKesimpulan.appendChild(
    handleKesimpulanSection(item.id_ami, item.id_prodi_unit)
  );
  table.appendChild(rowKesimpulan);

  const rowTanggalRTM = document.createElement("tr");
  rowTanggalRTM.appendChild(document.createElement("td")).innerHTML =
    "Tanggal RTM";
  rowTanggalRTM.appendChild(
    handleTanggalRTMSection(item.id_ami, item.id_prodi_unit)
  );
  table.appendChild(rowTanggalRTM);

  // Foto Kegiatan
  const rowFotoKegiatan = document.createElement("tr");
  rowFotoKegiatan.appendChild(document.createElement("td")).innerHTML =
    "Foto Kegiatan";
  rowFotoKegiatan.appendChild(
    handleFotoKegiatanSection(item.id_ami, item.id_prodi_unit)
  );
  table.appendChild(rowFotoKegiatan);
  return table;
}

//cek audit

function createInfoTable(item) {
  const table = document.createElement("table");
  table.innerHTML = `
    <tr>
      <td>Program Studi / Unit: ${item.prodi_unit}</td>
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
      <td>Anggota 2 : ${item.nm_auditor_2}</td>
    </tr>
    <tr>
      <td>Periode : <span class="custom-button">${item.id_siklus} - Tahun ${
    item.tahun
  }</span></td>
    </tr>
    <tr>
      <td>Status Akhir : <span class="${
        item.status === "Selesai" ? "success-button" : "custom-button"
      }">${item.status}</span></td>
    </tr>
  `;
  return table;
}

function createLaporanButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "custom-button";
  button.innerHTML = '<i class="fa fa-print"></i> Print Laporan AMI';
  return button;
}

function showDataProsesAMI(data) {
  const tableBody = document.getElementById("content");
  tableBody.innerHTML = "";
  let nomor = 1;

  data.forEach((item) => {
    const newRow = document.createElement("tr");

    newRow.appendChild(createColumn(nomor));

    const kolomProsesAudit = document.createElement("td");
    kolomProsesAudit.innerHTML = '<div class="userDatatable-content"></div>';
    kolomProsesAudit.firstChild.appendChild(createAuditTable(item));
    newRow.appendChild(kolomProsesAudit);

    const kolomInformasiAudit = document.createElement("td");
    kolomInformasiAudit.innerHTML = '<div class="userDatatable-content"></div>';
    kolomInformasiAudit.firstChild.appendChild(createInfoTable(item));
    newRow.appendChild(kolomInformasiAudit);

    const kolomLaporanAMI = document.createElement("td");
    kolomLaporanAMI.appendChild(createLaporanButton());
    newRow.appendChild(kolomLaporanAMI);

    tableBody.appendChild(newRow);
    nomor++;
  });
}

function getAmiData() {
  CihuyDataAPI(UrlGetAmibyAuditor, token, (error, responseAmi) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
    } else {
      dataAmi = responseAmi.data;
      showDataProsesAMI(dataAmi);
    }
  });
}

getAmiData();
populateUserProfile();
