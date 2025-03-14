import axios from "axios";

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

export const checkDataSaved = (): boolean => {
  axios
    .get("http://127.0.0.1:5000/check_data_saved")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error loading the data: ", error);
    });
  return false;
};

export const getAllDbEntries = async (): Promise<JSON[]> => {
  try {
    const response = await axios.get("http://127.0.0.1:5000/getAllDbEntries");
    console.log("Response Data:", response.data);
    return response.data
  } catch (error) {
    console.log("Error loading the data:", error);
    return [];
  }
};

export const getNewestDbEntry = () => {
    axios
      .get("http://127.0.0.1:5000/getNewestDbEntry")
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("Error loading the data: ", error);
      });
  };
