import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "https://c-craftjs.github.io/api/api.js";
import { CihuyQuerySelector } from "https://c-craftjs.github.io/element/element.js";
// Fungsi untuk membuat elemen <li> dan <a> sesuai dengan data menu
// Fungsi untuk membuat elemen <li> dan <a> sesuai dengan data menu
const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/menu/get";
const token = CihuyGetCookie("login");

// Fungsi untuk mengambil data dari API
function fetchDataFromAPI() {
  const myHeaders = new Headers();
  myHeaders.append("LOGIN", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(apiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Menggunakan response.json() untuk mengambil data JSON dari API
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

// Fungsi untuk mengisi sidebar dengan data dari API
function populateSidebar(data) {
  const sidebarNav = document.querySelector(".sidebar_nav");

  // Menghapus semua elemen anak dari sidebarNav
  while (sidebarNav.firstChild) {
    sidebarNav.removeChild(sidebarNav.firstChild);
  }

  // Loop melalui data dari API dan membuat elemen sidebar
  data.data.forEach((item) => {
    const listItem = document.createElement("li");
    if (item.is_main_menu === 1) {
      // Jika is_main_menu = 1, buat tautan dengan href
      const link = document.createElement("a");
      link.href = item.url;
      link.innerHTML = `<span class="menu-text">${item.title}</span>`;
      listItem.appendChild(link);
    } else {
      // Jika is_main_menu = 0, buat elemen span
      const span = document.createElement("span");
      span.className = "menu-text";
      span.textContent = item.title;
      listItem.appendChild(span);
    }
    sidebarNav.appendChild(listItem);
  });
}

// Panggil fungsi fetchDataFromAPI dan populateSidebar
fetchDataFromAPI()
  .then((data) => {
    populateSidebar(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
