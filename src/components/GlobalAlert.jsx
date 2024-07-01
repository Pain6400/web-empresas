// src/components/GlobalAlert.js
import Swal from 'sweetalert2';

const GlobalAlert = {
  showError: (title, text) => {
    Swal.fire({
      icon: 'error',
      title: title || 'Error',
      text: text || 'Something went wrong!',
    });
  },
  showSuccess: (title, text) => {
    Swal.fire({
      icon: 'success',
      title: title || 'Success',
      text: text || 'Operation completed successfully!',
    });
  },
  showWarning: (title, text, onConfirm) => {
    Swal.fire({
      icon: 'warning',
      title: title || 'Warning',
      text: text || 'Please be cautious!',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed && onConfirm) {
        onConfirm();
      }
    });
  },
  // Add more methods if needed
};

export default GlobalAlert;
