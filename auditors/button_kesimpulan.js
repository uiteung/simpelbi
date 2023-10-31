const editButton = document.getElementById("editButton");

editButton.addEventListener("click", function () {
  const editButton = document.getElementById("editButton");
  const currentURL = window.location.href;
  const url = new URL(currentURL);
  const id_ami = url.searchParams.get("id_ami");
  if (id_ami) {
    window.location.href = `pengawasan-kesimpulan-edit.html?id_ami=${id_ami}`;
  } else {
    // Handle jika id_ami tidak ditemukan dalam URL
    console.log("Parameter id_ami tidak ditemukan dalam URL.");
  }
});
