function WorkoutList({ workouts }) {
    return (
      <div>
        <h2>Workout History</h2>
        <ul>
          {workouts.map((workout, index) => (
            <li key={index}>
              {workout.date}: {workout.exercise} - {workout.sets} sets x {workout.reps} reps @ {workout.weight}kg
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default WorkoutList;