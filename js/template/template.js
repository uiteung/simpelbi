import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
export let Url = "https://simbe-dev.ulbi.ac.id/api/v1/siklus"
export let UrlKts = "https://simbe-dev.ulbi.ac.id/api/v1/kts"
// export let token = "v4.public.eyJleHAiOiIyMDIzLTA5LTEwVDIzOjQ5OjIxKzA3OjAwIiwiaWF0IjoiMjAyMy0wOS0xMFQyMTo0OToyMSswNzowMCIsImlkIjoiNjI4NTE1NjAwNzEzNyIsIm5iZiI6IjIwMjMtMDktMTBUMjE6NDk6MjErMDc6MDAifanxcHvQm1astJHwVeGCNCmHrhtHWOP_WM3lHw-yfTB27Q5-ZsgkYckNbDwyTc6CIRFnNPkynJLxfRSpg6N4hQM"
export let token = CihuyGetCookie("login")
export const tambahDataButton = document.getElementById("simpanbutt");