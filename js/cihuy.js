import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyDataAPI } from "https://c-craftjs.github.io/simpelbi/api.js";
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

// Fungsi untuk memeriksa URL sesuai dengan peran atau mengarahkan ke URL yang sesuai
function checkRoleAndURL(apiUrl, token) {
  CihuyDataAPI(apiUrl, token, (error, data) => {
    if (error) {
      console.error("Gagal mengambil data menu:", error);
      return;
    }

    if (data.success) {
      const role = data.data ? data.data.replace("/", "") : null; // Menghapus karakter '/' dari data respon jika ada
      const currentUrl = window.location.href;

      if (role === "admin") {
        // Jika peran adalah 'admin', arahkan pengguna ke URL admin
        window.location.href =
          "https://euis.ulbi.ac.id/simpelbi/admins/dashboard.html";
      } else {
        // Pengecualian untuk peran 'admin'
        if (
          currentUrl ===
          `https://euis.ulbi.ac.id/simpelbi/${role}/dashboard-${role}.html`
        ) {
          console.log("URL sesuai dengan peran.");
        } else {
          console.log(
            "URL tidak sesuai dengan peran. Mengarahkan ke URL yang sesuai..."
          );

          if (role) {
            // Jika peran ada, arahkan pengguna ke URL yang sesuai dengan peran
            window.location.href = `https://euis.ulbi.ac.id/simpelbi/${role}/dashboard-${role}.html`;
          } else {
            console.error("Tidak ada peran yang ditemukan dalam data.");
          }
        }
      }
    } else {
      if (data.status === "Forbidden") {
        console.error("Status Forbidden: Pengguna tidak diizinkan.");
        // Handle akses yang tidak diizinkan di sini, misalnya, menampilkan pesan kesalahan.
      } else {
        console.error("Gagal mengambil data menu: Data tidak valid.");
      }
    }
  });
}
// Panggil fungsi checkRoleAndURL untuk memeriksa URL sesuai dengan peran atau mengarahkan jika diperlukan
const apiUrlMenu = "https://simbe-dev.ulbi.ac.id/api/v1/menu/";
checkRoleAndURL(apiUrlMenu, token);
