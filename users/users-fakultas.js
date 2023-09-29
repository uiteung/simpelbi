import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
import { token, UrlGetUsersFakultas } from "../js/template/template.js";

function ShowDataUsersFakultas(data) {
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
          ${item.dekan}
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
    tableBody.appendChild(barisBaru);
    nomor++;
  });
}
// Untuk Get Data dari API
CihuyDataAPI(UrlGetUsersFakultas, token, (error, response) => {
  if (error) {
    console.error("Terjadi kesalahan:", error);
  } else {
    const data = response.data;
    console.log("Data yang diterima:", data);
    ShowDataUsersFakultas(data);
  }
});
