import { useState } from 'react';
import MusclesGroupSelector from './MusclesGroupSelector.jsx';

const ParentComponent = () => {
  const [selectedMuscles, setSelectedMuscles] = useState(['biceps']);

  const handleMuscleClick = (muscle) => {
    console.log(muscle)
    setSelectedMuscles((prevSelectedMuscles) => 
      prevSelectedMuscles.includes(muscle)
        ? prevSelectedMuscles.filter(m => m !== muscle)
        : [...prevSelectedMuscles, muscle]
    );
  };

  return (
    <div className='w-full h-full'>
      <MusclesGroupSelector selectedMuscles={selectedMuscles} onMuscleChange={handleMuscleClick} client:only="react"></MusclesGroupSelector>
      {selectedMuscles.map(el => (<h1>{el}</h1>))}
    </div>
  );
};

export default ParentComponent;
