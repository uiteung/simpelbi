import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";
export let Url = "https://simbe-dev.ulbi.ac.id/api/v1/siklus"
export let UrlKts = "https://simbe-dev.ulbi.ac.id/api/v1/kts"
export let urlPostKts = "https://simbe-dev.ulbi.ac.id/api/v1/kts/add";
export let urlPostSiklus = "https://simbe-dev.ulbi.ac.id/api/v1/siklus/add"
export let UrlGetJenjang = "https://simbe-dev.ulbi.ac.id/api/v1/jenjang"
export let UrlPostJenjang = "https://simbe-dev.ulbi.ac.id/api/v1/jenjang/add"
export let UrlGetStandar = "https://simbe-dev.ulbi.ac.id/api/v1/standar";
// export let token = "v4.public.eyJleHAiOiIyMDIzLTA5LTEyVDExOjUxOjQwKzA3OjAwIiwiaWF0IjoiMjAyMy0wOS0xMlQwOTo1MTo0MCswNzowMCIsImlkIjoiNjI4NTE1NjAwNzEzNyIsIm5iZiI6IjIwMjMtMDktMTJUMDk6NTE6NDArMDc6MDAifYKwrCmgvEbYNm0Kxcj3KQr0tHHhkzlf9OdP2FbEZVgSR0kw2YRUSccVQCjz4EqSZmq3Q6qIT8dMwGH7kLymPQA"
export let token = CihuyGetCookie("login")
export const tambahDataButton = document.getElementById("simpanbutt");