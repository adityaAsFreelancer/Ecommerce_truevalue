import React, { useState, useEffect } from 'react';
import {
    Search, Shield, ShieldOff, User, Trash2,
    Mail, Ban, UserPlus, CheckCircle, Plus, Edit, Camera, Loader2
} from 'lucide-react';
import showAlert from '../../utils/swal';
import { useUser } from '../../context/UserContext';
import { api } from '../../utils/api';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        if (user?.role !== 'admin') {
            console.warn('ADMIN_USER_LIST: Unauthorized access attempt blocked in component.');
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await api('/admin/users');
            let all = response.data || [];
            if (searchTerm.trim()) {
                const q = searchTerm.toLowerCase();
                all = all.filter(u =>
                    u.name?.toLowerCase().includes(q) ||
                    u.email?.toLowerCase().includes(q)
                );
            }
            setUsers(all);
        } catch (error) {
            console.error('Fetch Users Error:', error);
            showAlert({ title: 'Error', text: 'Failed to load users.', icon: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, [searchTerm]);

    // ── Image Upload Helper ────────────────────────────────────
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('images', file);

        try {
            const response = await fetch('http://localhost:5000/api/upload/multiple', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('truevalue_token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                const url = data.data[0].url;
                return url.startsWith('http') ? url : `http://localhost:5000${url}`;
            }
            throw new Error(data.message || 'Upload failed');
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    };

    // ── Edit User ────────────────────────────────────────────────
    const handleEdit = (user) => {
        let currentAvatar = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;

        showAlert({
            title: 'Edit User Profile',
            html: `
                <div class="space-y-6 text-left p-2">
                    <div class="flex flex-col items-center justify-center space-y-3 mb-6">
                        <div class="relative group">
                            <div class="size-24 rounded-3xl bg-gray-50 border-4 border-white shadow-xl overflow-hidden">
                                <img id="swal-avatar-preview" src="${currentAvatar}" className="w-full h-full object-cover">
                            </div>
                            <label for="swal-file-input" class="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                <input id="swal-file-input" type="file" accept="image/*" class="hidden">
                            </label>
                        </div>
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update Profile Picture</p>
                    </div>

                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                        <input id="swal-name" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 font-bold" value="${user.name}">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                        <input id="swal-email" type="email" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 font-bold" value="${user.email}">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Role</label>
                        <select id="swal-role" class="swal2-select !w-full !m-0 !rounded-xl !border-2 !border-gray-100 !text-sm !font-bold">
                            <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                            <option value="vendor" ${user.role === 'vendor' ? 'selected' : ''}>Vendor</option>
                        </select>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Save Changes',
            didOpen: () => {
                const fileInput = document.getElementById('swal-file-input');
                const preview = document.getElementById('swal-avatar-preview');

                fileInput.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    // Show loading state on preview
                    preview.style.opacity = '0.5';

                    try {
                        const uploadedUrl = await uploadImage(file);
                        currentAvatar = uploadedUrl;
                        preview.src = uploadedUrl;
                    } catch (err) {
                        showAlert({ title: 'Upload Failed', text: 'Could not upload profile picture.', icon: 'error' });
                    } finally {
                        preview.style.opacity = '1';
                    }
                };
            },
            preConfirm: () => {
                const name = document.getElementById('swal-name').value.trim();
                const email = document.getElementById('swal-email').value.trim();
                const role = document.getElementById('swal-role').value;
                if (!name || !email) {
                    showAlert.showValidationMessage('Name and email are required');
                    return false;
                }
                return { name, email, role, avatar: currentAvatar };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api(`/admin/users/${user._id}`, {
                        method: 'PUT',
                        body: JSON.stringify(result.value)
                    });
                    showAlert({ title: 'Updated', text: `${result.value.name} has been updated.`, icon: 'success' });
                    fetchUsers();
                } catch (err) {
                    showAlert({ title: 'Error', text: err.message || 'Could not update user.', icon: 'error' });
                }
            }
        });
    };

    // ── Block / Unblock ──────────────────────────────────────────
    const handleBlockToggle = async (user) => {
        const action = user.isBlocked ? 'Unblock' : 'Block';
        const confirmed = await showAlert.confirm({
            title: `${action} "${user.name}"?`,
            text: user.isBlocked
                ? 'This user will regain access to the platform.'
                : 'This user will not be able to log in.',
            icon: 'warning'
        });
        if (!confirmed) return;

        try {
            await api(`/admin/users/${user._id}/block`, {
                method: 'PUT',
                body: JSON.stringify({ isBlocked: !user.isBlocked })
            });
            showAlert({
                title: user.isBlocked ? 'User Unblocked' : 'User Blocked',
                text: `${user.name} has been ${user.isBlocked ? 'unblocked' : 'blocked'}.`,
                icon: 'success'
            });
            fetchUsers();
        } catch (err) {
            showAlert({ title: 'Error', text: err.message || 'Could not update user status.', icon: 'error' });
        }
    };

    // ── Delete ───────────────────────────────────────────────────
    const handleDelete = async (user) => {
        const confirmed = await showAlert.confirm({
            title: `Delete "${user.name}"?`,
            text: 'This action is permanent and cannot be undone.',
            icon: 'warning'
        });
        if (!confirmed) return;

        try {
            await api(`/admin/users/${user._id}`, { method: 'DELETE' });
            showAlert({ title: 'Deleted', text: `${user.name} has been removed.`, icon: 'success' });
            fetchUsers();
        } catch (err) {
            showAlert({ title: 'Error', text: err.message || 'Could not delete user.', icon: 'error' });
        }
    };

    // ── Add User ─────────────────────────────────────────────────
    const handleAddUser = () => {
        let currentAvatar = '';

        showAlert({
            title: 'Add New Platform Member',
            html: `
                <div class="space-y-6 text-left p-2">
                    <div class="flex flex-col items-center justify-center space-y-3 mb-6">
                        <div class="relative group">
                            <div class="size-24 rounded-3xl bg-gray-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                                <img id="swal-avatar-preview" src="https://api.dicebear.com/7.x/avataaars/svg?seed=new" class="w-full h-full object-cover">
                            </div>
                            <label for="swal-file-input" class="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                                <input id="swal-file-input" type="file" accept="image/*" class="hidden">
                            </label>
                        </div>
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assign Profile Picture</p>
                    </div>

                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                        <input id="swal-name" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 font-bold" placeholder="Full Name">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                        <input id="swal-email" type="email" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 font-bold" placeholder="Email">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                        <input id="swal-pass" type="password" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 font-bold" placeholder="Min 6 characters">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Role</label>
                        <select id="swal-role" class="swal2-select !w-full !m-0 !rounded-xl !border-2 !border-gray-100 !text-sm !font-bold">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="vendor">Vendor</option>
                        </select>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Register Member',
            didOpen: () => {
                const fileInput = document.getElementById('swal-file-input');
                const preview = document.getElementById('swal-avatar-preview');

                fileInput.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    preview.style.opacity = '0.5';
                    try {
                        const uploadedUrl = await uploadImage(file);
                        currentAvatar = uploadedUrl;
                        preview.src = uploadedUrl;
                    } catch (err) {
                        showAlert({ title: 'Upload Failed', text: 'Could not upload profile picture.', icon: 'error' });
                    } finally {
                        preview.style.opacity = '1';
                    }
                };
            },
            preConfirm: () => {
                const name = document.getElementById('swal-name').value.trim();
                const email = document.getElementById('swal-email').value.trim();
                const password = document.getElementById('swal-pass').value;
                const role = document.getElementById('swal-role').value;
                if (!name || !email || !password) {
                    showAlert.showValidationMessage('All fields are required');
                    return false;
                }
                if (password.length < 6) {
                    showAlert.showValidationMessage('Password must be at least 6 characters');
                    return false;
                }
                return { name, email, password, role, avatar: currentAvatar };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api('/admin/users', {
                        method: 'POST',
                        body: JSON.stringify(result.value)
                    });
                    showAlert({ title: 'Member Registered', text: `${result.value.name} has been added.`, icon: 'success' });
                    fetchUsers();
                } catch (err) {
                    showAlert({ title: 'Error', text: err.message || 'Could not create user.', icon: 'error' });
                }
            }
        });
    };

    const getRoleBadge = (role) => {
        const styles = {
            admin: 'bg-purple-50 text-purple-600 border-purple-100',
            vendor: 'bg-blue-50 text-blue-600 border-blue-100',
            user: 'bg-gray-50 text-gray-500 border-gray-100'
        };
        return styles[role] || styles.user;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">User Management</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                        Manage platform members and access permissions
                    </p>
                </div>
                <button
                    onClick={handleAddUser}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
                >
                    <Plus size={18} strokeWidth={3} />
                    New Member
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-premium">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search Members by Name or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-premium overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Member Profile</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email Address</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User Role</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Join Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-8 py-6">
                                            <div className="h-10 bg-gray-100 rounded-xl w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center uppercase italic">
                                        <User size={48} className="text-gray-100 mx-auto mb-4" />
                                        <p className="text-gray-400 font-black tracking-widest text-xs">No records detected</p>
                                    </td>
                                </tr>
                            ) : users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 shadow-sm">
                                                <img
                                                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 text-sm uppercase italic leading-tight">{user.name}</p>
                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-0.5">{user.role}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Mail size={14} />
                                            <span className="text-xs font-bold leading-none">{user.email}</span>
                                        </div>
                                    </td>

                                    <td className="px-8 py-5 uppercase tracking-widest">
                                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black border ${getRoleBadge(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="px-8 py-5">
                                        {user.isBlocked ? (
                                            <span className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-1.5 w-fit">
                                                <Ban size={10} /> Suspended
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5 w-fit">
                                                <CheckCircle size={10} /> Active
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>

                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2.5 bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white rounded-xl transition-all"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleBlockToggle(user)}
                                                title={user.isBlocked ? 'Unblock user' : 'Block user'}
                                                className={`p-2.5 rounded-xl transition-all ${user.isBlocked
                                                    ? 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                                                    : 'bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white'
                                                    }`}
                                            >
                                                {user.isBlocked ? <Shield size={16} /> : <ShieldOff size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="p-2.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!loading && users.length > 0 && (
                    <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                            {users.length} Member{users.length !== 1 ? 's' : ''} in Directory
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUserList;
