import { useEffect, useState } from "react";
import './styles/TrainingEquipmentSelector.css';

const TrainingEquipmentSelector = ({initialSelectedEquipment}) => {
  const [equipments, setEquipments] = useState([])
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4; //todo make this a prop

  const handleNext = () => {
    const nextIndex = startIndex + itemsPerPage;
    if (nextIndex < equipments.length) {
      setStartIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    const prevIndex = startIndex - itemsPerPage;
    if (prevIndex >= 0) {
      setStartIndex(prevIndex);
    }
  };

  const visibleEquipments = equipments.slice(startIndex, startIndex + itemsPerPage);

  const [selectedEquipments, setSelectedEquipments] = useState(initialSelectedEquipment || [])
  
  const handleEquipmentSelection = (equipmentId) => {
    let newSelectedEquipments = selectedEquipments
    if(selectedEquipments.find(e => e.id === equipmentId))
      newSelectedEquipments = selectedEquipments.filter(e => e.id !== equipmentId)
    else
      newSelectedEquipments = [...selectedEquipments, equipments.find(e => e.id === equipmentId)]

    setSelectedEquipments(newSelectedEquipments)
  }

  const fetchTrainingEquipments = async () => {
    try {
      const response = await fetch('http://localhost:8002/api/v1/training_equipments');
      const data = await response.json();
      setEquipments(data);
      setSelectedEquipments(data.filter(e => initialSelectedEquipment.map(eq => eq.id).includes(e.id)) || [])
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchTrainingEquipments();
  },[])

  useEffect(() => {
    const event = new CustomEvent('equipmentSelectionChange', { detail: selectedEquipments });
    window.dispatchEvent(event);
  },[selectedEquipments])

  return (
    <div className="equipment-selector">
      <button onClick={handlePrev} disabled={startIndex === 0}>{'<'}</button> 
      <div className="equipment-list">
        {visibleEquipments.map((equipment) => (
          <div className="equipment-item" key={`equipment_${equipment.id}`} onClick={() => handleEquipmentSelection(equipment.id)}>
            <img src={equipment.url} alt={equipment.name} />
            <h3  style={{color: `${selectedEquipments.find(e => e.id === equipment.id) ? '#28a745' : ''}`}}>{equipment.name}</h3>
          </div>
        ))}
      </div>
      <button onClick={handleNext} disabled={startIndex + itemsPerPage >= equipments.length}>{'>'}</button>
    </div>
  );
};

export default TrainingEquipmentSelector;
