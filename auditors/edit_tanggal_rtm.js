import { getIdAmiFromURL } from "https://c-craftjs.github.io/simpelbi/paramurl.js";

document.getElementById("editbutton").addEventListener("click", function () {
  const idAmi = getIdAmiFromURL();
  if (idAmi) {
    window.location.href = `pengawasan-tanggal_rtm-edit.html?id_ami=${idAmi}`;
  } else {
    alert("Parameter 'id_ami' tidak ditemukan dalam URL");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Fungsi untuk menghapus cookie
  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // Ambil elemen Sign Out
  const signoutButton = document.querySelector(".nav-author__signout");

  // Tambahkan event listener untuk logout
  signoutButton.addEventListener("click", (event) => {
    event.preventDefault(); // Mencegah perilaku default <a>

    // Hapus cookie yang terkait dengan login
    deleteCookie("login");

    // Arahkan pengguna ke halaman yang diinginkan
    window.location.href = signoutButton.getAttribute("href");
  });
});
