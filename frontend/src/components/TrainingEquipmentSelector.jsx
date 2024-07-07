import { useEffect, useState } from "react";
import './styles/TrainingEquipmentSelector.css';

const TrainingEquipmentSelector = () => {
  const equipments = [
    {
      id: 1,
      name: 'Equipamiento 1',
      url: '/path/to/image1.jpg'
    },
    {
      id: 2,
      name: 'Equipamiento 2',
      url: '/path/to/image2.jpg'
    },
    {
      id: 3,
      name: 'Equipamiento 3',
      url: '/path/to/image3.jpg'
    },
    {
      id: 4,
      name: 'Equipamiento 4',
      url: '/path/to/image4.jpg'
    },
    {
      id: 5,
      name: 'Equipamiento 5',
      url: '/path/to/image5.jpg'
    },
    {
      id: 6,
      name: 'Equipamiento 6',
      url: '/path/to/image6.jpg'
    },
    {
      id: 7,
      name: 'Equipamiento 7',
      url: '/path/to/image7.jpg'
    }
  ];

  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

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

  const [selectedEquipments, setSelectedEquipments] = useState([])
  
  const handleEquipmentSelection = (equipmentId) => {
    let newSelectedEquipments = selectedEquipments
    if(selectedEquipments.find(e => e.id === equipmentId))
      newSelectedEquipments = selectedEquipments.filter(e => e.id !== equipmentId)
    else
      newSelectedEquipments = [...selectedEquipments, equipments.find(e => e.id === equipmentId)]

    console.log(newSelectedEquipments)
    setSelectedEquipments(newSelectedEquipments)
  }

  useEffect(() => console.log(selectedEquipments), [selectedEquipments])

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
