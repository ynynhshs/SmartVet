require('dotenv').config({ quiet: true });

const assert = require('node:assert/strict');
const { after, test } = require('node:test');
const express = require('express');
const mongoose = require('mongoose');

const User = require('../src/models/User');
const Pet = require('../src/models/Pet');
const VaccinationRecord = require('../src/models/VaccinationRecord');
const VaccineInventory = require('../src/models/VaccineInventory');
const { createAccessToken } = require('../src/services/authService');
const clinicRoutes = require('../src/routes/clinicRoutes');
const ownerRoutes = require('../src/routes/ownerRoutes');
const inventoryRoutes = require('../src/routes/vaccineInventoryRoutes');

class MockQuery {
    constructor(value) {
        this.value = value;
    }

    select() {
        return this;
    }

    populate() {
        return this;
    }

    sort() {
        return this;
    }

    limit() {
        return this;
    }

    lean() {
        return Promise.resolve(this.value);
    }

    then(resolve, reject) {
        return Promise.resolve(this.value).then(resolve, reject);
    }
}

test('owner vaccine follow-up and clinic reporting/inventory APIs', async () => {
    const veterinaryId = new mongoose.Types.ObjectId();
    const ownerId = new mongoose.Types.ObjectId();
    const petId = new mongoose.Types.ObjectId();
    const inventoryId = new mongoose.Types.ObjectId();
    const veterinaryUser = {
        _id: veterinaryId,
        role: 'veterinary',
        status: 'active',
        fullName: 'Clinic Vet'
    };
    const ownerUser = {
        _id: ownerId,
        role: 'owner',
        status: 'active',
        fullName: 'Pet Owner'
    };
    const pet = {
        _id: petId,
        name: 'Buddy',
        petCode: 'PET-12345678',
        species: 'dog',
        registrationStatus: 'approved',
        ownerUserId: ownerId
    };
    const inventoryItem = {
        _id: inventoryId,
        vaccineName: 'Anti-Rabies',
        manufacturer: 'Test Maker',
        batchNumber: 'LOT-001',
        expiryDate: new Date(Date.now() + 30 * 86400000),
        stockQuantity: 5,
        lowStockThreshold: 2,
        notes: '',
        movements: []
    };
    let reportFilter;
    let vaccinationData;
    let vaccinationCreateCount = 0;
    const originals = {
        userFindById: User.findById,
        petFind: Pet.find,
        petFindOne: Pet.findOne,
        vaccinationFind: VaccinationRecord.find,
        vaccinationCreate: VaccinationRecord.create,
        inventoryFind: VaccineInventory.find,
        inventoryFindById: VaccineInventory.findById,
        inventoryFindOneAndUpdate: VaccineInventory.findOneAndUpdate,
        inventoryFindByIdAndUpdate: VaccineInventory.findByIdAndUpdate
    };

    User.findById = (id) => ({
        select: async () => String(id) === ownerId.toString()
            ? ownerUser
            : veterinaryUser
    });
    Pet.findOne = () => new MockQuery(pet);
    Pet.find = (filter = {}) => {
        reportFilter = filter;
        return new MockQuery([pet]);
    };
    VaccinationRecord.find = (filter = {}) => {
        reportFilter = filter;
        return new MockQuery([{
            _id: new mongoose.Types.ObjectId(),
            petId,
            vaccineName: 'Anti-Rabies',
            administeredDate: new Date('2026-11-18T00:00:00.000Z'),
            nextDueDate: new Date('2026-12-18T00:00:00.000Z'),
            administeredBy: veterinaryUser,
            batchNumber: 'LOT-001',
            manufacturer: 'Test Maker',
            dosage: '1 dose'
        }]);
    };
    VaccinationRecord.create = async (data) => {
        vaccinationCreateCount += 1;
        vaccinationData = { ...data, createdAt: new Date() };
        return vaccinationData;
    };
    VaccineInventory.find = () => new MockQuery([inventoryItem]);
    VaccineInventory.findById = () => new MockQuery(inventoryItem);
    VaccineInventory.findOneAndUpdate = (filter, update) => {
        if (inventoryItem.stockQuantity < filter.stockQuantity.$gte) {
            return new MockQuery(null);
        }
        if (inventoryItem.expiryDate < filter.expiryDate.$gte) {
            return new MockQuery(null);
        }
        inventoryItem.stockQuantity += update.$inc.stockQuantity;
        inventoryItem.movements.push(update.$push.movements.$each[0]);
        return new MockQuery(inventoryItem);
    };
    VaccineInventory.findByIdAndUpdate = async (_id, update) => {
        inventoryItem.stockQuantity += update.$inc.stockQuantity;
        inventoryItem.movements.push(update.$push.movements.$each[0]);
    };

    const app = express();
    app.use(express.json());
    app.use('/api/clinic/vaccine-inventory', inventoryRoutes);
    app.use('/api/clinic', clinicRoutes);
    app.use('/api/owner', ownerRoutes);
    app.use((error, _req, res, _next) =>
        res.status(500).json({ success: false, message: error.message })
    );
    const server = app.listen(0);
    after(() => {
        server.close();
        User.findById = originals.userFindById;
        Pet.find = originals.petFind;
        Pet.findOne = originals.petFindOne;
        VaccinationRecord.find = originals.vaccinationFind;
        VaccinationRecord.create = originals.vaccinationCreate;
        VaccineInventory.find = originals.inventoryFind;
        VaccineInventory.findById = originals.inventoryFindById;
        VaccineInventory.findOneAndUpdate = originals.inventoryFindOneAndUpdate;
        VaccineInventory.findByIdAndUpdate = originals.inventoryFindByIdAndUpdate;
    });

    await new Promise((resolve) => server.once('listening', resolve));
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const veterinaryHeaders = {
        Authorization: `Bearer ${createAccessToken({ _id: veterinaryId })}`,
        'Content-Type': 'application/json'
    };
    const ownerHeaders = {
        Authorization: `Bearer ${createAccessToken({ _id: ownerId })}`
    };

    const ownerResponse = await fetch(`${baseUrl}/api/owner/vaccinations`, {
        headers: ownerHeaders
    });
    const ownerData = await ownerResponse.json();
    assert.equal(ownerResponse.status, 200);
    assert.equal(ownerData.vaccinations[0].pet.name, 'Buddy');
    assert.equal(ownerData.vaccinations[0].vaccineName, 'Anti-Rabies');

    const reportResponse = await fetch(
        `${baseUrl}/api/clinic/reports?type=followups&from=2026-12-01&to=2026-12-31`,
        { headers: veterinaryHeaders }
    );
    const reportData = await reportResponse.json();
    assert.equal(reportResponse.status, 200);
    assert.equal(reportData.type, 'followups');
    assert.equal(reportData.rows.length, 1);
    assert.ok(reportFilter.nextDueDate.$gte instanceof Date);

    const invalidReportResponse = await fetch(
        `${baseUrl}/api/clinic/reports?type=followups&from=2026-02-31`,
        { headers: veterinaryHeaders }
    );
    assert.equal(invalidReportResponse.status, 400);

    const stockResponse = await fetch(
        `${baseUrl}/api/clinic/vaccine-inventory`,
        { headers: veterinaryHeaders }
    );
    const stockData = await stockResponse.json();
    assert.equal(stockResponse.status, 200);
    assert.equal(stockData.inventory[0].stockQuantity, 5);

    const vaccineResponse = await fetch(
        `${baseUrl}/api/clinic/pets/${petId}/vaccinations`,
        {
            method: 'POST',
            headers: veterinaryHeaders,
            body: JSON.stringify({
                vaccineName: 'Anti-Rabies',
                administeredDate: '2026-11-18',
                nextDueDate: '2026-12-18',
                inventoryItemId: inventoryId.toString(),
                inventoryQuantityUsed: 2
            })
        }
    );
    assert.equal(vaccineResponse.status, 201);
    assert.equal(inventoryItem.stockQuantity, 3);
    assert.equal(vaccinationData.vaccineInventoryId.toString(), inventoryId.toString());
    assert.equal(inventoryItem.movements[0].quantityChange, -2);
    assert.equal(inventoryItem.movements[0].vaccinationRecordId.toString(), vaccinationData._id.toString());

    const unauthorizedResponse = await fetch(
        `${baseUrl}/api/clinic/reports?type=vaccinations`,
        { headers: ownerHeaders }
    );
    assert.equal(unauthorizedResponse.status, 403);
    assert.equal(vaccinationCreateCount, 1);
});
