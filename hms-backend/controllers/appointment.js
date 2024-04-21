const moment = require("moment");
const mongoose = require("mongoose");
const { Appointment } = require("../models/Appointment");
const { totalTickets } = require("../services/utils");
const { Doctor } = require("../models/User");
const { ObjectId } = require("mongoose").Types;

const createAppointment = async (req, res) => {
  try {
    const { doctor, patient } = req.body;

    const today = moment().startOf("day");
    const pipeline = [
      {
        $match: {
          doctor: new ObjectId(doctor),
          date: {
            $gte: today.toDate(),
            $lt: moment(today).endOf("day").toDate(),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
        },
      },
    ];

    const result = await Appointment.aggregate(pipeline);

    const numberOfAppointments =
      result.length > 0 ? result[0].totalAppointments : 0;

    // the first ticket is at today, 3:00 PM and the interval is 15 minutes
    const firstTicket = moment(today)
      .add(15 * numberOfAppointments, "minutes")
      .add(9, "hours");

    const appointment = await Appointment.create({
      doctor,
      patient,
      date: firstTicket.toDate(),
    });

    res.status(201).json({ appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAvailableTicketsForDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const today = moment().startOf("day");
    const pipeline = [
      {
        $match: {
          doctor: new ObjectId(doctorId),
          date: {
            $gte: today.toDate(),
            $lt: moment(today).endOf("day").toDate(),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
        },
      },
    ];

    const result = await Appointment.aggregate(pipeline);

    if (result.length <= 0) {
      res.status(400).json({
        message: "The doctor has no appointment today",
        totalTickets,
      });
      return;
    }

    const availableTickets = totalTickets - result[0].totalAppointments;

    res.status(200).json({ availableTickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTodaysAppointments = async (req, res) => {
  try {
    const today = moment().startOf("day");
    const appointments = await Appointment.find({
      date: {
        $gte: today.toDate(),
        $lt: moment(today).endOf("day").toDate(),
      },
    })
      .populate("doctor")
      .populate("patient");

    res.status(200).json(appointments);
  } catch (error) {}
};

// list of doctors who have treated a given patient
const getDoctorsByPatient = async (req, res) => {
  try {
    const patientId = req.params.id;

    const appointments = await Appointment.find({ patient: patientId });

    const doctors = await Promise.all(
      appointments.map(async (appointment) => {
        const doctor = await Doctor.findById(appointment.doctor);
        return doctor;
      })
    );

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getAvailableTicketsForDoctor,
  getTodaysAppointments,
  getDoctorsByPatient,
};
