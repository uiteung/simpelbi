import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
// import { CihuyGetHeaders } from "https://c-craftjs.github.io/api/api.js";
import { CihuyGetHeaders } from "./getfunc.js";
import { CihuyQuerySelector } from "https://c-craftjs.github.io/element/element.js";

const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/menu/mainsub";
const token = CihuyGetCookie("login");

function toggleSubMenu(event) {
  event.preventDefault();
  const listItem = event.currentTarget.parentElement;
  listItem.classList.toggle("open");
}
function createSubMenu(subMenuItems) {
  const subMenu = document.createElement("ul");

  subMenuItems.forEach((subMenuItem) => {
    const subListItem = document.createElement("li");
    const subLink = document.createElement("a");

    subLink.href = `https://euis.ulbi.ac.id/simpelbi${subMenuItem.url}.html`;
    subLink.textContent = subMenuItem.title;

    subListItem.appendChild(subLink);
    subMenu.appendChild(subListItem);
  });

  return subMenu;
}
function populateSidebar(data) {
  const sidebarNav = document.querySelector(".sidebar_nav");
  const currentURL = window.location.pathname;

  // Menghapus semua elemen anak dari sidebarNav
  while (sidebarNav.firstChild) {
    sidebarNav.removeChild(sidebarNav.firstChild);
  }

  if (data && data.data && Array.isArray(data.data)) {
    data.data.forEach((mainMenuItem) => {
      const listItem = document.createElement("li");

      listItem.classList.add("has-child");

      const link = document.createElement("a");
      link.classList.add("action");

      link.innerHTML = `
        <span class="nav-icon ${mainMenuItem.icon || ""}"></span>
        <span class="menu-text">${mainMenuItem.title || ""}</span>
        <span class="toggle-icon"></span>
      `;

      if (
        mainMenuItem.sub_menu &&
        Array.isArray(mainMenuItem.sub_menu) &&
        mainMenuItem.sub_menu.length > 0
      ) {
        const submenu = createSubMenu(mainMenuItem.sub_menu);

        listItem.appendChild(link);
        listItem.appendChild(submenu);
        sidebarNav.appendChild(listItem);
      } else {
        // Jika tidak ada submenu, tambahkan item menu utama saja
        listItem.appendChild(link);
        sidebarNav.appendChild(listItem);
      }

      // Tambahkan event listener untuk setiap item menu yang memiliki submenu
      link.addEventListener("click", toggleSubMenu);
    });
  }
}

CihuyGetHeaders(apiUrl, token)
  .then((data) => {
    populateSidebar(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
