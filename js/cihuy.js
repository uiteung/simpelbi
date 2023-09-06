import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "https://c-craftjs.github.io/api/api.js";
import { CihuyQuerySelector } from "https://c-craftjs.github.io/element/element.js";

const apiUrl = "https://simbe-dev.ulbi.ac.id/api/v1/menu/file";
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
}

function createSubMenu(menuItems) {
  const baseUrl = "https://euis.ulbi.ac.id/simpelbi/";

  const subMenu = document.createElement("ul");

  menuItems.forEach((item) => {
    const subMenuItem = document.createElement("li");

    if (item.is_main_menu === 1) {
      const link = document.createElement("a");
      link.href = baseUrl + item.url;
      link.innerHTML = `<span class="menu-text">${item.title}</span>`;
      subMenuItem.appendChild(link);
    } else {
      const span = document.createElement("span");
      span.className = "menu-text";
      span.textContent = item.title;
      subMenuItem.appendChild(span);
    }

    if (item.sub_menu && Array.isArray(item.sub_menu)) {
      const subSubMenu = createSubMenu(item.sub_menu);
      subMenuItem.appendChild(subSubMenu);
    }

    subMenu.appendChild(subMenuItem);
  });

  return subMenu;
}

function populateSidebar(data) {
  const sidebarNav = document.querySelector(".sidebar_nav");

  while (sidebarNav.firstChild) {
    sidebarNav.removeChild(sidebarNav.firstChild);
  }

  if (data && data.data && Array.isArray(data.data)) {
    data.data.forEach((item) => {
      if (item.is_main_menu === 0) {
        // Ini adalah elemen dengan is_main_menu = 0, tambahkan class 'has-child'
        const listItem = document.createElement("li");
        listItem.classList.add("has-child");
        const link = document.createElement("a");
        link.classList.add("action");
        link.href = "#";
        link.innerHTML = `
          <span class="nav-icon ${item.icon_class || ""}"></span>
          <span class="menu-text">${item.title || ""}</span>
          <span class="toggle-icon"></span>
        `;

        const submenu = document.createElement("ul");

        if (item.sub_menu && Array.isArray(item.sub_menu)) {
          item.sub_menu.forEach((subItem) => {
            const subListItem = document.createElement("li");
            const subLink = document.createElement("a");
            if (subItem.url) {
              // Tambahkan URL ke submenu
              const subFullURL = new URL(
                subItem.url,
                "https://euis.ulbi.ac.id/simpelbi/"
              );
              subLink.href = subFullURL.toString();
              subLink.textContent = subItem.title || "";
              subListItem.appendChild(subLink);
              submenu.appendChild(subListItem);
            }
          });
        }

        listItem.appendChild(link);
        if (submenu.children.length > 0) {
          listItem.appendChild(submenu);
        }
        sidebarNav.appendChild(listItem);
      } else if (item.is_main_menu === 1) {
        // Ini adalah elemen dengan is_main_menu = 1
        const listItem = document.createElement("li");
        listItem.classList.add("action");
        const link = document.createElement("a");
        if (item.url) {
          const fullURL = new URL(
            item.url,
            "https://euis.ulbi.ac.id/simpelbi/"
          );
          link.href = fullURL.toString();
          link.innerHTML = `
            <span class="nav-icon ${item.icon_class || ""}"></span>
            <span class="menu-text">${item.title || ""}</span>
            <span class="toggle-icon"></span>
          `;
          listItem.appendChild(link);
          sidebarNav.appendChild(listItem);
        }
      }
    });
  }
}

fetchDataFromAPI()
  .then((data) => {
    populateSidebar(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
