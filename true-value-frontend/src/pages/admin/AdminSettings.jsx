import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Truck, Percent, Save, Loader2, Info } from 'lucide-react';
import { api } from '../../utils/api';
import showAlert from '../../utils/swal';
import GlobalLoader from '../../components/common/GlobalLoader';

const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        isFreeDeliveryActive: false,
        minOrderForFreeDelivery: 500,
        baseCharge: 40,
        taxRate: 18,
        peakHourSurcharge: 20,
        peakHours: []
    });

    const fetchConfig = async () => {
        setLoading(true);
        try {
            const response = await api('/settings/delivery');
            setConfig(response.data);
        } catch (error) {
            console.error('Fetch Settings Error:', error);
            showAlert.error({ title: 'Error', text: 'Failed to fetch global settings' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api('/settings/delivery', {
                method: 'PUT',
                body: JSON.stringify(config)
            });
            showAlert.success({ title: 'Success', text: 'Settings updated successfully' });
        } catch (error) {
            showAlert.error({ title: 'Error', text: error.message || 'Failed to update settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Global Settings</h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Configure tax, delivery fees, and order thresholds</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Tax Configuration */}
                <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-premium group">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Percent size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Taxation Control</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global GST/Sales Tax Rate</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">GST Percentage (%)</label>
                            <input
                                type="number"
                                name="taxRate"
                                value={config.taxRate}
                                onChange={handleChange}
                                placeholder="18"
                                className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl font-black text-lg focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-50 flex gap-4">
                            <Info size={20} className="text-blue-500 shrink-0" />
                            <p className="text-[11px] font-medium text-blue-700 leading-relaxed uppercase tracking-tight">
                                Yeh tax checkout par subtotal par calculate hoga aur admin logs mein itemize kiya jayega.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Delivery Configuration */}
                <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-premium group">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Logistics Fees</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery charges and free tier thresholds</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Base Delivery Charge (₹)</label>
                            <input
                                type="number"
                                name="baseCharge"
                                value={config.baseCharge}
                                onChange={handleChange}
                                className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl font-black text-lg focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Free Delivery Min Order (₹)</label>
                            <input
                                type="number"
                                name="minOrderForFreeDelivery"
                                value={config.minOrderForFreeDelivery}
                                onChange={handleChange}
                                className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl font-black text-lg focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                        <input
                            type="checkbox"
                            name="isFreeDeliveryActive"
                            id="freeDelivery"
                            checked={config.isFreeDeliveryActive}
                            onChange={handleChange}
                            className="size-6 rounded-lg text-primary focus:ring-primary transition-all border-none bg-white shadow-sm"
                        />
                        <label htmlFor="freeDelivery" className="text-xs font-black uppercase tracking-widest text-gray-700 cursor-pointer select-none">
                            Enable Store-Wide Free Delivery (Override thresholds)
                        </label>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-3 px-12 py-5 bg-gray-900 text-white font-black rounded-[24px] text-[11px] uppercase tracking-[0.3em] hover:bg-primary shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Deploy New Protocol
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
