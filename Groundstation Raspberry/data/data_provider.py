class DataProvider:
    
    def initDB(self):
        raise Exception("Method not yet implemented")
    
    def post_sensor_data(self, server_url, data):
        raise Exception("Method not yet implemented")
    
    def save_to_db(self, data):
        raise Exception("Method not yet implemented")
    
    def delete_entries(self, number):
        raise Exception("Method not yet implemented")
    
    def delete_all_entries(self):
        raise Exception("Method not yet implemented")
    
    def delete_last_24h(self):
        raise Exception("Method not yet implemented")
    
    def getAllDbEntries(self):
        raise Exception("Method not yet implemented")
    
    def getNewestDbEntry(self):
        raise Exception("Method not yet implemented")

    def open_connection(self, database):  
        raise Exception("Method not yet implemented")

    def close_connection(self, database):
        raise Exception("Method not yet implemented")  
