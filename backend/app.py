from flask import Flask
from flask_cors import CORS
from config.config import Config
from models import db
from routes.task_routes import task_bp
from utils.error_handlers import register_error_handlers
import logging
from logging.handlers import RotatingFileHandler
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    db.init_app(app)
    
    CORS(app, origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://finstack-assignment-pi.vercel.app"
    ])
    
    app.register_blueprint(task_bp, url_prefix='/api')
    
    register_error_handlers(app)
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler('logs/task_management.log',
                                         maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Task Management API startup')
    
    with app.app_context():
        db.create_all()
        
        from models.task import Task
        if Task.query.count() == 0:
            from utils.sample_data import create_sample_data
            create_sample_data()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)

# app = create_app()
