export function ShowdataJenjang(data) {
    const tableBody = document.getElementById("content");
  
    // Kosongkan isi tabel saat ini
    tableBody.innerHTML = "";
    let nomor = 1;
  
    // Loop melalui data yang diterima dari API
    data.forEach((item) => {
      const barisBaru = document.createElement("tr");
      barisBaru.innerHTML = `
      <td>
                                          <div class="userDatatable-content">${nomor}</div>
                                       </td>
                                       <td>
                                          <div class="d-flex">
                                             <div class="userDatatable-inline-title">
                                                <a href="#" class="text-dark fw-500">
                                                   <h6>${item.jenjang} </h6>
                                                </a>
                                             </div>
                                          </div>
                                       </td>
                                       <td>
                                          <ul class="orderDatatable_actions mb-0 d-flex flex-wrap">
                                             <li>
                                                <a href="#" class="view">
                                                   <i class="uil uil-eye"></i>
                                                </a>
                                             </li>
                                             <li>
                                                <a href="#" class="edit">
                                                   <i class="uil uil-edit"></i>
                                                </a>
                                             </li>
                                             <li>
                                                <a href="#" class="remove">
                                                   <i class="uil uil-trash-alt"></i>
                                                </a>
                                             </li>
                                          </ul>
                                       </td>
        `;
      tableBody.appendChild(barisBaru);
      nomor++;
    });
  }