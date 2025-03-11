from .sql_data_provider import SQLDataProvider

class DataFactory:
    instance = None
    create_data_provider_task = None

    @staticmethod
    def getInstance() -> SQLDataProvider:
        if DataFactory.instance:
            return DataFactory.instance
        
        if not DataFactory.create_data_provider_task:
            DataFactory.create_data_provider_task = DataFactory.getProvider()

        DataFactory.instance = DataFactory.create_data_provider_task
        return DataFactory.instance

    @staticmethod
    def getProvider() -> SQLDataProvider:
        return SQLDataProvider("sensor_data.db")