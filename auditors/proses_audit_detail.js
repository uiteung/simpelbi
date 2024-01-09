document.addEventListener("DOMContentLoaded", function () {
  // Menangkap elemen select dengan id jawabanindikator
  var jawabanSelect = document.getElementById("jawabanindikator");

  // Menambahkan event listener untuk menanggapi perubahan pada select
  jawabanSelect.addEventListener("change", function () {
    // Mendapatkan nilai yang dipilih
    var selectedValue = jawabanSelect.value;

    // Mendapatkan elemen-elemen form yang ingin di-hide
    var formElementsToHide = document.querySelectorAll(".form-group-to-hide");

    // Iterasi melalui elemen-elemen dan menentukan apakah perlu di-hide atau ditampilkan
    formElementsToHide.forEach(function (element) {
      if (selectedValue === "Tidak") {
        element.style.display = "none"; // Menyembunyikan elemen
      } else {
        element.style.display = "block"; // Menampilkan elemen
      }
    });
  });
});
