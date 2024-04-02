import { getIdAmiFromURL } from "https://c-craftjs.github.io/simpelbi/paramurl.js";
const addButton = document.getElementById("addbutton");

// Tambahkan event listener ke tombol
addButton.addEventListener("click", () => {
  // Ambil id_ami dari URL
  const currentURL = window.location.href;
  const url = new URL(currentURL);
  const id_ami = url.searchParams.get("id_ami");
  const id_prodi_unit = url.searchParams.get("id_prodi_unit");

  // Arahkan pengguna ke halaman "pengawasan-audit-add" dengan menyertakan parameter id_ami
  if (id_ami) {
    window.location.href = `pengawasan-audit-tambah.html?id_ami=${id_ami}&id_prodi_unit=${id_prodi_unit}`;
  } else {
    // Handle jika id_ami tidak ditemukan dalam URL
    console.log("Parameter id_ami tidak ditemukan dalam URL.");
  }
});
