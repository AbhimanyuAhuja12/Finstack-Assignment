from flask import jsonify
import logging

logger = logging.getLogger(__name__)

def register_error_handlers(app):
    """Register error handlers for the Flask app"""
    
    @app.errorhandler(400)
    def bad_request(error):
        logger.warning(f"Bad request: {error}")
        return jsonify({'error': 'Bad request'}), 400
    
    @app.errorhandler(404)
    def not_found(error):
        logger.warning(f"Resource not found: {error}")
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        logger.warning(f"Method not allowed: {error}")
        return jsonify({'error': 'Method not allowed'}), 405
    
    @app.errorhandler(409)
    def conflict(error):
        logger.warning(f"Conflict: {error}")
        return jsonify({'error': 'Conflict'}), 409
    
    @app.errorhandler(422)
    def unprocessable_entity(error):
        logger.warning(f"Unprocessable entity: {error}")
        return jsonify({'error': 'Unprocessable entity'}), 422
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {error}")
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(Exception)
    def handle_exception(error):
        logger.error(f"Unhandled exception: {error}")
        return jsonify({'error': 'An unexpected error occurred'}), 500