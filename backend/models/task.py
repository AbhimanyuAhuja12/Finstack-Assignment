from models import db
from datetime import datetime, date
from sqlalchemy import Index

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, default=date.today, index=True)
    entity_name = db.Column(db.String(100), nullable=False, index=True)
    task_type = db.Column(db.Enum('Meeting', 'Call', 'Video Call', 'Email', 'Follow-up', name='task_types'), 
                         nullable=False, index=True)
    time = db.Column(db.String(10), nullable=False)
    contact_person = db.Column(db.String(100), nullable=False, index=True)
    note = db.Column(db.Text, nullable=True)
    status = db.Column(db.Enum('Open', 'Closed', 'In Progress', 'Cancelled', name='task_status'), 
                      nullable=False, default='Open', index=True)
    priority = db.Column(db.Enum('Low', 'Medium', 'High', 'Urgent', name='task_priority'), 
                        nullable=False, default='Medium')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    due_date = db.Column(db.Date, nullable=True, index=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Indexes for better query performance
    __table_args__ = (
        Index('idx_task_date_status', 'date', 'status'),
        Index('idx_task_entity_type', 'entity_name', 'task_type'),
        Index('idx_task_contact_status', 'contact_person', 'status'),
    )
    
    def __repr__(self):
        return f'<Task {self.id}: {self.entity_name} - {self.task_type}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'entity_name': self.entity_name,
            'task_type': self.task_type,
            'time': self.time,
            'contact_person': self.contact_person,
            'note': self.note,
            'status': self.status,
            'priority': self.priority,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
    
    @classmethod
    def get_filtered_tasks(cls, filters=None, sort_by='date', sort_order='desc', page=1, per_page=20):
        """Get filtered and sorted tasks with pagination"""
        query = cls.query
        
        if filters:
            if filters.get('entity_name'):
                query = query.filter(cls.entity_name.ilike(f"%{filters['entity_name']}%"))
            if filters.get('task_type'):
                query = query.filter(cls.task_type == filters['task_type'])
            if filters.get('status'):
                query = query.filter(cls.status == filters['status'])
            if filters.get('contact_person'):
                query = query.filter(cls.contact_person.ilike(f"%{filters['contact_person']}%"))
            if filters.get('date'):
                query = query.filter(cls.date == filters['date'])
            if filters.get('priority'):
                query = query.filter(cls.priority == filters['priority'])
            if filters.get('due_date'):
                query = query.filter(cls.due_date == filters['due_date'])
        
        # Apply sorting
        if hasattr(cls, sort_by):
            if sort_order.lower() == 'desc':
                query = query.order_by(getattr(cls, sort_by).desc())
            else:
                query = query.order_by(getattr(cls, sort_by).asc())
        
        return query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
    
    def update_status(self, new_status):
        """Update task status and set completion time if closed"""
        self.status = new_status
        if new_status == 'Closed':
            self.completed_at = datetime.utcnow()
        elif self.completed_at:
            self.completed_at = None
        self.updated_at = datetime.utcnow()