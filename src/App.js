import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { FaDumbbell, FaChartBar, FaCog, FaPlus } from "react-icons/fa";
import "./App.css";

const App = () => {
  const [workouts, setWorkouts] = useState([]);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Workouts workouts={workouts} setWorkouts={setWorkouts} />} />
          <Route path="/graphs" element={<Graphs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add-workout" element={<AddWorkout setWorkouts={setWorkouts} />} />
          <Route path="/edit-workout/:index" element={<EditWorkout workouts={workouts} setWorkouts={setWorkouts} />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
};

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <Link to="/" className="nav-item"><FaDumbbell /> Workouts</Link>
      <Link to="/graphs" className="nav-item"><FaChartBar /> Graphs</Link>
      <Link to="/settings" className="nav-item"><FaCog /> Settings</Link>
    </nav>
  );
};

const Workouts = ({ workouts }) => {
  return (
    <div className="workouts-container">
      <header>
        <h1>Workouts</h1>
        <Link to="/add-workout" className="add-button"><FaPlus /></Link>
      </header>
      <ul className="workout-list">
        {workouts.length === 0 ? (
          <p>No workouts added yet.</p>
        ) : (
          workouts.map((workout, index) => (
            <li key={index}>
              <Link to={`/edit-workout/${index}`}>
                <strong>{workout.date}</strong>
                <ul>
                  {workout.exercises.map((exercise, exIndex) => (
                    <li key={exIndex}>
                      {exercise.name}: {exercise.sets.map(set => `${set.weight}kg x ${set.reps} reps`).join(", ")}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

const AddWorkout = ({ setWorkouts, initialWorkout = null, workoutIndex = null }) => {
  const navigate = useNavigate();
  const [date, setDate] = useState(initialWorkout ? initialWorkout.date : "");
  const [exercises, setExercises] = useState(initialWorkout ? initialWorkout.exercises : [{ name: "", sets: [{ weight: "", reps: "" }] }]);

  const addExercise = () => setExercises([...exercises, { name: "", sets: [{ weight: "", reps: "" }] }]);
  const removeExercise = (exerciseIndex) => setExercises(exercises.filter((_, index) => index !== exerciseIndex));
  const addSet = (exerciseIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({ weight: "", reps: "" });
    setExercises(newExercises);
  };
  const removeSet = (exerciseIndex, setIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.splice(setIndex, 1);
    setExercises(newExercises);
  };
  const saveWorkout = () => {
    setWorkouts(prevWorkouts => {
      let updatedWorkouts = [...prevWorkouts];
      if (workoutIndex !== null) {
        updatedWorkouts[workoutIndex] = { date, exercises };
      } else {
        updatedWorkouts.push({ date, exercises });
      }
      return updatedWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    });
    navigate("/");
  };

  return (
    <div className="add-workout-container">
      <h2>{workoutIndex !== null ? "Edit Workout" : "Add Workout"}</h2>
      <label>Date: <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      {exercises.map((exercise, exIndex) => (
        <div key={exIndex} className="exercise-box">
          <input type="text" placeholder="Exercise Name" value={exercise.name} 
            onChange={(e) => {
              const newExercises = [...exercises];
              newExercises[exIndex].name = e.target.value;
              setExercises(newExercises);
            }}
          />
          <button onClick={() => removeExercise(exIndex)}>Remove Exercise</button>
          {exercise.sets.map((set, setIndex) => (
            <div key={setIndex} className="set-box">
              <input type="number" placeholder="Weight (kg)" value={set.weight} onChange={(e) => {
                const newExercises = [...exercises];
                newExercises[exIndex].sets[setIndex].weight = e.target.value;
                setExercises(newExercises);
              }} />
              <input type="number" placeholder="Reps" value={set.reps} onChange={(e) => {
                const newExercises = [...exercises];
                newExercises[exIndex].sets[setIndex].reps = e.target.value;
                setExercises(newExercises);
              }} />
              <button onClick={() => removeSet(exIndex, setIndex)}>Remove Set</button>
            </div>
          ))}
          <button onClick={() => addSet(exIndex)}>+ Add Set</button>
        </div>
      ))}
      <button onClick={addExercise}>+ Add Exercise</button>
      <button onClick={saveWorkout}>Save Workout</button>
      <button onClick={() => navigate("/")}>Back</button>
    </div>
  );
};

const EditWorkout = ({ workouts, setWorkouts }) => {
  const { index } = useParams();
  const workoutIndex = parseInt(index, 10);
  const workout = workouts[workoutIndex];

  if (!workout) return <p>Workout not found</p>;

  return <AddWorkout setWorkouts={setWorkouts} initialWorkout={workout} workoutIndex={workoutIndex} />;
};

const Graphs = () => <h2>Graphs</h2>;
const Settings = () => <h2>Settings</h2>;

export default App;