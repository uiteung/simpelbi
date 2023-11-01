import {
  //   CihuyDataAPI,
  //   CihuyPostApi,
  //   CihuyDeleteAPI,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import {
  token,
  UrlGetFoto,
  //   UrlGetUsersFakultas,
  //   UrlGetJenjang,
  //   UrlGetSiklus,
} from "../js/template/template.js";
import { getIdAmiFromURL } from "https://c-craftjs.github.io/simpelbi/paramurl.js";

const sistemDokumenSelect = document.getElementById("sistemDokumen");
const lainnyaInput = document.getElementById("lainnyaInput");
sistemDokumenSelect.addEventListener("change", function () {
  const selectedValue =
    sistemDokumenSelect.value === "Tidak" ||
    sistemDokumenSelect.value === "Lainnya";
  if (selectedValue) {
    lainnyaInput.style.display = "block";
  } else {
    lainnyaInput.style.display = "none";
  }
});
// Update Data Kesimpulan
function updateDataKesimpulan(idAmi, ckpLengkap, sebutkan) {
  // Buat URL sesuai dengan ID AMI yang diberikan
  const url = `https://simbe-dev.ulbi.ac.id/api/v1/kesimpulan/updatebyami?id_ami=${encodeURIComponent(
    idAmi
  )}`;
  const kesimpulanData = {
    ckp_lengkap: ckpLengkap,
    sebutkan: sebutkan,
  };

  // Kirim permintaan PUT dengan data mekanisme
  CihuyUpdateApi(url, token, kesimpulanData, (error, response) => {
    if (error) {
      console.error("Terjadi kesalahan:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat memperbarui data mekanisme.",
      });
    } else {
      console.log("Respon sukses:", response);
      Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: "Data mekanisme berhasil diperbarui.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // Refresh halaman atau lakukan tindakan lain yang diperlukan
        window.history.back(location.reload);
      });
    }
  });
}

// Tambahkan event listener untuk tombol "Simpan"
const simpanButton = document.getElementById("simpanButton");
simpanButton.addEventListener("click", function (e) {
  e.preventDefault();

  // Mendapatkan 'id_ami' dari URL
  const idAmi = getIdAmiFromURL();

  // Mendapatkan pilihan dari dropdown
  const dropdown = document.getElementById("sistemDokumen");
  const ckpLengkap = dropdown.value;

  // Mendapatkan teks kesimpulan dari textarea
  const kesimpulanTextarea = document.getElementById("question2");
  const sebutkan = kesimpulanTextarea.value;

  updateDataKesimpulan(idAmi, ckpLengkap, sebutkan);
});
