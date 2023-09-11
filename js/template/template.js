import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
export let Url = "https://simbe-dev.ulbi.ac.id/api/v1/siklus"
export let UrlKts = "https://simbe-dev.ulbi.ac.id/api/v1/kts"
export let urlPostKts = "https://simbe-dev.ulbi.ac.id/api/v1/kts/add";
export let urlPostSiklus = "https://simbe-dev.ulbi.ac.id/api/v1/siklus/add"
export let UrlGetJenjang = "https://simbe-dev.ulbi.ac.id/api/v1/jenjang"
export let UrlPostJenjang = "https://simbe-dev.ulbi.ac.id/api/v1/jenjang/add"
// export let token = "v4.public.eyJleHAiOiIyMDIzLTA5LTExVDEyOjQwOjE4KzA3OjAwIiwiaWF0IjoiMjAyMy0wOS0xMVQxMDo0MDoxOCswNzowMCIsImlkIjoiNjI4NTE1NjAwNzEzNyIsIm5iZiI6IjIwMjMtMDktMTFUMTA6NDA6MTgrMDc6MDAifVivGg9asQL529PDBz8ovNKe6NBWMtSBt6l64YAxtfVrQDeeQdHQuI_0ll1kSGbMa6igTQ8AvYmbLbIoYwSosAY"
export let token = CihuyGetCookie("login")
export const tambahDataButton = document.getElementById("simpanbutt");