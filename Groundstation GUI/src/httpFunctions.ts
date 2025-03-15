import axios from "axios";

interface SensorData {
  id: number;
  temperature: number;
  pressure: number;
  humidity: number;
  particle: number;
  x: number;
  y: number;
  z: number;
  time: string;
}

interface Data {
  temperature: number;
  pressure: number;
  humidity: number;
  particle: number;
  acceleration: Acceleration;
}

interface Acceleration {
  X: number;
  Y: number;
  Z: number;
}

/**
 *
 * @param option - What data will be deleted:
 * 1 - Everything,
 * 2 - First 10 entrys
 * 3 - Last 24 hours
 */
export const deleteEntries = (option: number) => {
  axios
    .delete(`http://127.0.0.1:5000/delete_entry/${option}`)
    .then((response) => {
      console.log(response.data.message);
    })
    .catch((error) => {
      console.error("Error deleting the data:", error);
    });
};

/**
 *
 * @param entries - How many entrys shall be deleted. The first number of entries specified are deleted.
 */
export const deleteCustomEntries = (entries: number) => {
  axios
    .delete(`http://127.0.0.1:5000/delete_custom/${entries}`)
    .then((response) => {
      console.log(response.data.message);
    })
    .catch((error) => {
      console.error("Fehler beim Löschen:", error);
    });
};

export const checkDataSaved = async (): Promise<boolean> => {
  try{
    const response = await axios.get("http://127.0.0.1:5000/check_data_saved");
    return response.data
  } catch (error) {
    console.log("Error loading the data:", error);
    return false;
  }
  
};

export const getAllDbEntries = async (): Promise<SensorData[]> => {
  try {
    const response = await axios.get("http://127.0.0.1:5000/getAllDbEntries");
    console.log("Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error loading the data:", error);
    return [];
  }
};

export const getNewestDbEntry = async (): Promise<SensorData> => {
  try {
    const response = await axios.get("http://127.0.0.1:5000/getNewestDbEntry");
    console.log("Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error loading the data:", error);
    return {
      id: -1,
      temperature: 0,
      pressure: 0,
      humidity: 0,
      particle: 0,
      x: 0,
      y: 0,
      z: 0,
      time: "01-01-2000 00:00:00"
    };
  }
};


export const fetchData = async (): Promise<Data> => {
  try {
    const response = await axios.get("http://127.0.0.1:5000/data");
    return response.data;
  } catch (error) {
    console.log("Error loading the data", error);
    return {
      temperature: 0,
      pressure: 0,
      humidity: 0,
      particle: 0,
      acceleration: {
        X: 0,
        Y: 0,
        Z: 0,
      }
    }
  }
};