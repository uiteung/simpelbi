import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetAmi, UrlGetMekanisme } from "../js/template/template.js";

function ShowDataProsesAMI(data, mekanismeData) {
  const tableBody = document.getElementById("content");

  // Kosongkan isi tabel saat ini
  tableBody.innerHTML = "";
  let nomor = 1;

  // Loop melalui data yang diterima dari API
  data.forEach((item) => {
    const mekanismeItem = mekanismeData.find(
      (mekanisme) => mekanisme.idAmi === item.idAmi
    );

    const barisBaru = document.createElement("tr");

    // Kolom No
    const kolomNo = document.createElement("td");
    kolomNo.innerHTML = `<div class="userDatatable-content">${nomor}</div>`;
    barisBaru.appendChild(kolomNo);

    // Kolom Proses Audit
    const kolomProsesAudit = document.createElement("td");
    kolomProsesAudit.innerHTML = `
          <div class="userDatatable-content">
            <table>
              <tr>
                <td>Mekanisme</td>
                <td>
  <a href="pengawasan-mekanisme.html?id_ami=${item.idAmi}">
    ${
      mekanismeItem
        ? mekanismeItem.question1 === "Ya" ||
          mekanismeItem.question2 === "Ya" ||
          mekanismeItem.question3 === "Ya" ||
          mekanismeItem.question4 === "Ya" ||
          mekanismeItem.question5 === "Ya" ||
          mekanismeItem.question6 === "Ya"
          ? '<span class="badge badge-rounded badge-primary">Sudah Diisi</span>'
          : '<span class="badge badge-rounded badge-warning">Belum Diisi</span>'
        : '<span class="badge badge-rounded badge-warning">Belum Diisi</span>'
    }
  </a>
</td>
              </tr>
              <tr>
                <td>Audit</td>
                <td>
                  <a href="pengawasan-audit.php?id_ami=${item.idAmi}">
                    <!-- Logika untuk badge Audit -->
                  </a>
                </td>
              </tr>
              <tr>
                <td>Kesimpulan</td>
                <td>
                  <a href="pengawasan-kesimpulan.php?id_ami=${item.idAmi}">
                    <!-- Logika untuk badge Kesimpulan -->
                  </a>
                </td>
              </tr>
              <tr>
                <td>Tanggal</td>
                <td>
                  <a href="pengawasan-tanggal.php?id_ami=${item.idAmi}">
                    <!-- Logika untuk badge Tanggal -->
                  </a>
                </td>
              </tr>
              <tr>
                <td>Foto Kegiatan</td>
                <td>
                  <a href="pengawasan-foto.php?id_ami=${item.idAmi}">
                    <!-- Logika untuk badge Foto Kegiatan -->
                  </a>
                </td>
              </tr>
            </table>
          </div>`;
    barisBaru.appendChild(kolomProsesAudit);

    // Kolom Informasi Audit
    const kolomInformasiAudit = document.createElement("td");
    kolomInformasiAudit.innerHTML = `
          <div class="userDatatable-content">
            <table>
              <tr>
                <td>Prodi : ${item.prodi}</td>
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
                <td>Siklus : ${item.idSiklus} ${item.tahun}</td>
              </tr>
            </table>
          </div>`;
    barisBaru.appendChild(kolomInformasiAudit);

    // Kolom Laporan AMI
    const kolomLaporanAMI = document.createElement("td");
    kolomLaporanAMI.innerHTML = `
          <button type="button" class="custom-button">
            <i class="fa fa-print"></i> Print Laporan AMI
          </button>`;
    barisBaru.appendChild(kolomLaporanAMI);

    tableBody.appendChild(barisBaru);
    nomor++;
  });
}

// Lakukan permintaan API untuk data AMI
CihuyDataAPI(UrlGetAmi, token, (error, responseAmi) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const dataAmi = responseAmi.data;

    // Lakukan permintaan API untuk data Mekanisme
    CihuyDataAPI(UrlGetMekanisme, token, (error, responseMekanisme) => {
      if (error) {
        console.error("Terjadi kesalahan:", error);
      } else {
        const mekanismeData = responseMekanisme.data;
        console.log("Data Mekanisme yang diterima:", mekanismeData);

        // Tampilkan data AMI dengan data Mekanisme yang sesuai
        ShowDataProsesAMI(dataAmi, mekanismeData);
      }
    });
  }
});

//-- Mekanisme --//
