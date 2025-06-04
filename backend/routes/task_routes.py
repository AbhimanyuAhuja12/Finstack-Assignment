from flask import Blueprint, request, jsonify
from models import db
from models.task import Task
from utils.validators import validate_task_data, validate_task_update
from datetime import datetime
import logging

task_bp = Blueprint('tasks', __name__)
logger = logging.getLogger(__name__)

@task_bp.route('/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks with optional filtering, sorting, and pagination"""
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)  # Max 100 per page
        
        # Filtering parameters
        filters = {}
        if request.args.get('entity_name'):
            filters['entity_name'] = request.args.get('entity_name')
        if request.args.get('task_type'):
            filters['task_type'] = request.args.get('task_type')
        if request.args.get('status'):
            filters['status'] = request.args.get('status')
        if request.args.get('contact_person'):
            filters['contact_person'] = request.args.get('contact_person')
        if request.args.get('priority'):
            filters['priority'] = request.args.get('priority')
        if request.args.get('date'):
            try:
                filters['date'] = datetime.strptime(request.args.get('date'), '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        if request.args.get('due_date'):
            try:
                filters['due_date'] = datetime.strptime(request.args.get('due_date'), '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid due_date format. Use YYYY-MM-DD'}), 400
        
        # Sorting parameters
        sort_by = request.args.get('sort_by', 'date')
        sort_order = request.args.get('sort_order', 'desc')
        
        # Validate sort_by field
        valid_sort_fields = ['id', 'date', 'entity_name', 'task_type', 'time', 
                           'contact_person', 'status', 'priority', 'created_at', 
                           'updated_at', 'due_date']
        if sort_by not in valid_sort_fields:
            return jsonify({'error': f'Invalid sort field. Valid fields: {valid_sort_fields}'}), 400
        
        # Get filtered and paginated tasks
        pagination = Task.get_filtered_tasks(
            filters=filters,
            sort_by=sort_by,
            sort_order=sort_order,
            page=page,
            per_page=per_page
        )
        
        tasks_data = [task.to_dict() for task in pagination.items]
        
        response_data = {
            'tasks': tasks_data,
            'pagination': {
                'page': pagination.page,
                'pages': pagination.pages,
                'per_page': pagination.per_page,
                'total': pagination.total,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev,
                'next_num': pagination.next_num,
                'prev_num': pagination.prev_num
            },
            'filters_applied': filters,
            'sort': {
                'sort_by': sort_by,
                'sort_order': sort_order
            }
        }
        
        return jsonify(response_data)
    
    except Exception as e:
        logger.error(f"Error fetching tasks: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@task_bp.route('/tasks', methods=['POST'])
def create_task():
    """Create a new task"""
    try:
        data = request.get_json()
        
        # Validate input data
        validation_error = validate_task_data(data)
        if validation_error:
            return jsonify({'error': validation_error}), 400
        
        # Create new task
        task = Task(
            date=datetime.strptime(data.get('date', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
            entity_name=data['entity_name'],
            task_type=data['task_type'],
            time=data['time'],
            contact_person=data['contact_person'],
            note=data.get('note', ''),
            status=data.get('status', 'Open'),
            priority=data.get('priority', 'Medium'),
            due_date=datetime.strptime(data['due_date'], '%Y-%m-%d').date() if data.get('due_date') else None
        )
        
        db.session.add(task)
        db.session.commit()
        
        logger.info(f"Task created successfully: {task.id}")
        return jsonify(task.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating task: {str(e)}")
        return jsonify({'error': 'Failed to create task'}), 500

@task_bp.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """Get a specific task by ID"""
    try:
        task = Task.query.get_or_404(task_id)
        return jsonify(task.to_dict())
    
    except Exception as e:
        logger.error(f"Error fetching task {task_id}: {str(e)}")
        return jsonify({'error': 'Task not found'}), 404

@task_bp.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Update a specific task"""
    try:
        task = Task.query.get_or_404(task_id)
        data = request.get_json()
        
        # Validate update data
        validation_error = validate_task_update(data)
        if validation_error:
            return jsonify({'error': validation_error}), 400
        
        # Update fields if provided
        if 'entity_name' in data:
            task.entity_name = data['entity_name']
        if 'task_type' in data:
            task.task_type = data['task_type']
        if 'time' in data:
            task.time = data['time']
        if 'contact_person' in data:
            task.contact_person = data['contact_person']
        if 'note' in data:
            task.note = data['note']
        if 'status' in data:
            task.update_status(data['status'])
        if 'priority' in data:
            task.priority = data['priority']
        if 'date' in data:
            task.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if 'due_date' in data:
            task.due_date = datetime.strptime(data['due_date'], '%Y-%m-%d').date() if data['due_date'] else None
        
        task.updated_at = datetime.utcnow()
        db.session.commit()
        
        logger.info(f"Task updated successfully: {task_id}")
        return jsonify(task.to_dict())
    
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating task {task_id}: {str(e)}")
        return jsonify({'error': 'Failed to update task'}), 500

@task_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a specific task"""
    try:
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        
        logger.info(f"Task deleted successfully: {task_id}")
        return jsonify({'message': 'Task deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting task {task_id}: {str(e)}")
        return jsonify({'error': 'Failed to delete task'}), 500

@task_bp.route('/tasks/<int:task_id>/status', methods=['PATCH'])
def update_task_status(task_id):
    """Update only the status of a specific task"""
    try:
        task = Task.query.get_or_404(task_id)
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'error': 'Status field is required'}), 400
        
        valid_statuses = ['Open', 'Closed', 'In Progress', 'Cancelled']
        if data['status'] not in valid_statuses:
            return jsonify({'error': f'Status must be one of: {valid_statuses}'}), 400
        
        task.update_status(data['status'])
        db.session.commit()
        
        logger.info(f"Task status updated successfully: {task_id} -> {data['status']}")
        return jsonify(task.to_dict())
    
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating task status {task_id}: {str(e)}")
        return jsonify({'error': 'Failed to update task status'}), 500

@task_bp.route('/tasks/stats', methods=['GET'])
def get_task_stats():
    """Get task statistics"""
    try:
        total_tasks = Task.query.count()
        open_tasks = Task.query.filter(Task.status == 'Open').count()
        closed_tasks = Task.query.filter(Task.status == 'Closed').count()
        in_progress_tasks = Task.query.filter(Task.status == 'In Progress').count()
        
        # Task type distribution
        task_types = db.session.query(Task.task_type, db.func.count(Task.id)).group_by(Task.task_type).all()
        
        # Priority distribution
        priorities = db.session.query(Task.priority, db.func.count(Task.id)).group_by(Task.priority).all()
        
        # Tasks by status
        statuses = db.session.query(Task.status, db.func.count(Task.id)).group_by(Task.status).all()
        
        # Overdue tasks
        from datetime import date
        overdue_tasks = Task.query.filter(
            Task.due_date < date.today(),
            Task.status.in_(['Open', 'In Progress'])
        ).count()
        
        return jsonify({
            'total_tasks': total_tasks,
            'open_tasks': open_tasks,
            'closed_tasks': closed_tasks,
            'in_progress_tasks': in_progress_tasks,
            'overdue_tasks': overdue_tasks,
            'task_types': [{'type': t[0], 'count': t[1]} for t in task_types],
            'priorities': [{'priority': p[0], 'count': p[1]} for p in priorities],
            'statuses': [{'status': s[0], 'count': s[1]} for s in statuses]
        })
    
    except Exception as e:
        logger.error(f"Error fetching task stats: {str(e)}")
        return jsonify({'error': 'Failed to fetch statistics'}), 500

@task_bp.route('/tasks/bulk', methods=['POST'])
def bulk_create_tasks():
    """Create multiple tasks at once"""
    try:
        data = request.get_json()
        
        if not isinstance(data, dict) or 'tasks' not in data:
            return jsonify({'error': 'Request must contain a "tasks" array'}), 400
        
        tasks_data = data['tasks']
        if not isinstance(tasks_data, list):
            return jsonify({'error': 'Tasks must be an array'}), 400
        
        created_tasks = []
        errors = []
        
        for i, task_data in enumerate(tasks_data):
            try:
                validation_error = validate_task_data(task_data)
                if validation_error:
                    errors.append(f"Task {i+1}: {validation_error}")
                    continue
                
                task = Task(
                    date=datetime.strptime(task_data.get('date', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
                    entity_name=task_data['entity_name'],
                    task_type=task_data['task_type'],
                    time=task_data['time'],
                    contact_person=task_data['contact_person'],
                    note=task_data.get('note', ''),
                    status=task_data.get('status', 'Open'),
                    priority=task_data.get('priority', 'Medium'),
                    due_date=datetime.strptime(task_data['due_date'], '%Y-%m-%d').date() if task_data.get('due_date') else None
                )
                
                db.session.add(task)
                created_tasks.append(task)
                
            except Exception as e:
                errors.append(f"Task {i+1}: {str(e)}")
        
        if created_tasks:
            db.session.commit()
            logger.info(f"Bulk created {len(created_tasks)} tasks")
        
        response = {
            'created_count': len(created_tasks),
            'error_count': len(errors),
            'created_tasks': [task.to_dict() for task in created_tasks]
        }
        
        if errors:
            response['errors'] = errors
        
        return jsonify(response), 201 if created_tasks else 400
    
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error in bulk task creation: {str(e)}")
        return jsonify({'error': 'Failed to create tasks'}), 500

@task_bp.route('/tasks/export', methods=['GET'])
def export_tasks():
    """Export tasks to CSV format"""
    try:
        import csv
        import io
        
        # Get all tasks (you might want to add filtering here)
        tasks = Task.query.all()
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            'ID', 'Date', 'Entity Name', 'Task Type', 'Time', 'Contact Person',
            'Note', 'Status', 'Priority', 'Due Date', 'Created At', 'Updated At'
        ])
        
        # Write data
        for task in tasks:
            writer.writerow([
                task.id,
                task.date.isoformat() if task.date else '',
                task.entity_name,
                task.task_type,
                task.time,
                task.contact_person,
                task.note or '',
                task.status,
                task.priority,
                task.due_date.isoformat() if task.due_date else '',
                task.created_at.isoformat() if task.created_at else '',
                task.updated_at.isoformat() if task.updated_at else ''
            ])
        
        output.seek(0)
        
        from flask import Response
        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=tasks_export.csv'}
        )
    
    except Exception as e:
        logger.error(f"Error exporting tasks: {str(e)}")
        return jsonify({'error': 'Failed to export tasks'}), 500