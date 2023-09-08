export function CihuyTableCell(className, textContent) {
  const cell = document.createElement("td");
  const div = document.createElement("div");
  div.className = className;
  div.textContent = textContent;
  cell.appendChild(div);
  return cell;
}
