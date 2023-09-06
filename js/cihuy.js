import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "https://c-craftjs.github.io/api/api.js";
import { CihuyQuerySelector } from "https://c-craftjs.github.io/element/element.js";
// Fungsi untuk membuat elemen <li> dan <a> sesuai dengan data menu
// Fungsi untuk membuat elemen <li> dan <a> sesuai dengan data menu
const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/menu/file";
const token = CihuyGetCookie("login");

// Fungsi untuk mengambil data dari API

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
function createSubMenu(menuItems) {
  const baseUrl = "https://euis.ulbi.ac.id/simpelbi/";

  const subMenu = document.createElement("ul");

  menuItems.forEach((item) => {
    const subMenuItem = document.createElement("li");

    if (item.is_main_menu === 1) {
      // Jika is_main_menu = 1, buat tautan dengan href
      const link = document.createElement("a");
      link.href = baseUrl + item.url;
      link.innerHTML = `<span class="menu-text">${item.title}</span>`;
      subMenuItem.appendChild(link);
    } else {
      // Jika is_main_menu = 0, buat elemen span
      const span = document.createElement("span");
      span.className = "menu-text";
      span.textContent = item.title;
      subMenuItem.appendChild(span);
    }

    if (item.sub_menu && item.sub_menu.length > 0) {
      // Jika ada submenu, panggil fungsi createSubMenu rekursif
      const subSubMenu = createSubMenu(item.sub_menu);
      subMenuItem.appendChild(subSubMenu);
    }

    subMenu.appendChild(subMenuItem);
  });

  return subMenu;
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
      // Jika is_main_menu = 1, buat elemen "has-child" dan struktur yang sesuai
      listItem.className = "has-child";
      const link = document.createElement("a");

      // Gabungkan URL dasar dengan URL yang Anda terima dari API
      const fullURL = new URL(item.url, "https://euis.ulbi.ac.id/simpelbi/");
      link.href = fullURL.toString();

      link.className = "action";
      link.innerHTML = `
        <span class="nav-icon ${item.icon_class}"></span>
        <span class="menu-text">${item.title}</span>
        <span class="toggle-icon"></span>
      `;

      const submenu = document.createElement("ul");

      // Loop melalui submenu dan buat elemen "li" untuk setiap sub-menu
      item.submenu.forEach((subItem) => {
        const subListItem = document.createElement("li");
        const subLink = document.createElement("a");

        // Gabungkan URL dasar dengan URL submenu
        const subFullURL = new URL(
          subItem.url,
          "https://euis.ulbi.ac.id/simpelbi/"
        );
        subLink.href = subFullURL.toString();

        subLink.textContent = subItem.title;
        subListItem.appendChild(subLink);
        submenu.appendChild(subListItem);
      });

      listItem.appendChild(link);
      listItem.appendChild(submenu);
    } else {
      // Jika is_main_menu = 0, buat elemen "li" dan "a" sesuai dengan HTML template
      listItem.innerHTML = `
        <a href="#">
          <span class="nav-icon ${item.icon_class}"></span>
          <span class="menu-text">${item.title}</span>
          <span class="toggle-icon"></span>
        </a>
      `;
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
