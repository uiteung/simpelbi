import {
  CihuyDataAPI,
  //   CihuyPostApi,
  //   CihuyDeleteAPI,
  //   CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetAmi } from "../js/template/template.js";
function ShowDataProsesAMI(data) {
  const tableBody = document.getElementById("content");

  // Kosongkan isi tabel saat ini
  tableBody.innerHTML = "";
  let nomor = 1;

  // Loop melalui data yang diterima dari API
  data.forEach((item) => {
    const barisBaru = document.createElement("tr");
    barisBaru.innerHTML = `
    <td>
    <div class="userDatatable-content">30</div>
 </td>

 <td>
    <div class="userDatatable-content">
       <table>
          <tr>
              <td>Mekanisme </td>
              <td><button type="button" class="custom-button">Belum Diisi </button></td>
          </tr>
          <tr>
              <td>Audit</td>
              <td><button type="button" class="custom-button">Belum Diisi </button></td>
          </tr>
          <tr>
              <td>Kesimpulan </td>
              <td><button type="button" class="custom-button">Belum Diisi  </button></td>
          </tr>
          <tr>
              <td>Tanggal </td>
              <td><button type="button" class="custom-button">Belum Diisi </button></td>
          </tr>
          <tr>
              <td>Foto Kegiatan</td>
              <td><button type="button" class="custom-button">Belum Diisi </button></td>
          </tr>
      </table>
    </div>
 </td>
 <td>
    <div class="userDatatable-content">
       <table>
          <tr>
             <td>Prodi : ${item.prodi}</td>
          <tr>
             <td>Fakultas : ${item.fakultas}</td>
          </tr>
          <tr>
             <td>Ketua Auditor :  ${item.nm_auditor_ketua} </td>
          </tr>
          <tr>
             <td>Anggota 1 : ${item.nm_auditor_1}  </td>
             
          </tr>
          <tr>
             <td>Anggota 2 : ${item.nm_auditor_2}  </td>
             
          </tr>
          </tr>
       </table>
    </div>
 </td>
 <td>
    <button type="button" class="custom-button"> <i class="fa fa-print "></i> Print Laporan AMI </button>
 </td>

 <td>
    <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
       <li>
          <a href="#" class="view">
             <i class="uil uil-eye"></i>
          </a>
       </li>
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
    const removeButton = barisBaru.querySelector(".remove");
    removeButton.addEventListener("click", () => {
      const id_prodi = removeButton.getAttribute("data-prodi-id");
      if (id_prodi) {
        deleteprodi(id_prodi);
      } else {
        console.error("ID prodi tidak ditemukan.");
      }
    });
    const editButton = barisBaru.querySelector(".edit");
    editButton.addEventListener("click", () => {
      const id_prodi = editButton.getAttribute("data-prodi-id");
      if (id_prodi) {
        editData(id_prodi);
      } else {
        console.error("ID prodi tidak ditemukan.");
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
    ShowDataProsesAMI(data);
  }
});
