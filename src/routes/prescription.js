const express = require('express')
const Prescription = require('../models/prescription')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/prescription', auth, async (req, res) => {
    const prescription = new Prescription({
        ...req.body,
        owner: req.user._id
    })

    try {
        await prescription.save()
        res.status(201).send(prescription)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/prescriptions', auth, async (req, res) => {

    try {
        await req.user.populate({
            path: 'prescription',
        }).execPopulate();
        res.send(req.user.prescription)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/prescriptions/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const prescription = await Prescription.findOne({ _id, owner: req.user._id });

        if (!prescription) {
            return res.status(404).send()
        }
        res.send(prescription)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/prescription/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['doctorName', 'doctorEmail', 'doctorPhone', 'hospitalName',
        'address', 'city', 'ailment', 'tests', 'precautions', 'medicine', 'date', 'nextVisit'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    } else {
        try {
            const prescription = await Prescription.findOne({ _id: req.params.id, owner: req.user._id });
            if (!prescription) {
                return res.status(404).send()
            }
            updates.forEach((update) => prescription[update] = req.body[update])
            await prescription.save()
            res.send(prescription)
        } catch (e) {
            res.status(400).send(e)
        }
    }


})

router.delete('/prescription/:id', auth, async (req, res) => {
    try {
        const prescription = await Prescription.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!prescription) {
            res.status(404).send()
        }
        res.send(prescription)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router