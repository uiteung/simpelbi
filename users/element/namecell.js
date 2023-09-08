export function CihuyNameCell(className, name) {
  const cell = document.createElement("td");
  const div = document.createElement("div");
  div.className = "d-flex";
  const titleDiv = document.createElement("div");
  titleDiv.className = "userDatatable-inline-title";
  const link = document.createElement("a");
  link.className = className;
  link.href = "#";
  const h6 = document.createElement("h6");
  h6.textContent = name;
  link.appendChild(h6);
  titleDiv.appendChild(link);
  div.appendChild(titleDiv);
  cell.appendChild(div);
  return cell;
}
