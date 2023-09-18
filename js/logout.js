document.addEventListener("DOMContentLoaded", function () {
    const confirmationModal = document.getElementById("confirmationModal");
    const cancelButton = document.getElementById("cancelButton");
    const confirmButton = document.getElementById("confirmButton");

    function showConfirmationModal() {
        confirmationModal.classList.add("active");
    }

    function hideConfirmationModal() {
        confirmationModal.classList.remove("active");
    }

    // Menampilkan modal saat tombol "Sign Out" diklik
    document.querySelector(".signout-button").addEventListener("click", function (event) {
        event.preventDefault(); // Menghentikan default navigasi link
        showConfirmationModal();
    });

    // Menyembunyikan modal saat tombol "Batal" diklik
    cancelButton.addEventListener("click", hideConfirmationModal);

    // Melakukan proses logout saat tombol "Logout" diklik
    confirmButton.addEventListener("click", function () {
        window.location.href = "/logout"; // Ganti dengan rute yang sesuai
    });
});
