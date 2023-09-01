import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "https://c-craftjs.github.io/api/api.js";
import { CihuyQuerySelector } from "https://c-craftjs.github.io/element/element.js";

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
// Fungsi untuk membangun sidebar berdasarkan data menu
function buildSidebar(menuData) {
  const sidebarNav = document.querySelector(".sidebar_nav"); // Memilih elemen dengan class "sidebar_nav"

  menuData.forEach((item) => {
    const menuItem = document.createElement("li");

    if (item.is_main_menu === 0) {
      // Jika is_main_menu adalah 0, maka buat elemen <a> di dalam <li>
      const link = document.createElement("a");
      link.href = item.url; // Gantilah dengan URL yang sesuai
      link.innerHTML = `
        <span class="nav-icon ${item.icon}"></span>
        <span class="menu-text">${item.title}</span>
      `;
      menuItem.appendChild(link);
    } else if (item.is_main_menu === 1) {
      // Jika is_main_menu adalah 1, maka buat elemen <li> dengan sub-menu
      const parentLink = document.createElement("a");
      parentLink.href = "#";
      parentLink.classList.add("action");

      parentLink.innerHTML = `
        <span class="nav-icon ${item.icon}"></span>
        <span class="menu-text">${item.title}</span>
        <span class="toggle-icon"></span>
      `;

      const subMenu = document.createElement("ul");

      item.submenu.forEach((subItem) => {
        const subMenuItem = document.createElement("li");
        const subLink = document.createElement("a");
        subLink.href = subItem.url; // Gantilah dengan URL yang sesuai
        subLink.innerHTML = subItem.title;
        subMenuItem.appendChild(subLink);
        subMenu.appendChild(subMenuItem);
      });

      menuItem.appendChild(parentLink);
      menuItem.appendChild(subMenu);
    }

    sidebarNav.appendChild(menuItem);
  });
}

// Panggil fungsi getMenuData dan buildSidebar untuk membuat sidebar
getMenuData().then((menuData) => {
  buildSidebar(menuData);
});
