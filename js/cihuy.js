import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "https://c-craftjs.github.io/api/api.js";
import { CihuyQuerySelector } from "https://c-craftjs.github.io/element/element.js";

const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/menu/mainsub";
const token = CihuyGetCookie("login");

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
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
} // Fungsi untuk membuat submenu dari // Fungsi untuk membuat submenu dari data
// Fungsi untuk membuat submenu dari data
function createSubMenu(subMenuItems) {
  const subMenu = document.createElement("ul");

  subMenuItems.forEach((subMenuItem) => {
    const subListItem = document.createElement("li");
    const subLink = document.createElement("a");

    subLink.href = subMenuItem.url;
    subLink.textContent = subMenuItem.title;

    subListItem.appendChild(subLink);
    subMenu.appendChild(subListItem);
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

  if (data && data.data && Array.isArray(data.data)) {
    const mainMenuItems = data.data.filter((item) => item.is_main_menu === 0);
    const subMenuItems = data.data.filter((item) => item.is_main_menu === 1);

    mainMenuItems.forEach((mainMenuItem) => {
      const listItem = document.createElement("li");
      listItem.classList.add("has-child");

      const link = document.createElement("a");
      link.classList.add("action");

      link.innerHTML = `
        <span class="nav-icon ${mainMenuItem.icon || ""}"></span>
        <span class="menu-text">${mainMenuItem.title || ""}</span>
        <span class="toggle-icon"></span>
      `;

      const submenuItems = subMenuItems.filter((subMenuItem) =>
        subMenuItem.url.startsWith(mainMenuItem.url)
      );

      if (submenuItems.length > 0) {
        const submenu = createSubMenu(submenuItems);

        listItem.appendChild(link);
        listItem.appendChild(submenu);
        sidebarNav.appendChild(listItem);
      } else {
        // Jika tidak ada submenu, tambahkan item menu utama saja
        listItem.appendChild(link);
        sidebarNav.appendChild(listItem);
      }
    });
  }
}

// Panggil fungsi fetchDataFromAPI dan populateSidebar
fetchDataFromAPI()
  .then((data) => {
    populateSidebar(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
