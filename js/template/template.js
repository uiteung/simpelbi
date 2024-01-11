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
export let UrlGetAmi = "https://simbe-dev.ulbi.ac.id/api/v1/ami/";
export let UrlGetFileProdi = "https://simbe-dev.ulbi.ac.id/api/v1/filesprodi/";
export let UrlGetMekanisme = "https://simbe-dev.ulbi.ac.id/api/v1/indikator/";
export let UrlGetFoto = "https://simbe-dev.ulbi.ac.id/api/v1/foto/";
export let UrlGetProfile = "https://simbe-dev.ulbi.ac.id/api/v1/profile/";
export let UrlGetAudit = "https://simbe-dev.ulbi.ac.id/api/v1/audit/";
export let UrlGetKesimpulan = "https://simbe-dev.ulbi.ac.id/api/v1/kesimpulan/";
export let UrlProfile = "https://simbe-dev.ulbi.ac.id/api/v1/profile/";
export let UrlRekapTemuan =
  "https://simbe-dev.ulbi.ac.id/api/v1/ami/rekaptemuan/";

export let urlGetKelompok = "https://simbe-dev.ulbi.ac.id/api/v1/prodi";

// Endpoint POST
export let UrlPostKts = "https://simbe-dev.ulbi.ac.id/api/v1/kts/add";
export let UrlPostSiklus = "https://simbe-dev.ulbi.ac.id/api/v1/siklus/add";
export let UrlPostJenjang = "https://simbe-dev.ulbi.ac.id/api/v1/jenjang/add";
export let UrlPostStandar = "https://simbe-dev.ulbi.ac.id/api/v1/standar/add";
export let UrlPostUsersAdmin = "https://simbe-dev.ulbi.ac.id/api/v1/admins/add";
export let UrlPostAmi = "https://simbe-dev.ulbi.ac.id/api/v1/ami/add";
export let UrlPostUsersFakultas =
  "https://simbe-dev.ulbi.ac.id/api/v1/fakultas/add";

// Endpoint DELETE
// export let UrlDeleteStandar = `https://simbe-dev.ulbi.ac.id/api/v1/standar/delete?idstandar=${standarId}`;

// export let token = CihuyGetCookie("login")
export const tambahDataButton = document.getElementById("simpanbutt");

export const token = CihuyGetCookie("login");
