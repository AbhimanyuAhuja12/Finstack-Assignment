from models import db
from models.task import Task
from datetime import date, datetime

def create_sample_data():
    """Create sample data for testing"""
    
    # Create sample tasks
    sample_tasks = [
        {
            'date': date(2019, 3, 12),
            'entity_name': 'PQR Private Limited',
            'task_type': 'Meeting',
            'time': '13:00',
            'contact_person': 'Sanna Stark',
            'note': 'Lorem ipsum dolor sit amet, consectetur adipisc...',
            'status': 'Open',
            'priority': 'High',
            'due_date': date(2019, 3, 15)
        },
        {
            'date': date(2019, 3, 12),
            'entity_name': 'STU Private Limited',
            'task_type': 'Call',
            'time': '13:00',
            'contact_person': 'Frodo Baggins',
            'note': 'Lorem ipsum dolor sit amet, consectetur adipisc...',
            'status': 'Open',
            'priority': 'Medium',
            'due_date': date(2019, 3, 14)
        },
        {
            'date': date(2019, 3, 12),
            'entity_name': 'ABC Private Limited',
            'task_type': 'Call',
            'time': '13:00',
            'contact_person': 'Sarah Connor',
            'note': 'Lorem ipsum dolor sit amet, consectetur adipisc...',
            'status': 'Closed',
            'priority': 'Low',
            'due_date': date(2019, 3, 13),
            'completed_at': datetime(2019, 3, 13, 14, 30)
        },
        {
            'date': date(2019, 3, 12),
            'entity_name': 'ABC Private Limited',
            'task_type': 'Meeting',
            'time': '13:00',
            'contact_person': 'Bilbo Baggins',
            'note': 'Lorem ipsum dolor sit amet, consectetur adipisc...',
            'status': 'In Progress',
            'priority': 'High',
            'due_date': date(2019, 3, 16)
        },
        {
            'date': date(2019, 3, 12),
            'entity_name': 'DEF Private Limited',
            'task_type': 'Call',
            'time': '13:00',
            'contact_person': 'Peregrin Took',
            'note': 'Lorem ipsum dolor sit amet, consectetur adipisc...',
            'status': 'Open',
            'priority': 'Medium',
            'due_date': date(2019, 3, 17)
        },
        {
            'date': date(2019, 3, 13),
            'entity_name': 'GHI Private Limited',
            'task_type': 'Video Call',
            'time': '14:00',
            'contact_person': 'Ned Stark',
            'note': 'Follow-up meeting for project discussion',
            'status': 'Open',
            'priority': 'Urgent',
            'due_date': date(2019, 3, 18)
        },
        {
            'date': date(2019, 3, 13),
            'entity_name': 'JKL Private Limited',
            'task_type': 'Email',
            'time': '15:00',
            'contact_person': 'Jon Snow',
            'note': 'Send project proposal and timeline',
            'status': 'Open',
            'priority': 'Medium',
            'due_date': date(2019, 3, 19)
        }
    ]
    
    for task_data in sample_tasks:
        task = Task(**task_data)
        db.session.add(task)
    
    db.session.commit()
    print("Sample data created successfully!")