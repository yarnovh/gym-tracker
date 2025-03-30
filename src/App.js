import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { FaDumbbell, FaChartBar, FaCog, FaPlus, FaTrash } from "react-icons/fa";
import "./App.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGmYxLhj6z4fUDZg8ltqopYx0FpE28JDI",
  authDomain: "gym-tracker-f482d.firebaseapp.com",
  projectId: "gym-tracker-f482d",
  storageBucket: "gym-tracker-f482d.firebasestorage.app",
  messagingSenderId: "887993274021",
  appId: "1:887993274021:web:952d01d21300319b20874c",
  measurementId: "G-LMEZMC7RD1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



const App = () => {
  const [workouts, setWorkouts] = useState([]);

  // Load workouts from local storage when the component mounts
  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem("workouts"));
    if (savedWorkouts) {
      console.log("Loaded from storage:", savedWorkouts);
      setWorkouts(savedWorkouts);
    }
  }, []);

  // Save workouts to local storage whenever the workouts state changes
  useEffect(() => {
    console.log("Saving to storage:", workouts);
    if (workouts.length > 0) {
      localStorage.setItem("workouts", JSON.stringify(workouts));
    }
  }, [workouts]);

  return (
    <Router>
      <div className="app-container dark-theme">
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

const BottomNav = () => (
  <nav className="bottom-nav dark-theme">
    <Link to="/" className="nav-item"><FaDumbbell /> Workouts</Link>
    <Link to="/graphs" className="nav-item"><FaChartBar /> Graphs</Link>
    <Link to="/settings" className="nav-item"><FaCog /> Settings</Link>
  </nav>
);

const Workouts = ({ workouts, setWorkouts }) => {
  const deleteWorkout = (index) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      const updatedWorkouts = workouts.filter((_, i) => i !== index);
      setWorkouts(updatedWorkouts);
    }
  };

  return (
    <div className="workouts-container dark-theme">
      <header>
        <h1>Workouts</h1>
        <Link to="/add-workout" className="add-button"><FaPlus /></Link>
      </header>
      <ul className="workout-list">
        {workouts.length === 0 ? (
          <p>No workouts added yet.</p>
        ) : (
          workouts.map((workout, index) => (
            <li key={index} className="workout-item dark-theme">
              <Link to={`/edit-workout/${index}`} className="workout-link">
                <strong>{workout.date}</strong>
                <ul>
                  {workout.exercises.map((exercise, exIndex) => (
                    <li key={exIndex}>
                      {exercise.name}: {exercise.sets.map(set => `${set.weight}kg x ${set.reps} reps`).join(", ")}
                    </li>
                  ))}
                </ul>
              </Link>
              <button className="delete-button" onClick={() => deleteWorkout(index)}><FaTrash /></button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

const AddWorkout = ({ setWorkouts }) => {
  return <WorkoutForm setWorkouts={setWorkouts} />;
};

const EditWorkout = ({ workouts, setWorkouts }) => {
  const { index } = useParams();
  const workoutIndex = parseInt(index, 10);
  return <WorkoutForm setWorkouts={setWorkouts} initialWorkout={workouts[workoutIndex]} workoutIndex={workoutIndex} />;
};

const WorkoutForm = ({ setWorkouts, initialWorkout = null, workoutIndex = null }) => {
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
    <div className="workout-form-container dark-theme">
      <h2>{workoutIndex !== null ? "Edit Workout" : "Add Workout"}</h2>
      <label>Date: <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
      {exercises.map((exercise, exIndex) => (
        <div key={exIndex} className="exercise-box dark-theme">
          <input type="text" placeholder="Exercise Name" value={exercise.name} onChange={(e) => {
            const newExercises = [...exercises];
            newExercises[exIndex].name = e.target.value;
            setExercises(newExercises);
          }} />
          <button onClick={() => removeExercise(exIndex)}>Remove Exercise</button>
          {exercise.sets.map((set, setIndex) => (
            <div key={setIndex} className="set-box dark-theme">
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

const Graphs = () => <h2>Graphs</h2>;
const Settings = () => <h2>Settings</h2>;
export default App;
