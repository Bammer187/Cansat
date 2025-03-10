from SQLDataProvider import SQLDataProvider

class DataFactory:
    instance = None
    create_data_provider_task = None

    @staticmethod
    async def getInstance():
        if DataFactory.instance:
            return DataFactory.instance
        
        if not DataFactory.create_data_provider_task:
            DataFactory.create_data_provider_task = DataFactory.getProvider()

        DataFactory.instance = await DataFactory.create_data_provider_task
        return DataFactory.instance

    @staticmethod
    async def getProvider() -> SQLDataProvider:
        return SQLDataProvider("sensor_values.db")