import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "https://c-craftjs.github.io/api/api.js";
import { CihuyQuerySelector } from "https://c-craftjs.github.io/element/element.js";
// Fungsi untuk membuat elemen <li> dan <a> sesuai dengan data menu
// Fungsi untuk membuat elemen <li> dan <a> sesuai dengan data menu
// Fungsi untuk mendapatkan data menu dari API
function getMenuData() {
  const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/menu/get";
  const token = CihuyGetCookie("login"); // Gantilah dengan token Anda

  return CihuyGetHeaders(apiUrl, token)
    .then((data) => {
      const menuData = JSON.parse(data);
      return menuData.data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

// Fungsi untuk membangun sidebar berdasarkan data menu
function buildSidebar(menuData) {
  const sidebar = document.getElementById("sidebar"); // Gantilah dengan ID dari elemen sidebar Anda

  menuData.forEach((item) => {
    const menuItem = document.createElement("li");
    menuItem.classList.add("has-subMenu-left");

    if (item.is_main_menu === 0) {
      // Jika is_main_menu adalah 0, maka buat elemen <a>
      const link = document.createElement("a");
      link.href = "#";
      link.innerHTML = `
        <span class="nav-icon ${item.icon}"></span>
        <span class="menu-text">${item.title}</span>
      `;
      menuItem.appendChild(link);
    } else if (item.is_main_menu === 1) {
      // Jika is_main_menu adalah 1, maka buat elemen <ul> dan <li>
      const subMenu = document.createElement("ul");
      subMenu.classList.add("subMenu");

      const subMenuItem = document.createElement("li");

      const link = document.createElement("a");
      link.href = item.url; // Gantilah dengan URL yang sesuai
      link.innerHTML = item.title;

      subMenuItem.appendChild(link);
      subMenu.appendChild(subMenuItem);
      menuItem.appendChild(subMenu);
    }

    sidebar.appendChild(menuItem);
  });
}

// Panggil fungsi getMenuData dan buildSidebar untuk membuat sidebar
getMenuData().then((menuData) => {
  buildSidebar(menuData);
});
