import { CihuyGetCookie } from "https://c-craftjs.github.io/cookies/cookies.js";

// Endpoint GET
export let UrlGetSiklus = "https://simbe-dev.ulbi.ac.id/api/v1/siklus";
export let UrlGetKts = "https://simbe-dev.ulbi.ac.id/api/v1/kts";
export let UrlGetJenjang = "https://simbe-dev.ulbi.ac.id/api/v1/jenjang";
export let UrlGetStandar = "https://simbe-dev.ulbi.ac.id/api/v1/standar";
export let UrlGetUsersAuditor = "https://simbe-dev.ulbi.ac.id/api/v1/auditors/";
export let UrlGetUsersAdmin = "https://simbe-dev.ulbi.ac.id/api/v1/admins/";
export let UrlGetUsersFakultas =
  "https://simbe-dev.ulbi.ac.id/api/v1/fakultas/";
export let UrlGetUsersProdi = "https://simbe-dev.ulbi.ac.id/api/v1/prodi/";
export let UrlGetAmi = "https://simbe-dev.ulbi.ac.id/api/v1/ami";

// Endpoint POST
export let UrlPostKts = "https://simbe-dev.ulbi.ac.id/api/v1/kts/add";
export let UrlPostSiklus = "https://simbe-dev.ulbi.ac.id/api/v1/siklus/add";
export let UrlPostJenjang = "https://simbe-dev.ulbi.ac.id/api/v1/jenjang/add";
export let UrlPostStandar = "https://simbe-dev.ulbi.ac.id/api/v1/standar/add";
export let UrlPostUsersAdmin = "https://simbe-dev.ulbi.ac.id/api/v1/admins/add";
export let UrlPostAmi = "http://simbe-dev.ulbi.ac.id/api/v1/ami/add";
export let UrlPostUsersFakultas =
  "https://simbe-dev.ulbi.ac.id/api/v1/fakultas/add";

// Endpoint DELETE
// export let UrlDeleteStandar = `https://simbe-dev.ulbi.ac.id/api/v1/standar/delete?idstandar=${standarId}`;

// export let token = CihuyGetCookie("login")
export const tambahDataButton = document.getElementById("simpanbutt");

// export let token =
//   "v4.public.eyJleHAiOiIyMDIzLTA5LTEyVDEyOjQzOjI1KzA3OjAwIiwiaWF0IjoiMjAyMy0wOS0xMlQxMDo0MzoyNSswNzowMCIsImlkIjoiNjI4NTE1NjAwNzEzNyIsIm5iZiI6IjIwMjMtMDktMTJUMTA6NDM6MjUrMDc6MDAifRq3smBKnnIws4lmWjrg4lUtgPrCDcKDw-8qmHr1PAZcrRRz29DBDQgFdOr-6lMbn0muOOPbWa2LmIs6vqw_dwc";
export const token = CihuyGetCookie("login");
