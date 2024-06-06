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
  showWarning: (title, text) => {
    Swal.fire({
      icon: 'warning',
      title: title || 'Warning',
      text: text || 'Please be cautious!',
    });
  },
  // Add more methods if needed
};

export default GlobalAlert;
