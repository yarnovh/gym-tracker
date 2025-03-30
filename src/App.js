import { useState, useEffect } from "react";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutList from "./components/WorkoutList";

function App() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem("workouts")) || [];
    setWorkouts(savedWorkouts);
  }, []);

  const addWorkout = (newWorkout) => {
    const updatedWorkouts = [...workouts, newWorkout];
    setWorkouts(updatedWorkouts);
    localStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
  };

  return (
    <div>
      <h1>Gym Tracker</h1>
      <WorkoutForm addWorkout={addWorkout} />
      <WorkoutList workouts={workouts} />
    </div>
  );
}

export default App;