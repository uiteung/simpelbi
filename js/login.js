document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("log-in");

    // Fungsi untuk mengatur cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Waktu dalam milidetik
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }

    // Fungsi untuk melakukan validasi peran dan redirect
    async function validateRoleAndRedirect(token) {
        if (token) {
            try {
                // Lakukan permintaan GET ke endpoint untuk validasi peran
                const response = await fetch(
                    "https://simbe-dev.ulbi.ac.id/api/v1/menu/", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            login: token,
                        },
                    }
                );

                // Tangani respon dari server
                if (response.ok) {
                    const responseData = await response.json();

                    const dataUrl = responseData.data;

                    // Tentukan halaman tujuan berdasarkan data URL
                    let targetPage = "";
                    if (
                        responseData.code === 400 &&
                        responseData.success === false &&
                        responseData.status === "Data user level tidak ditemukan" &&
                        responseData.data === null
                    ) {
                        window.location.href = "https://euis.ulbi.ac.id/simpelbi/404.html";
                        return;
                    } else if (dataUrl === "/admins") {
                        targetPage = "dashboard-admins.html";
                    } else if (dataUrl === "/prodi") {
                        targetPage = "dashboard-prodi.html";
                    } else if (dataUrl === "/fakultas") {
                        targetPage = "dashboard-fakultas.html";
                    } else if (dataUrl === "/auditors") {
                        targetPage = "dashboard-auditor.html";
                    } else if (
                        responseData.code === 401 &&
                        responseData.success === false &&
                        responseData.status === "Unauthorize Token" &&
                        responseData.data === null
                    ) {
                        targetPage = "404.html";
                    } else {
                        targetPage = "404.html";
                        console.error("URL tidak sesuai");
                        return;
                    }

                    // Konstruksi URL akhir
                    const finalUrl = `https://euis.ulbi.ac.id/simpelbi${dataUrl}/${targetPage}`;

                    // Arahkan pengguna ke URL akhir
                    window.location.href = finalUrl;
                } else {
                    const errorData = await response.json();
                    console.error("Error dalam validasi peran:", errorData);
                    Swal.fire({
                        icon: "error",
                        title: "Validasi Gagal",
                        text: errorData.message || "Terjadi kesalahan saat validasi peran.",
                    });
                }
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Terjadi Kesalahan",
                    text: "Silakan coba lagi nanti.",
                });
            }
        }
    }

    form.addEventListener("submit", async(event) => {
        event.preventDefault(); // Mencegah form reload halaman

        // Ambil data dari form
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Validasi sederhana
        if (!email || !password) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Mohon isi data Anda dengan lengkap!",
            });
            return;
        }

        // Data yang akan dikirim
        const data = {
            email: email,
            password: password,
        };

        try {
            // Kirim request ke server menggunakan fetch
            const response = await fetch(
                "https://simbe-dev.ulbi.ac.id/api/v1/new/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            // Tangani respon dari server
            if (response.ok) {
                const result = await response.json();
                console.log(result);

                const token = result.data.token;

                // Simpan token ke cookie
                setCookie("login", token, 1); // Token berlaku selama sehari
                Swal.fire({
                    icon: "success",
                    title: result.message,
                    text: `Selamat Datang, ${result.data.nama.String}!`,
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        // Panggil fungsi validasi peran dan redirect
                        await validateRoleAndRedirect(token);
                    }
                });
            } else {
                let errorMessage = "Login gagal. Silakan coba lagi.";
                try {
                    const error = await response.json();
                    errorMessage =
                        error.message || error.status || error.error || errorMessage;
                } catch (e) {
                    // Jika response tidak dalam format JSON
                    errorMessage = await response.text();
                }

                console.error(errorMessage);

                Swal.fire({
                    icon: "error",
                    title: "Login Gagal",
                    text: errorMessage,
                });
            }
        } catch (err) {
            console.error("Error:", err);
            Swal.fire({
                icon: "error",
                title: "Terjadi Kesalahan",
                text: "Silakan coba lagi nanti.",
            });
        }
    });
});

function togglePassword() {
    const passwordInput = document.getElementById("password");
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
}