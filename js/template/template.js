import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
export let Url = "https://simbe-dev.ulbi.ac.id/api/v1/siklus"
export let UrlKts = "https://simbe-dev.ulbi.ac.id/api/v1/kts"
export let urlPostKts = "https://simbe-dev.ulbi.ac.id/api/v1/kts/add";
export let urlPostSiklus = "https://simbe-dev.ulbi.ac.id/api/v1/siklus/add"
export let UrlGetJenjang = "https://simbe-dev.ulbi.ac.id/api/v1/jenjang"
export let UrlPostJenjang = "https://simbe-dev.ulbi.ac.id/api/v1/jenjang/add"
export let UrlGetStandar = "https://simbe-dev.ulbi.ac.id/api/v1/standar";
export let UrlAMI = "https://simbe-dev.ulbi.ac.id/api/v1/ami"
// export let token = "v4.public.eyJleHAiOiIyMDIzLTA5LTEyVDEyOjQzOjI1KzA3OjAwIiwiaWF0IjoiMjAyMy0wOS0xMlQxMDo0MzoyNSswNzowMCIsImlkIjoiNjI4NTE1NjAwNzEzNyIsIm5iZiI6IjIwMjMtMDktMTJUMTA6NDM6MjUrMDc6MDAifRq3smBKnnIws4lmWjrg4lUtgPrCDcKDw-8qmHr1PAZcrRRz29DBDQgFdOr-6lMbn0muOOPbWa2LmIs6vqw_dwc"
export let token = CihuyGetCookie("login")
export const tambahDataButton = document.getElementById("simpanbutt");