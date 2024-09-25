import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
import { CihuyGetHeaders } from "https://c-craftjs.github.io/api/api.js";
import { qrController } from "https://cdn.jsdelivr.net/gh/whatsauth/js@0.3.3/whatsauth.js";
import { wauthparam } from "https://cdn.jsdelivr.net/gh/whatsauth/js@0.3.3/config.js";

// Fungsi utama yang menggabungkan kedua alur
document.addEventListener("DOMContentLoaded", async () => {
  let token = CihuyGetCookie("login");

  // Jika tidak ada token, langsung tampilkan SweetAlert untuk login QR code
  if (!token) {
    openSweetAlertLogin();
    return; // Hentikan eksekusi lebih lanjut jika tidak ada token
  }

  // Jika token ada, periksa validitas login
  const postApiUrlMenu = "https://simbe-dev.ulbi.ac.id/api/v1/menu/";

  try {
    // Lakukan permintaan POST
    const postResult = await CihuyGetHeaders(postApiUrlMenu, token);
    const responseData = JSON.parse(postResult);

    // Proses validasi dan pengalihan halaman
    processResponseData(responseData);
  } catch (error) {
    console.error("Error:", error.message || error);
    openSweetAlertLogin(); // Tampilkan SweetAlert jika terjadi error (misal 401)
  }
});

// Fungsi untuk memproses respons dari API
function processResponseData(responseData) {
  let dataUrl = responseData.data;
  let targetPage = "";

  if (
    responseData.code === 400 &&
    !responseData.success &&
    responseData.status === "Data user level tidak ditemukan" &&
    !responseData.data
  ) {
    window.location.href = "https://euis.ulbi.ac.id/simpelbi/404.html";
    return;
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
    !responseData.success &&
    responseData.status === "Unauthorize Token" &&
    !responseData.data
  ) {
    targetPage = "404.html";
  } else {
    console.error("URL tidak sesuai");
    targetPage = "404.html";
  }

  const finalUrl = `https://euis.ulbi.ac.id/simpelbi${dataUrl}/${targetPage}`;
  window.location.href = finalUrl;
}

// Fungsi sweet alert untuk QR Code WhatsAuth login
function openSweetAlertLogin() {
  Swal.fire({
    icon: "info",
    title: "<strong>Login <u>Dulu</u> ya kaa</strong>",
    html: `
        <div class="flex justify-center mt-2 mb-4" id="whatsauthqr">
        <svg class="lds-microsoft" width="60px" height="60px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"></svg>
        </div>
        <p class="font-bold text-center mb-4" id="whatsauthcounter">Refresh your browser to get new QR</p>
        <p>Pastikan waktu hitung mundur cukup untuk melakukan scan dan kirim token</p>
        `,
    didRender: function () {
      // Definisikan wauthparam (URL WebSocket dan keyword)
      wauthparam.auth_ws = "d3NzOi8vZ3cudWxiaS5hYy5pZC93cy93aGF0c2F1dGgvcHVibGlj";
      wauthparam.keyword = "aHR0cHM6Ly93YS5tZS82MjgxMTIwMDAyNzk/dGV4dD13aDR0NWF1dGgw";
      wauthparam.redirect = "#" + crypto.randomUUID();

      qrController(wauthparam);

      let wsconn = new WebSocket(atob(wauthparam.auth_ws));

      wsconn.onopen = function () {
        console.log("WebSocket connected, waiting for QR scan...");
      };

      wsconn.onmessage = function (evt) {
        let result = evt.data; // Data hasil pemindaian dari server
        catcher(result); // Memproses hasil login setelah QR code berhasil dipindai
      };

      wsconn.onerror = function (error) {
        console.error("WebSocket error:", error);
      };

      wsconn.onclose = function () {
        console.log("WebSocket connection closed.");
      };
    },
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
  });
}

// Fungsi untuk menangani aksi pengguna setelah pemindaian QR code
function catcher(result) {
  if (result.length > 2) {
    const jsonres = JSON.parse(result); // Hasil login dari pemindaian QR code
    console.log("Login berhasil, memproses hasil login...");

    const tokenLifetime = 18; // Misal 18 jam
    setCookieWithExpireHour("login", jsonres.login, tokenLifetime);
    setCookieWithExpireHour("ua", btoa(jsonres.user_id + "-" + jsonres.user_name), tokenLifetime);
    window.location.reload();

    // Menampilkan pesan sukses dan refresh otomatis
    Swal.fire({
      icon: "success",
      title: "Login berhasil!",
      text: "Halaman akan di-refresh dalam 3 detik...",
      showConfirmButton: false,
      timer: 30000 // Tunggu 3 detik sebelum refresh otomatis
    });

  }
}

export function setCookieWithExpireHour(cname, cvalue, exhour) {
  const d = new Date(); // Get tanggal sekarang
  d.setTime(d.getTime() + (exhour * 60 * 60 * 1000)); // Set waktu expired dalam jam
  let expires = "expires=" + d.toUTCString(); // Konvert waktu expired ke UTC
  
  let domain = "domain=.ulbi.ac.id"; 

  document.cookie = cname + "=" + cvalue + ";" + expires + ";" + domain + ";path=/";
  console.log(`Cookie set: ${cname}=${cvalue}; ${expires}; ${domain}; path=/`);
}