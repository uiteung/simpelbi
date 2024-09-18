// Burger menus
document.addEventListener('DOMContentLoaded', function() {
    // open burger menu
    const burger = document.querySelectorAll('.navbar-burger');
    const menu = document.querySelectorAll('.navbar-menu');

    if (burger.length && menu.length) {
        for (var i = 0; i < burger.length; i++) {
            burger[i].addEventListener('click', function() {
                for (var j = 0; j < menu.length; j++) {
                    menu[j].classList.toggle('hidden');
                }
            });
        }
    }

    // close burger menu
    const close = document.querySelectorAll('.navbar-close');
    const backdrop = document.querySelectorAll('.navbar-backdrop');

    if (close.length) {
        for (var i = 0; i < close.length; i++) {
            close[i].addEventListener('click', function() {
                for (var j = 0; j < menu.length; j++) {
                    menu[j].classList.toggle('hidden');
                }
            });
        }
    }

    if (backdrop.length) {
        for (var i = 0; i < backdrop.length; i++) {
            backdrop[i].addEventListener('click', function() {
                for (var j = 0; j < menu.length; j++) {
                    menu[j].classList.toggle('hidden');
                }
            });
        }
    }

    // Simpelbi logic
    const simpelbiCard = document.getElementById("simpelbiCard");

    if (simpelbiCard) {
        simpelbiCard.addEventListener("click", async (event) => {
            event.preventDefault();

            const postApiUrlMenu = "https://simbe-dev.ulbi.ac.id/api/v1/menu/";

            try {
                // Dapatkan token dari cookie yang sudah ada
                let token = CihuyGetCookie("login");

                // Lakukan permintaan POST
                const postResult = await CihuyGetHeaders(postApiUrlMenu, token);

                // Parse respons JSON dari permintaan POST
                const responseData = JSON.parse(postResult);

                // Dapatkan data URL dari respons
                const dataUrl = responseData.data;

                // Tentukan halaman tujuan berdasarkan data URL
                let targetPage = "";
                if (
                    responseData.code === 400 &&
                    responseData.success === false &&
                    responseData.status === "Data user level tidak ditemukan" &&
                    responseData.data === null
                ) {
                    window.location.href = "https://euis.ulbi.ac.id/simpelbi/404.html";
                } else if (dataUrl === "/admins") {
                    targetPage = "dashboard-admins.html";
                } else if (dataUrl === "/prodi") {
                    targetPage = "dashboard-prodi.html";
                } else if (dataUrl === "/fakultas") {
                    targetPage = "dashboard-fakultas.html";
                } else if (dataUrl === "/auditors") {
                    targetPage = "dashboard-auditor.html";
                } else if (
                    responseData.code === 401 &&
                    responseData.success === false &&
                    responseData.status === "Unauthorize Token" &&
                    responseData.data === null
                ) {
                    targetPage = "404.html";
                } else {
                    targetPage = "404.html";
                    console.error("URL tidak sesuai");
                    return;
                }

                // Konstruksi URL akhir
                const finalUrl = `https://euis.ulbi.ac.id/simpelbi${dataUrl}/${targetPage}`;

                // Arahkan pengguna ke URL akhir
                window.location.href = finalUrl;
            } catch (error) {
                console.error("Error:", error);
            }
        });
    }
});