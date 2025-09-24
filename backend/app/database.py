from typing import Dict, List
from datetime import datetime
from .models import Issue, IssueCreate, IssueStatus, IssueUpdate, IssuePriority
from typing import Optional
# In-memory database (for demo purposes)
class Database:
    def __init__(self):
        self.issues: Dict[int, Issue] = {}
        self.next_id = 1
        self._initialize_sample_data()
    
    def _initialize_sample_data(self):
        # Add some sample issues
        sample_issues = [
            {
                "title": "Fix login page bug",
                "description": "Users cannot login with correct credentials",
                "status": IssueStatus.OPEN,
                "priority": IssuePriority.HIGH,
                "assignee": "john@example.com"
            },
            {
                "title": "Add user registration",
                "description": "Implement user registration functionality",
                "status": IssueStatus.IN_PROGRESS,
                "priority": IssuePriority.MEDIUM,
                "assignee": "sarah@example.com"
            },
            {
                "title": "Update documentation",
                "description": "Update API documentation for new endpoints",
                "status": IssueStatus.OPEN,
                "priority": IssuePriority.LOW,
                "assignee": "mike@example.com"
            }
        ]
        
        for issue_data in sample_issues:
            self.create_issue(IssueCreate(**issue_data))
    
    def create_issue(self, issue: IssueCreate) -> Issue:
        now = datetime.now()
        new_issue = Issue(
            id=self.next_id,
            created_at=now,
            updated_at=now,
            **issue.dict()
        )
        self.issues[self.next_id] = new_issue
        self.next_id += 1
        return new_issue
    
    def get_issue(self, issue_id: int) -> Optional[Issue]:
        return self.issues.get(issue_id)
    
    def get_all_issues(self) -> List[Issue]:
        return list(self.issues.values())
    
    def update_issue(self, issue_id: int, issue_update: IssueUpdate) -> Optional[Issue]:
        if issue_id not in self.issues:
            return None
        
        existing_issue = self.issues[issue_id]
        update_data = issue_update.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(existing_issue, field, value)
        
        existing_issue.updated_at = datetime.now()
        return existing_issue
    
    def delete_issue(self, issue_id: int) -> bool:
        if issue_id in self.issues:
            del self.issues[issue_id]
            return True
        return False

# Global database instance
db = Database()