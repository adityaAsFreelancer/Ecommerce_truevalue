import Swal from 'sweetalert2';

// ─── Base SweetAlert2 config ──────────────────────────────────────────────────
const baseConfig = {
    background: '#ffffff',
    color: '#18181b',
    confirmButtonColor: '#5EC401',
    cancelButtonColor: '#ef4444',
    customClass: {
        popup:
            'swal-popup-premium rounded-3xl border border-gray-100 shadow-2xl overflow-hidden',
        title: 'swal-title font-black text-gray-900 tracking-tight',
        htmlContainer: 'swal-text text-gray-500 font-medium',
        confirmButton:
            'swal-confirm rounded-2xl px-8 py-3 font-bold transition-all active:scale-95 shadow-lg shadow-green-200 hover:scale-105',
        cancelButton:
            'swal-cancel rounded-2xl px-8 py-3 font-bold transition-all active:scale-95 ml-2 hover:scale-105',
        icon: 'swal-icon',
    },
    showClass: { popup: 'swal-show' },
    hideClass: { popup: 'swal-hide' },
};

// ─── Main alert function ───────────────────────────────────────────────────────
const showAlert = ({
    title,
    text,
    html,
    icon = 'success',
    confirmButtonText = 'OK',
    ...rest
}) =>
    Swal.fire({
        ...baseConfig,
        title,
        text,
        html,
        icon,
        confirmButtonText,
        iconColor:
            icon === 'success'
                ? '#5EC401'
                : icon === 'error'
                    ? '#ef4444'
                    : icon === 'warning'
                        ? '#f59e0b'
                        : icon === 'info'
                            ? '#3b82f6'
                            : '#5EC401',
        ...rest,
    });

// Static helpers
showAlert.showLoading = Swal.showLoading;
showAlert.close = Swal.close;
showAlert.isVisible = Swal.isVisible;
showAlert.showValidationMessage = Swal.showValidationMessage;
showAlert.resetValidationMessage = Swal.resetValidationMessage;
showAlert.getPopup = Swal.getPopup;

// ─── Shorthand Methods ───────────────────────────────────────────────────────
showAlert.success = (params) => showAlert({ ...params, icon: 'success' });
showAlert.error = (params) => showAlert({ ...params, icon: 'error' });
showAlert.warning = (params) => showAlert({ ...params, icon: 'warning' });
showAlert.info = (params) => showAlert({ ...params, icon: 'info' });

// ─── Confirm dialog ────────────────────────────────────────────────────────────
showAlert.confirm = ({
    title = 'Are you sure?',
    text = 'This action cannot be undone.',
    icon = 'warning',
    confirmButtonText = 'Yes, Proceed',
    cancelButtonText = 'Cancel',
    confirmButtonColor = '#5EC401',
    cancelButtonColor = '#6b7280',
    ...rest
}) =>
    Swal.fire({
        ...baseConfig,
        title,
        text,
        icon,
        iconColor: '#f59e0b',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor,
        cancelButtonColor,
        ...rest,
    }).then((result) => result.isConfirmed);

// ─── Danger confirm (for delete actions) ──────────────────────────────────────
showAlert.danger = ({
    title = 'Delete this item?',
    text = 'This cannot be reversed.',
    confirmButtonText = 'Yes, Delete',
    cancelButtonText = 'Cancel',
    ...rest
}) =>
    Swal.fire({
        ...baseConfig,
        title,
        text,
        icon: 'warning',
        iconColor: '#ef4444',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        ...rest,
    }).then((result) => result.isConfirmed);

// ─── Toast notification (top-right) ──────────────────────────────────────────
export const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#ffffff',
    color: '#18181b',
    customClass: {
        popup: 'rounded-2xl border border-gray-100 shadow-xl',
        title: 'text-sm font-bold',
    },
    didOpen: (toastEl) => {
        toastEl.addEventListener('mouseenter', Swal.stopTimer);
        toastEl.addEventListener('mouseleave', Swal.resumeTimer);
    },
});

// ─── Bottom-center toast (mobile-friendly) ────────────────────────────────────
export const bottomToast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
    background: '#18181b',
    color: '#ffffff',
    customClass: {
        popup: 'rounded-2xl shadow-2xl border border-white/10',
        title: 'text-sm font-bold',
    },
});

export default showAlert;
