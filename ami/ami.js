import { CihuyDataAPI, CihuyPostApi } from "https://c-craftjs.github.io/simpelbi/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

const apiUrl = "http://simbe-dev.ulbi.ac.id/api/v1/ami";
const token = CihuyGetCookie("login")

// Function Untuk Tampil Data
function tampilData(data) {
    const tableBody = document.getElementById("tablebody");

    // Kosongkan isi tabel saat ini
    tableBody.innerHTML = "";
    let nomor = 1;

    // Perulangan untuk menampilkan data yang diterima dari API
    data.forEach((item) => {
        const barisBaru = document.createElement("tr");
        barisBaru.innerHTML = `
            <td>${nomor}</td>
            <td>${item.id_fakultas}</td>
            <td>${item.id_prodi}</td>
            <td>${item.id_auditor_ketua}</td>
            <td>${item.id_anggota1}</td>
            <td>${item.id_anggota2}</td>
            <td>${item.id_siklus}</td>
            <td>${item.status}</td>
            <td>${item.tgl_rtm}</td>
            <td>${item.tgl_selesai}</td>
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

// Get Data dari API
CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
        console.error("Terjadi Kesalahan : ", error);
    } else {
        const data = response.data;
        console.log("Data yang diterima : ", data);
        tampilData(data);
    }
});