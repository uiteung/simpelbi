import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "https://c-craftjs.github.io/api/api.js";
import { CihuyQuerySelector } from "https://c-craftjs.github.io/element/element.js";
// Fungsi untuk membuat elemen <li> dan <a> sesuai dengan data menu
function createMenuItem(title, url, icon) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = url;
  a.className = "action";

  if (icon) {
    const iconSpan = document.createElement("span");
    iconSpan.className = `nav-icon ${icon}`;
    a.appendChild(iconSpan);
  }

  const textSpan = document.createElement("span");
  textSpan.className = "menu-text";
  textSpan.textContent = title;

  a.appendChild(textSpan);
  li.appendChild(a);

  return li;
}

// Fungsi untuk mengambil data menu dari API
function getMenuData() {
  const url = "https://simbe-dev.ulbi.ac.id/api/v1/menu/get";
  const token = "YOUR_TOKEN_HERE"; // Ganti dengan token yang sesuai
  CihuyGetHeaders(url, token)
    .then((response) => {
      const data = JSON.parse(response);
      if (data.success) {
        const menuData = data.data;
        const sidebar = document.getElementById("sidebar"); // Ganti 'sidebar' dengan id elemen sidebar Anda

        menuData.forEach((menuItem) => {
          if (menuItem.is_aktif === "y") {
            const li = createMenuItem(
              menuItem.title,
              menuItem.url,
              menuItem.icon
            );
            sidebar.appendChild(li);
          }
        });
      } else {
        console.error("Gagal mengambil data menu");
      }
    })
    .catch((error) => {
      console.error("Terjadi kesalahan:", error);
    });
}

// Panggil fungsi untuk mengambil data menu dan membuat sidebar
getMenuData();
