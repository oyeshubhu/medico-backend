const express = require('express')
const Appointment = require('../models/appointment');
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/appointment', auth, async (req, res) => {
    console.log('bpdy', req.body)
    const appointment = new Appointment({
        ...req.body,
        owner: req.user._id
    })

    try {
        await appointment.save();
        console.log(appointment)
        res.status(201).send(appointment)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/appointments', auth, async (req, res) => {

    try {
        await req.user.populate({
            path: 'appointment',
        }).execPopulate();
        res.send(req.user.appointment)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/appointments/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const appointment = await Appointment.findOne({ _id, owner: req.user._id });

        if (!appointment) {
            return res.status(404).send()
        }
        res.send(appointment)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/appointments/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['doctorName', 'doctorEmail', 'doctorPhone', 'hospitalName',
        'address', 'city', 'ailment', 'lastVisit'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    } else {
        try {
            const appointment = await Appointment.findOne({ _id: req.params.id, owner: req.user._id });
            if (!appointment) {
                return res.status(404).send()
            }
            updates.forEach((update) => appointment[update] = req.body[update])
            await appointment.save()
            res.send(appointment)
        } catch (e) {
            res.status(400).send(e)
        }
    }


})

router.delete('/appointment/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!appointment) {
            res.status(404).send()
        }
        res.send(appointment)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router