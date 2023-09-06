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

  data.data.forEach((item) => {
    const listItem = document.createElement("li");

    if (item.is_main_menu === 1) {
      listItem.className = "has-child";
      const link = document.createElement("a");
      const fullURL = new URL(item.url, "https://euis.ulbi.ac.id/simpelbi/");
      link.href = fullURL.toString();
      link.className = "action";
      link.innerHTML = `
        <span class="nav-icon ${item.icon_class}"></span>
        <span class="menu-text">${item.title}</span>
        <span class="toggle-icon"></span>
      `;

      const submenu = document.createElement("ul");

      if (item.sub_menu && Array.isArray(item.sub_menu)) {
        item.sub_menu.forEach((subItem) => {
          const subListItem = document.createElement("li");
          const subLink = document.createElement("a");
          const subFullURL = new URL(
            subItem.url,
            "https://euis.ulbi.ac.id/simpelbi/"
          );
          subLink.href = subFullURL.toString();
          subLink.textContent = subItem.title;
          subListItem.appendChild(subLink);
          submenu.appendChild(subListItem);
        });
      }

      listItem.appendChild(link);
      listItem.appendChild(submenu);
    } else {
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

fetchDataFromAPI()
  .then((data) => {
    populateSidebar(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
