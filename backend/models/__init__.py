from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import all models to ensure they are registered
from .task import Task

__all__ = ['db', 'Task']