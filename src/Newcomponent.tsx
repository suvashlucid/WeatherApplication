import React, { useState } from "react";
import * as bs from "bikram-sambat"; // Importing the entire bikram-sambat package

const DateConversion: React.FC = () => {
  const [gregorianDate, setGregorianDate] = useState<string>("");
  const [bikramDate, setBikramDate] = useState<string>(""); // Set initial state to an empty string
  const [conversionType, setConversionType] = useState<"toBik_dev" | "toGreg">(
    "toBik_dev"
  );

  const handleGregorianChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGregorianDate(event.target.value);
  };

  const handleBikramChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBikramDate(event.target.value);
  };

  const handleConvert = () => {
    if (conversionType === "toBik_dev") {
      // Use the toBik_dev function from bikram-sambat package
      setBikramDate(bs.toBik_dev(gregorianDate));
    } else if (conversionType === "toGreg") {
      // Use the toGreg_text function from bikram-sambat package
      setGregorianDate(bs.toGreg_text(bikramDate));
    }
  };

  return (
    <div>
      <h2>Date Conversion</h2>
      <div>
        <label>Gregorian Date:</label>
        <input
          type="date"
          value={gregorianDate}
          onChange={handleGregorianChange}
        />
      </div>
      <div>
        <label>Bikram Sambat Date:</label>
        <input type="text" value={bikramDate} onChange={handleBikramChange} />
      </div>
      <div>
        <label>Conversion Type:</label>
        <select
          value={conversionType}
          onChange={(e) =>
            setConversionType(e.target.value as "toBik_dev" | "toGreg")
          }
        >
          <option value="toBik_dev">Gregorian to Bikram Sambat</option>
          <option value="toGreg">Bikram Sambat to Gregorian</option>
        </select>
      </div>
      <button onClick={handleConvert}>Convert</button>
    </div>
  );
};

export default DateConversion;
