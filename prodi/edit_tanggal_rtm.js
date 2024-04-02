import { getIdAmiFromURL } from "https://c-craftjs.github.io/simpelbi/paramurl.js";

document.getElementById("editbutton").addEventListener("click", function () {
  const idAmi = getIdAmiFromURL();
  if (idAmi) {
    window.location.href = `pengawasan-tanggal_rtm-edit.html?id_ami=${idAmi}`;
  } else {
    alert("Parameter 'id_ami' tidak ditemukan dalam URL");
  }
});
