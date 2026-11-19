const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

const VaccineInventory = require('../models/VaccineInventory');
const { requireAuth, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(requireAuth, authorizeRoles('veterinary'));

function inventoryPayload(item) {
    const stockQuantity = item.stockQuantity;
    const expiryDate = item.expiryDate;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return {
        id: item._id.toString(),
        vaccineName: item.vaccineName,
        manufacturer: item.manufacturer,
        batchNumber: item.batchNumber,
        expiryDate,
        stockQuantity,
        lowStockThreshold: item.lowStockThreshold,
        notes: item.notes || '',
        stockStatus: expiryDate < today
            ? 'expired'
            : stockQuantity === 0
                ? 'out_of_stock'
                : stockQuantity <= item.lowStockThreshold
                    ? 'low_stock'
                    : 'in_stock',
        movements: (item.movements || []).slice(-20).reverse().map((movement) => ({
            type: movement.type,
            quantityChange: movement.quantityChange,
            reason: movement.reason || '',
            createdAt: movement.createdAt
        }))
    };
}

router.get('/', async (_req, res, next) => {
    try {
        const items = await VaccineInventory.find({})
            .sort({ expiryDate: 1, vaccineName: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: items.length,
            inventory: items.map(inventoryPayload)
        });
    } catch (error) {
        return next(error);
    }
});

router.post(
    '/',
    [
        body('vaccineName').isString().trim().isLength({ min: 2, max: 150 })
            .withMessage('Vaccine name must be 2 to 150 characters.'),
        body('manufacturer').isString().trim().notEmpty().isLength({ max: 150 })
            .withMessage('Manufacturer is required and must be 150 characters or fewer.'),
        body('batchNumber').isString().trim().notEmpty().isLength({ max: 100 })
            .withMessage('Batch or lot number is required and must be 100 characters or fewer.'),
        body('expiryDate').isISO8601({ strict: true, strictSeparator: true })
            .custom((value) =>
                new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value
            )
            .withMessage('Expiry date must be a valid YYYY-MM-DD date.'),
        body('stockQuantity').isInt({ min: 0, max: 1000000 })
            .withMessage('Stock quantity must be a whole number from 0 to 1,000,000.'),
        body('lowStockThreshold').optional().isInt({ min: 0, max: 1000000 })
            .withMessage('Low-stock threshold must be a non-negative whole number.'),
        body('notes').optional().isString().trim().isLength({ max: 500 })
            .withMessage('Notes cannot exceed 500 characters.')
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        try {
            const stockQuantity = Number(req.body.stockQuantity);
            const item = await VaccineInventory.create({
                vaccineName: req.body.vaccineName.trim(),
                manufacturer: req.body.manufacturer.trim(),
                batchNumber: req.body.batchNumber.trim(),
                expiryDate: new Date(`${req.body.expiryDate}T00:00:00.000Z`),
                stockQuantity,
                lowStockThreshold: req.body.lowStockThreshold === undefined
                    ? 5
                    : Number(req.body.lowStockThreshold),
                notes: req.body.notes?.trim() || '',
                createdBy: req.user.id,
                updatedBy: req.user.id,
                movements: stockQuantity > 0
                    ? [{
                        type: 'received',
                        quantityChange: stockQuantity,
                        reason: 'Opening stock',
                        actorUserId: req.user.id
                    }]
                    : []
            });

            return res.status(201).json({
                success: true,
                message: 'Vaccine lot added to inventory.',
                inventoryItem: inventoryPayload(item)
            });
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'Please check the vaccine lot details.'
                });
            }
            return next(error);
        }
    }
);

router.patch(
    '/:itemId/adjust',
    [
        body('quantityChange').isInt({ min: -1000000, max: 1000000 })
            .custom((value) => Number(value) !== 0)
            .withMessage('Stock adjustment must be a non-zero whole number.'),
        body('reason').isString().trim().notEmpty().isLength({ max: 250 })
            .withMessage('Please provide a reason (up to 250 characters).')
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        if (!mongoose.isValidObjectId(req.params.itemId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid vaccine inventory item.'
            });
        }

        const quantityChange = Number(req.body.quantityChange);
        const stockFilter = { _id: req.params.itemId };
        if (quantityChange < 0) {
            stockFilter.stockQuantity = {
                $gte: Math.abs(quantityChange)
            };
        } else {
            stockFilter.stockQuantity = {
                $lte: 1000000 - quantityChange
            };
        }

        try {
            const item = await VaccineInventory.findOneAndUpdate(
                stockFilter,
                {
                    $inc: { stockQuantity: quantityChange },
                    $set: { updatedBy: req.user.id },
                    $push: {
                        movements: {
                            $each: [{
                                type: 'adjustment',
                                quantityChange,
                                reason: req.body.reason.trim(),
                                actorUserId: req.user.id
                            }],
                            $slice: -100
                        }
                    }
                },
                { new: true, runValidators: true }
            ).lean();

            if (!item) {
                const exists = await VaccineInventory.exists({
                    _id: req.params.itemId
                });
                return res.status(exists ? 409 : 404).json({
                    success: false,
                    message: exists
                        ? quantityChange < 0
                            ? 'Adjustment would reduce stock below zero.'
                            : 'Stock cannot exceed 1,000,000 doses per lot.'
                        : 'Vaccine inventory item not found.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Vaccine stock updated.',
                inventoryItem: inventoryPayload(item)
            });
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'The stock adjustment is invalid.'
                });
            }
            return next(error);
        }
    }
);

module.exports = router;
