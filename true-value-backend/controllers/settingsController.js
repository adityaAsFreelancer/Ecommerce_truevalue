const GlobalSetting = require('../models/GlobalSetting');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorHandler');

// @desc    Get delivery settings
// @route   GET /api/settings/delivery
// @access  Public
exports.getDeliverySettings = asyncHandler(async (req, res, next) => {
    let settings = await GlobalSetting.findOne({ key: 'delivery_config' });

    if (!settings) {
        // Seed default if not exists
        settings = await GlobalSetting.create({
            key: 'delivery_config',
            value: {
                isFreeDeliveryActive: false,
                minOrderForFreeDelivery: 500,
                baseCharge: 40,
                chargePerKm: 10,
                peakHourSurcharge: 20,
                peakHours: [18, 19, 20, 21],
                baseZip: '110',
                taxRate: 18 // Default 18%
            },
            description: 'Configuration for dynamic delivery charges and tax'
        });
    }

    // Ensure taxRate exists in old settings
    if (settings.value.taxRate === undefined) {
        settings.value.taxRate = 18;
        await settings.save();
    }

    res.status(200).json({
        success: true,
        data: settings.value
    });
});

// @desc    Update delivery settings
// @route   PUT /api/settings/delivery
// @access  Private/Admin
exports.updateDeliverySettings = asyncHandler(async (req, res, next) => {
    let settings = await GlobalSetting.findOne({ key: 'delivery_config' });

    if (!settings) {
        settings = new GlobalSetting({ key: 'delivery_config' });
    }

    settings.value = { ...settings.value, ...req.body };
    settings.updatedBy = req.user._id;

    await settings.save();

    res.status(200).json({
        success: true,
        data: settings.value
    });
});
