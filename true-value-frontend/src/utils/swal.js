import Swal from 'sweetalert2';

const showAlert = ({ title, text, icon = 'success', confirmButtonText = 'OK', ...rest }) => {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonText,
        confirmButtonColor: '#13ec13',
        background: '#ffffff',
        color: '#18181b',
        iconColor: icon === 'success' ? '#13ec13' : icon === 'error' ? '#ef4444' : '#f59e0b',
        customClass: {
            popup: 'rounded-xl border border-gray-100 shadow-2xl font-display',
            title: 'text-2xl font-bold font-display',
            confirmButton: 'rounded-lg px-8 py-3 font-bold transition-transform active:scale-95',
            cancelButton: 'rounded-lg px-8 py-3 font-bold transition-transform active:scale-95 ml-2'
        },
        ...rest
    });
};

showAlert.showLoading = Swal.showLoading;
showAlert.close = Swal.close;
showAlert.showValidationMessage = Swal.showValidationMessage;

showAlert.confirm = ({ title, text, icon = 'question', confirmButtonText = 'Proceed', cancelButtonText = 'Cancel' }) => {
    return Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor: '#13ec13',
        cancelButtonColor: '#ef4444',
        confirmButtonText,
        cancelButtonText,
        background: '#ffffff',
        color: '#18181b',
        customClass: {
            popup: 'rounded-2xl border border-gray-100 shadow-2xl font-display',
            title: 'text-2xl font-bold font-display',
            confirmButton: 'rounded-xl px-8 py-3 font-bold transition-transform active:scale-95',
            cancelButton: 'rounded-xl px-8 py-3 font-bold transition-transform active:scale-95 ml-3'
        }
    }).then((result) => result.isConfirmed);
};

export const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#ffffff',
    color: '#18181b',
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

export default showAlert;
