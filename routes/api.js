const router = require("express").Router();
const db = require("../models")

// Creates a workout using data in the request body.
router.post("/api/workouts", (req, res) => {
  db.Workout.create(req.body).then(response => {
    res.json(response)
  }).catch(err => {
    console.log(err)
    res.sendStatus(500)
  })
});

// Respond with workout for id url parameter. This should
// respond with the updated workout json
router.put("/api/workouts/:id", (req, res) => {
  const workoutToUpdate = (req.params.id)
  db.Workout.update({ _id: workoutToUpdate }, { $push: { exercises: req.body } }, { new: true })
    .then(response => {
      res.json(response)
    }).catch(err => {
      console.log(err)
      res.sendStatus(err)
    })
});

// Respond with json for all the workouts in an array.
router.get("/api/workouts", (req, res) => {
  db.Workout.aggregate([{
    $addFields: {
      totalDuration: { $sum: "$exercises.duration" },
    },
  },]).then((workouts) => res.json(workouts));
});

// Respond with json array containing the last 7 workouts
router.get("/api/workouts/range", (req, res) => {
  db.Workout.find({}).sort("-day").limit(7)
    .then((data) => {
      res.json(data)
    }).catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
});


module.exports = router;
