import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database configuration
    MYSQL_HOST = os.environ.get('MYSQL_HOST') or 'localhost'
    MYSQL_PORT = os.environ.get('MYSQL_PORT') or 3306
    MYSQL_USER = os.environ.get('MYSQL_USER') or 'root'
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD') or 'password'
    MYSQL_DATABASE = os.environ.get('MYSQL_DATABASE') or 'task_management'
    
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@"
        f"{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Connection pool settings - CRITICAL for avoiding connection limit errors
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 2,                   
        'max_overflow': 1,                
        'pool_recycle': 1800,              
        'pool_pre_ping': True,             
        'pool_timeout': 30,                
        'pool_reset_on_return': 'commit', 
        'connect_args': {
            'charset': 'utf8mb4',
            'connect_timeout': 10,        
            'read_timeout': 30,          
            'write_timeout': 30,           
            'autocommit': False,         
        }
    }
    
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # Pagination
    TASKS_PER_PAGE = int(os.environ.get('TASKS_PER_PAGE', 20))
    
    # Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True
    
    # Even more conservative settings for development
    SQLALCHEMY_ENGINE_OPTIONS = {
        **Config.SQLALCHEMY_ENGINE_OPTIONS,
        'pool_size': 1,           
        'max_overflow': 1,        
        'echo_pool': True,        
    }

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ECHO = False
    
    # Production optimized settings
    SQLALCHEMY_ENGINE_OPTIONS = {
        **Config.SQLALCHEMY_ENGINE_OPTIONS,
        'pool_size': 3,           
        'max_overflow': 2,        
        'pool_recycle': 3600,     
    }

class TestingConfig(Config):
    TESTING = True
    MYSQL_DATABASE = os.environ.get('MYSQL_TEST_DATABASE') or 'task_management_test'
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{Config.MYSQL_USER}:{Config.MYSQL_PASSWORD}@"
        f"{Config.MYSQL_HOST}:{Config.MYSQL_PORT}/{MYSQL_DATABASE}"
    )
    
    # Minimal connections for testing
    SQLALCHEMY_ENGINE_OPTIONS = {
        **Config.SQLALCHEMY_ENGINE_OPTIONS,
        'pool_size': 1,
        'max_overflow': 0,
    }

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}