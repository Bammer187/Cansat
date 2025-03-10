from DataProvider import DataProvider
import sqlite3
import requests

class SQLDataProvider(DataProvider):
    
    def __init__(self):
        super().__init__()
