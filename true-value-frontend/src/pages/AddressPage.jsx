import React, { useState, useEffect } from 'react';
import { Plus, Home, Briefcase, Umbrella, Mail, Phone, Edit3, Trash2, HelpCircle, ArrowLeft, CheckCircle2, MapPin, ShoppingCart, User, Search, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeNavbar from '../components/home/HomeNavbar';
import showAlert from '../utils/swal';
import { useUser } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const AddressPage = () => {
    const navigate = useNavigate();
    const {
        user,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress
    } = useUser();

    // Deep scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const handleGeolocation = (existingAddress = null) => {
        if (!navigator.geolocation) {
            showAlert({ title: 'Error', text: 'Geolocation is not supported by your browser.', icon: 'error' });
            return;
        }

        showAlert({
            title: 'Locating...',
            text: 'Fetching your current coordinates...',
            allowOutsideClick: false,
            didOpen: () => {
                showAlert.showLoading();
            }
        });

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                if (data && data.address) {
                    const address = data.address;
                    const prefilledData = {
                        ...(existingAddress || {}),
                        label: existingAddress?.label || 'Home',
                        name: existingAddress?.name || user?.name || '',
                        street: `${address.road || ''}`.trim(),
                        street2: `${address.suburb || ''} ${address.neighbourhood || ''}`.trim(),
                        city: address.city || address.town || address.village || '',
                        state: address.state || '',
                        zip: address.postcode || '',
                        country: address.country || 'India',
                        phone: existingAddress?.phone || ''
                    };

                    showAlert.close(); // Close loading alert
                    // Add delay to prevent Swal interaction issues
                    setTimeout(() => {
                        handleAddressForm(prefilledData); // Open form with data
                    }, 300);
                } else {
                    throw new Error('Address not found');
                }
            } catch (error) {
                console.error("Geolocation Error:", error);
                showAlert({ title: 'Error', text: 'Failed to fetch address details. Please enter manually.', icon: 'error' });
            }
        }, (error) => {
            console.error("Geolocation Permission Error:", error);
            showAlert({ title: 'Permission Denied', text: 'Please allow location access to use this feature.', icon: 'warning' });
        });
    };

    const handleAddressForm = (addressToEdit = null) => {
        const isEdit = !!addressToEdit && !!addressToEdit.id; // Check if it has an ID to be a real edit
        const defaults = addressToEdit || { label: 'Home', name: '', street: '', city: '', state: '', zip: '', country: 'India', phone: '' };

        showAlert({
            title: isEdit ? 'Update Location' : 'Register New Location',
            html: `
                <div class="space-y-4" style="text-align: left;">
                    <style>
                        .swal2-input-label { display: block; margin-bottom: 5px; font-size: 12px; font-weight: 800; color: #374151; text-transform: uppercase; letter-spacing: 0.05em; }
                        .swal2-input { color: #111827 !important; font-weight: 600 !important; }
                    </style>
                    <div>
                        <label class="swal2-input-label">Hub Label</label>
                        <input id="swal-label" class="swal2-input !mt-0" placeholder="e.g. Home, Office" value="${defaults.label}">
                    </div>
                    <div>
                        <label class="swal2-input-label">Contact Name</label>
                        <input id="swal-name" class="swal2-input" placeholder="Full Name" value="${defaults.name || ''}">
                    </div>
                    <div>
                        <label class="swal2-input-label">Building / Street (Line 1)</label>
                        <input id="swal-street" class="swal2-input" placeholder="House No, Road" value="${defaults.street}">
                    </div>
                    <div>
                        <label class="swal2-input-label">Area / Locality (Line 2)</label>
                        <input id="swal-street2" class="swal2-input" placeholder="Apartment, Area" value="${defaults.street2 || ''}">
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <div style="flex: 2;">
                            <label class="swal2-input-label">City</label>
                            <input id="swal-city" class="swal2-input" placeholder="City" value="${defaults.city}">
                        </div>
                        <div style="flex: 1;">
                            <label class="swal2-input-label">State</label>
                            <input id="swal-state" class="swal2-input" placeholder="State" value="${defaults.state}">
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <div style="flex: 1;">
                            <label class="swal2-input-label">Pincode</label>
                            <input id="swal-zip" class="swal2-input" placeholder="Pincode" value="${defaults.zip}">
                        </div>
                        <div style="flex: 1;">
                            <label class="swal2-input-label">Country</label>
                            <input id="swal-country" class="swal2-input" placeholder="Country" value="${defaults.country}">
                        </div>
                    </div>
                    <div>
                        <label class="swal2-input-label">Phone Number</label>
                        <input id="swal-phone" class="swal2-input" placeholder="Mobile Number" value="${defaults.phone || ''}">
                    </div>
                    
                    ${isEdit ? `
                        <div style="margin-top: 15px;">
                            <button id="swal-geo-update" class="w-full py-3 bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all transition-all duration-300">
                                Use Current Location Instead
                            </button>
                        </div>
                    ` : ''}
                </div>
            `,
            didOpen: () => {
                const geoBtn = document.getElementById('swal-geo-update');
                if (geoBtn) {
                    geoBtn.onclick = () => {
                        showAlert.close();
                        handleGeolocation(addressToEdit);
                    };
                }
            },
            showCancelButton: true,
            confirmButtonText: isEdit ? 'Save Changes' : 'Confirm Location',
            cancelButtonText: 'Abort',
            confirmButtonColor: '#5EC401',
            preConfirm: () => {
                const data = {
                    label: document.getElementById('swal-label').value,
                    name: document.getElementById('swal-name').value,
                    street: document.getElementById('swal-street').value,
                    street2: document.getElementById('swal-street2').value,
                    city: document.getElementById('swal-city').value,
                    state: document.getElementById('swal-state').value,
                    zip: document.getElementById('swal-zip').value,
                    country: document.getElementById('swal-country').value,
                    phone: document.getElementById('swal-phone').value,
                    type: document.getElementById('swal-label').value.toLowerCase().includes('home') ? 'home' :
                        document.getElementById('swal-label').value.toLowerCase().includes('office') ? 'work' : 'other'
                };
                if (!data.street || !data.city || !data.name) {
                    showAlert.showValidationMessage('Please fill in Name, Street, and City');
                    return false;
                }

                if (isEdit) {
                    const hasChanged =
                        data.label !== defaults.label ||
                        data.name !== defaults.name ||
                        data.street !== defaults.street ||
                        data.street2 !== (defaults.street2 || '') ||
                        data.city !== defaults.city ||
                        data.state !== defaults.state ||
                        data.zip !== defaults.zip ||
                        data.country !== defaults.country ||
                        data.phone !== defaults.phone;

                    if (!hasChanged) {
                        return { noChange: true };
                    }
                }
                return data;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value && result.value.noChange) {
                    showAlert({ title: 'No Changes', text: 'No changes were detected.', icon: 'info' });
                    return;
                }

                if (isEdit) {
                    updateAddress({ ...addressToEdit, ...result.value });
                    showAlert({ title: 'Success', text: 'Location updated mapping', icon: 'success', timer: 1500, showConfirmButton: false });
                } else {
                    addAddress(result.value);
                    showAlert({ title: 'Success', text: 'New location registered', icon: 'success', timer: 1500, showConfirmButton: false });
                }
            }
        });
    };

    const getIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'home': return <Home size={24} />;
            case 'work': return <Briefcase size={24} />;
            default: return <MapPin size={24} />;
        }
    };

    return (
        <div className="min-h-screen bg-white font-display flex flex-col selection:bg-primary/20">
            <HomeNavbar />

            <main className="flex-1 max-w-[1440px] mx-auto px-4 md:px-8 py-10 w-full mb-20 pt-[180px]">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
                    <Link to="/profile" className="hover:text-primary transition-colors flex items-center gap-2 group">
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Account Control
                    </Link>
                    <span className="opacity-30">/</span>
                    <span className="text-gray-900">Geographic Logistics</span>
                </nav>

                {/* Page Heading */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-gray-100 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3.5 bg-primary/10 text-primary rounded-[20px] shadow-sm">
                                <MapPin size={32} />
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-black leading-tight tracking-tighter text-gray-900 italic uppercase">Saved Hubs</h1>
                        </div>
                        <p className="text-gray-600 text-lg font-medium max-w-2xl leading-relaxed">
                            Efficient routing starts here. Manage your delivery nodes for high-speed fulfillment.
                        </p>
                    </div>
                    <button
                        onClick={() => handleAddressForm()}
                        className="bg-gray-900 text-white font-black px-10 py-5 rounded-2xl flex items-center justify-center gap-4 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-gray-200 cursor-pointer uppercase tracking-widest text-[11px]"
                    >
                        <Plus size={20} />
                        Register New Hub
                    </button>
                </div>

                {/* Address Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Add New Hub Card */}
                    <div className="flex flex-col gap-4">
                        <div
                            onClick={() => handleAddressForm()}
                            className="flex-1 flex flex-col items-center justify-center gap-8 p-12 rounded-[48px] border-4 border-dashed border-gray-50 hover:bg-gray-50/50 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all min-h-[320px] group cursor-pointer animate-in zoom-in-95 duration-700"
                        >
                            <div className="size-28 rounded-full bg-white flex items-center justify-center text-gray-200 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-premium group-hover:scale-110 group-hover:rotate-90">
                                <Plus size={48} />
                            </div>
                            <div className="text-center space-y-2">
                                <span className="text-2xl font-black text-gray-300 group-hover:text-gray-900 tracking-tighter uppercase transition-colors">Initialize Hub</span>
                                <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] transition-opacity">Add Address Manual</p>
                            </div>
                        </div>

                        <button
                            onClick={handleGeolocation}
                            className="w-full py-6 rounded-[32px] bg-primary/10 text-primary font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            <MapPin size={16} className="group-hover:animate-bounce" />
                            Use Current Location
                        </button>
                    </div>

                    {/* Dynamic Address Cards */}
                    <AnimatePresence>
                        {addresses?.map((addr, idx) => (
                            <motion.div
                                layout
                                key={addr.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`flex flex-col rounded-[48px] bg-white shadow-premium border-2 ${addr.isDefault ? 'border-primary ring-4 ring-primary/5 shadow-2xl shadow-primary/10' : 'border-gray-200 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5'} overflow-hidden group transition-all duration-500`}
                            >
                                <div className="p-10 flex-1 space-y-8 relative">
                                    {addr.isDefault && (
                                        <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black uppercase tracking-[0.3em] px-6 py-3 rounded-bl-[24px] shadow-lg shadow-primary/20">
                                            ACTIVE HUB
                                        </div>
                                    )}

                                    <div className="flex items-center gap-6">
                                        <div className={`size-16 rounded-[24px] flex items-center justify-center ${addr.isDefault ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500'}`}>
                                            {getIcon(addr.type)}
                                        </div>
                                        <div>
                                            <span className="text-2xl font-black text-emerald-950 tracking-tighter uppercase block group-hover:text-primary transition-colors">
                                                {addr.label || 'Saved Location'}
                                            </span>
                                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                                                {addr.city || 'Local Area'} {addr.country ? `, ${addr.country}` : ''}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <div className="space-y-1">
                                            <p className="font-black text-zinc-900 text-xl tracking-tight leading-none">
                                                {addr.name || 'Contact Info Missing'}
                                            </p>
                                            <div className="text-zinc-800 font-bold text-sm leading-relaxed tracking-tight">
                                                <p>{addr.street || 'Address Line 1 missing'}</p>
                                                {addr.street2 && <p className="text-zinc-500 italic font-medium">{addr.street2}</p>}
                                                <p>{addr.city || ''}{addr.city && addr.state ? ', ' : ''}{addr.state || ''} {addr.zip ? `• ${addr.zip}` : ''}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-emerald-950 font-black bg-emerald-50/50 p-4 rounded-2xl w-full border border-emerald-100 group-hover:bg-white group-hover:shadow-lg group-hover:border-primary/5 transition-all">
                                            <div className="p-2.5 bg-white rounded-xl shadow-sm text-primary">
                                                <Phone size={16} />
                                            </div>
                                            <span className="text-sm tracking-tight">{addr.phone || 'No Phone Number'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex border-t border-gray-50 bg-gray-50/20">
                                    <button
                                        onClick={() => handleAddressForm(addr)}
                                        className="flex-1 flex items-center justify-center gap-3 py-6 hover:bg-white hover:text-primary transition-all text-[11px] font-black uppercase tracking-widest text-gray-400 border-r border-gray-50 cursor-pointer group/btn"
                                    >
                                        <Edit3 size={18} className="group-hover/btn:scale-125 transition-transform" />
                                        Update Location
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const confirmed = await showAlert.danger({
                                                title: 'Remove Hub?',
                                                text: 'This logistical node will be permanently purged from your manifest.',
                                                confirmButtonText: 'Yes, Remove Hub'
                                            });
                                            if (confirmed.isConfirmed) {
                                                deleteAddress(addr.id);
                                            }
                                        }}
                                        className="flex-1 flex items-center justify-center gap-3 py-6 hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all text-[11px] font-black uppercase tracking-widest cursor-pointer group/btn"
                                    >
                                        <Trash2 size={18} className="group-hover/btn:scale-125 transition-transform" />
                                        Remove Hub
                                    </button>
                                </div>
                                {!addr.isDefault && (
                                    <button
                                        onClick={() => setDefaultAddress(addr.id)}
                                        className="w-full py-5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all cursor-pointer shadow-inner"
                                    >
                                        ACTIVATE HUB
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Support Section */}
                <div className="mt-32 p-12 md:p-16 rounded-[56px] bg-gray-900 text-white border border-gray-800 shadow-3xl flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative group animate-in slide-in-from-bottom-6 duration-1000">
                    <div className="absolute top-0 right-0 w-[60%] h-full bg-primary/10 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-primary/20 transition-colors duration-1000" />
                    <div className="size-32 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0 text-primary shadow-2xl shadow-primary/10 border border-white/10 backdrop-blur-xl group-hover:scale-110 transition-transform duration-700">
                        <HelpCircle size={64} strokeWidth={1} />
                    </div>
                    <div className="flex-1 text-center lg:text-left space-y-6 relative z-10">
                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none italic">Logistical Bottleneck?</h3>
                        <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-2xl">
                            If you're having trouble defining a location or need prioritized routing for a current manifest, our logistics squad is standby 24/7.
                        </p>
                    </div>
                    <button
                        onClick={() => showAlert({ title: 'Squad Support', text: 'Connecting to logistics dispatch...', icon: 'info' })}
                        className="flex items-center justify-center h-20 px-12 bg-primary text-white font-black rounded-2xl hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 cursor-pointer whitespace-nowrap relative z-10 uppercase tracking-[0.2em] text-xs"
                    >
                        Contact Logistics
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AddressPage;
