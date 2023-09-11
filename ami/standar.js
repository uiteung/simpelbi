import { CihuyDataAPI, CihuyPostApi } from "https://c-craftjs.github.io/simpelbi/api.js";
import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

const apiUrl = "http://simbe-dev.ulbi.ac.id/api/v1/standar/get";
const token = CihuyGetCookie("login");

// Untuk Get Data dari API
CihuyDataAPI(apiUrl, token, (error, response) => {
    if (error) {
        console.error("Terjadi Kesalahan : ", error);
    } else {
        const data = response.data;
        console.log("Data yang diterima : ", data);
        tampilData(data);
    }
});

// Function untuk menampilkan data
function tampilData(data) {
    const tableBody = document.getElementById("tablebody");

    // Kosongkan isi tabel saat ini
    tableBody.innerHTML = "";
    let nomor = 1;

    // Perulangan untuk menampilkan data yang di get dari API
    data.forEach((item) => {
        const barisBaru = document.createElement("tr");
        barisBaru.innerHTML = `
            <td>${nomor}</td>
            <td>${item.standar}</td>
            <td>${item.utk_pilihan}</td>
            <td>${item.isi}</td>
            <td>${item.id_siklus}</td>
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
