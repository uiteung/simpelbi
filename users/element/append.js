export function CihuyAppend(row, ...cells) {
  cells.forEach((cell) => {
    row.appendChild(cell);
  });
}
