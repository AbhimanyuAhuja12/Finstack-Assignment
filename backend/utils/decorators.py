from functools import wraps
from flask import request, jsonify
from utils.auth import verify_token
from models.user import User
import logging

logger = logging.getLogger(__name__)

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Authentication required'}), 401
        
        # Remove 'Bearer ' prefix if present
        if token.startswith('Bearer '):
            token = token[7:]
        
        user_id = verify_token(token)
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Get user and add to request context
        user = User.query.get(user_id)
        if not user or not user.is_active:
            return jsonify({'error': 'User not found or inactive'}), 401
        
        request.current_user = user
        return f(*args, **kwargs)
    
    return decorated_function

def require_role(required_role):
    """Decorator to require specific role"""
    def decorator(f):
        @wraps(f)
        @require_auth
        def decorated_function(*args, **kwargs):
            if request.current_user.role != required_role:
                return jsonify({'error': f'Role {required_role} required'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def require_roles(*required_roles):
    """Decorator to require one of multiple roles"""
    def decorator(f):
        @wraps(f)
        @require_auth
        def decorated_function(*args, **kwargs):
            if request.current_user.role not in required_roles:
                return jsonify({'error': f'One of these roles required: {required_roles}'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def log_api_call(f):
    """Decorator to log API calls"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        logger.info(f"API call: {request.method} {request.path} from {request.remote_addr}")
        return f(*args, **kwargs)
    return decorated_function