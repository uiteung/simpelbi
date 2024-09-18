// Fungsi untuk menampilkan loader
function showLoader() {
    document.querySelector('.loader-layout').classList.remove('hidden');
  }
  
  // Fungsi untuk menyembunyikan loader
  function hideLoader() {
    document.querySelector('.loader-layout').classList.add('hidden');
  }
  
  // Tampilkan loader saat halaman sedang dimuat
  window.addEventListener('load', () => {
    hideLoader();  // Sembunyikan loader setelah halaman selesai dimuat
  });
  
  // Untuk menampilkan loader jika perlu sebelum proses asinkron
  function performActionWithLoader(action) {
    showLoader();  // Tampilkan loader
    setTimeout(() => {
      action();
      hideLoader();  // Sembunyikan loader setelah tindakan selesai
    }, 1000); // Simulasi waktu untuk memuat, ubah ini sesuai kebutuhan
  }
  