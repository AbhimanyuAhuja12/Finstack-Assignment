import re
from datetime import datetime

def validate_task_data(data):
    """Validate task creation/update data"""
    if not isinstance(data, dict):
        return "Invalid data format"
    
    # Required fields for creation
    required_fields = ['entity_name', 'task_type', 'time', 'contact_person']
    for field in required_fields:
        if field not in data or not data[field]:
            return f"Missing required field: {field}"
    
    # Validate entity_name
    if len(data['entity_name']) > 100:
        return "Entity name must be 100 characters or less"
    
    # Validate task_type
    valid_task_types = ['Meeting', 'Call', 'Video Call', 'Email', 'Follow-up']
    if data['task_type'] not in valid_task_types:
        return f"Task type must be one of: {valid_task_types}"
    
    # Validate time format (HH:MM)
    time_pattern = re.compile(r'^([01]?[0-9]|2[0-3]):[0-5][0-9]$')
    if not time_pattern.match(data['time']):
        return "Time must be in HH:MM format"
    
    # Validate contact_person
    if len(data['contact_person']) > 100:
        return "Contact person must be 100 characters or less"
    
    # Validate optional fields
    if 'status' in data:
        valid_statuses = ['Open', 'Closed', 'In Progress', 'Cancelled']
        if data['status'] not in valid_statuses:
            return f"Status must be one of: {valid_statuses}"
    
    if 'priority' in data:
        valid_priorities = ['Low', 'Medium', 'High', 'Urgent']
        if data['priority'] not in valid_priorities:
            return f"Priority must be one of: {valid_priorities}"
    
    # Validate date format
    if 'date' in data and data['date']:
        try:
            datetime.strptime(data['date'], '%Y-%m-%d')
        except ValueError:
            return "Date must be in YYYY-MM-DD format"
    
    # Validate due_date format
    if 'due_date' in data and data['due_date']:
        try:
            datetime.strptime(data['due_date'], '%Y-%m-%d')
        except ValueError:
            return "Due date must be in YYYY-MM-DD format"
    
    # Validate note length
    if 'note' in data and data['note'] and len(data['note']) > 1000:
        return "Note must be 1000 characters or less"
    
    return None

def validate_task_update(data):
    """Validate task update data (less strict than creation)"""
    if not isinstance(data, dict):
        return "Invalid data format"
    
    # If fields are provided, validate them
    if 'entity_name' in data and (not data['entity_name'] or len(data['entity_name']) > 100):
        return "Entity name must be 1-100 characters"
    
    if 'task_type' in data:
        valid_task_types = ['Meeting', 'Call', 'Video Call', 'Email', 'Follow-up']
        if data['task_type'] not in valid_task_types:
            return f"Task type must be one of: {valid_task_types}"
    
    if 'time' in data:
        time_pattern = re.compile(r'^([01]?[0-9]|2[0-3]):[0-5][0-9]$')
        if not time_pattern.match(data['time']):
            return "Time must be in HH:MM format"
    
    if 'contact_person' in data and (not data['contact_person'] or len(data['contact_person']) > 100):
        return "Contact person must be 1-100 characters"
    
    if 'status' in data:
        valid_statuses = ['Open', 'Closed', 'In Progress', 'Cancelled']
        if data['status'] not in valid_statuses:
            return f"Status must be one of: {valid_statuses}"
    
    if 'priority' in data:
        valid_priorities = ['Low', 'Medium', 'High', 'Urgent']
        if data['priority'] not in valid_priorities:
            return f"Priority must be one of: {valid_priorities}"
    
    if 'date' in data and data['date']:
        try:
            datetime.strptime(data['date'], '%Y-%m-%d')
        except ValueError:
            return "Date must be in YYYY-MM-DD format"
    
    if 'due_date' in data and data['due_date']:
        try:
            datetime.strptime(data['due_date'], '%Y-%m-%d')
        except ValueError:
            return "Due date must be in YYYY-MM-DD format"
    
    if 'note' in data and data['note'] and len(data['note']) > 1000:
        return "Note must be 1000 characters or less"
    
    return None