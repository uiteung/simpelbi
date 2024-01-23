import {
  CihuyDataAPI,
  CihuyPostApi,
  //   CihuyDeleteAPI,
  CihuyUpdateApi,
} from "https://c-craftjs.github.io/simpelbi/api.js";
import {
  token,
  UrlGetKts,
  UrlGetStandar,
  //   UrlGetUsersFakultas,
  //   UrlGetJenjang,
  //   UrlGetSiklus,
} from "../js/template/template.js";
function setupFormVisibility() {
  var jawabanSelect = document.getElementById("jawabanindikator");
  jawabanSelect.addEventListener("change", function () {
    var selectedValue = jawabanSelect.value;
    var formElementsToHide = document.querySelectorAll(".form-group-to-hide");
    formElementsToHide.forEach(function (element) {
      if (selectedValue === "Ya") {
        element.style.visibility = "hidden"; // Menyembunyikan elemen
      } else {
        element.style.visibility = "visible";
      }
    });
  });
}

import { populateUserProfile } from "https://c-craftjs.github.io/simpelbi/profile.js";

// Untuk Get Data Profile
populateUserProfile();

const urlParams = new URLSearchParams(window.location.search);
const idAmi = urlParams.get("id_ami");
const idAudit = urlParams.get("id_audit");
// const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/getbyami?id_ami=${idAmi}`;
// const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/standar/getbyprodiunit?id_prodi_unit=${idProdiUnit}`;
const apiUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/getallbyami?id_ami=${idAmi}`;

const apiUpdateUrl = `https://simbe-dev.ulbi.ac.id/api/v1/audit/addbyami?id_ami=${idAmi}`;
const apiUrlProdiUnit = `https://simbe-dev.ulbi.ac.id/api/v1/audit/addlinkperbaikan?id_audit=${idAudit}`;

document.getElementById("buttoninsert").addEventListener("click", function () {
  // Show a confirmation dialog with SweetAlert
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, save it!",
  }).then((result) => {
    if (result.isConfirmed) {
      // Retrieve form values
      const linkDokumen = document.getElementById("linkdokumen").value;

      // Construct the data object
      const data = {
        link_perbaikan: linkDokumen,
      };

      // Call the UpdateApi function
      CihuyUpdateApi(apiUrlProdiUnit, token, data, (error, response) => {
        if (error) {
          // Handle errors
          console.error(error);
          // Show error message using SweetAlert
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to update data.",
          });
        } else {
          // Handle the response as needed
          console.log(response);

          // Show success message using SweetAlert
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Data successfully updated.",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            setTimeout(() => {
              const redirectUrl = `https://euis.ulbi.ac.id/simpelbi/prodi/perbaikan-form.html`;
              window.location.href = redirectUrl;
            }, 1000);
          });
        }
      });
    }
  });
});
