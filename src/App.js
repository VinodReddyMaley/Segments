import React, { useState } from 'react';
import "./index.css";

let schemaOptions = [
  { label: "First Name", value: "firstname" },
  { label: "Last Name", value: "lastname" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "accountname" },
  { label: "City", value: "city" },
  { label: "State", value: "state" }
];

function App() {
  let [showPopup, setShowPopup] = useState(false);
  let [segment, setSegment] = useState("");
  let [selectedSchemas, setSelectedSchemas] = useState([]);
  let [availableSchemas, setAvailableSchemas] = useState(schemaOptions);
  let [selectedSchema, setSelectedSchema] = useState("");

  let AddSchema = () => {
    if (selectedSchema) {
      const newSchema = schemaOptions.find(option => option.value === selectedSchema);
      setSelectedSchemas([...selectedSchemas, newSchema]);
      setAvailableSchemas(availableSchemas.filter(option => option.value !== selectedSchema));
      setSelectedSchema('');
    }
  };

  let SchemaChange = (index, newValue) => {
    const updatedSchemas = selectedSchemas.map((schema, i) => i === index ? newValue : schema);
    setSelectedSchemas(updatedSchemas);
    const newAvailableSchemas = schemaOptions.filter(option => !updatedSchemas.includes(option));
    setAvailableSchemas(newAvailableSchemas);
  };

  const SaveSegment = () => {
    const data = {
      segment_name: segment,
      schema: selectedSchemas.map(schema => ({ [schema.value]: schema.label }))
    };
    
    fetch("https://webhook.site/8e557238-f783-4897-aff6-23547da25d11", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="App">
      <div className="lefthalf">
        <button onClick={() => setShowPopup(true)} id="savebutton">Save segment</button>
      </div>
      <div className="righthalf">
        {showPopup && (
          <div className="popup">
            <h2>Save Segment</h2>
            <label>
              Segment Name:
              <input
                type="text"
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
              />
            </label>
         <div className="bluebox">
              {selectedSchemas.map((schema, index) => (
                <div key={index}>
                  <select
                    value={schema.value}
                    onChange={(e) =>
                      SchemaChange(
                        index,
                        schemaOptions.find((option) => option.value === e.target.value)
                      )
                    }
                  >
                    {schemaOptions
                      .filter((option) => !selectedSchemas.includes(option) || option.value === schema.value)
                      .map((option) => (
                      <>
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      </>
                      ))}
                  </select><br/><br/>
                </div>
              ))}
            </div>
            
            {availableSchemas.length > 0 && (
              <>
                <select
                  value={selectedSchema}
                  onChange={(e) => setSelectedSchema(e.target.value)}
                >
                  <option value="">Add schema to segment</option>
                  {availableSchemas.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select><br /><br />
              </>
            )}
            <button onClick={AddSchema}>+Add new schema</button><br /><br />
            <button onClick={SaveSegment} className="savesegment button">Save segment</button><br /><br />
            <button onClick={() => setShowPopup(false)} className="close button">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
