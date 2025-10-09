from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from .database import db
from .models import Issue, IssueCreate, IssueUpdate, IssueStatus, IssuePriority
from pydantic import BaseModel

app = FastAPI(title="Issue Tracker API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://frontend:4200"],  # Angular dev server & docker
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add response model for paginated results
class PaginatedIssues(BaseModel):
    issues: List[Issue]
    total: int
    page: int
    page_size: int
    total_pages: int

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/issues", response_model=PaginatedIssues)
async def get_issues(
    page: int = Query(0, ge=0, description="Page number (0-based)"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page"),
    search: Optional[str] = Query(None, description="Search in title"),
    status: Optional[IssueStatus] = Query(None, description="Filter by status"),
    priority: Optional[IssuePriority] = Query(None, description="Filter by priority"),
    assignee: Optional[str] = Query(None, description="Filter by assignee"),
    sort_by: Optional[str] = Query("updated_at", description="Field to sort by"),
    sort_order: Optional[str] = Query("desc", description="Sort order: asc or desc")
):
    issues = db.get_all_issues()
    
    # Apply search filter
    if search:
        issues = [issue for issue in issues if search.lower() in issue.title.lower()]
    
    # Apply status filter
    if status:
        issues = [issue for issue in issues if issue.status == status]
    
    # Apply priority filter
    if priority:
        issues = [issue for issue in issues if issue.priority == priority]
    
    # Apply assignee filter
    if assignee:
        if assignee.lower() == "unassigned":
            issues = [issue for issue in issues if not issue.assignee]
        else:
            issues = [issue for issue in issues if issue.assignee and assignee.lower() in issue.assignee.lower()]
    
    # Apply sorting
    if sort_by and hasattr(Issue, sort_by):
        reverse = sort_order.lower() == "desc"
        issues.sort(key=lambda x: getattr(x, sort_by), reverse=reverse)
    
    # Calculate pagination values
    total = len(issues)
    total_pages = (total + page_size - 1) // page_size if page_size > 0 else 0
    
    # Apply pagination
    start_idx = page * page_size
    end_idx = start_idx + page_size
    paginated_issues = issues[start_idx:end_idx]
    
    return PaginatedIssues(
        issues=paginated_issues,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@app.get("/issues/{issue_id}", response_model=Issue)
async def get_issue(issue_id: int):
    issue = db.get_issue(issue_id)
    if issue is None:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue

@app.post("/issues", response_model=Issue)
async def create_issue(issue: IssueCreate):
    return db.create_issue(issue)

@app.put("/issues/{issue_id}", response_model=Issue)
async def update_issue(issue_id: int, issue_update: IssueUpdate):
    updated_issue = db.update_issue(issue_id, issue_update)
    if updated_issue is None:
        raise HTTPException(status_code=404, detail="Issue not found")
    return updated_issue

@app.delete("/issues/{issue_id}")
async def delete_issue(issue_id: int):
    if not db.delete_issue(issue_id):
        raise HTTPException(status_code=404, detail="Issue not found")
    return {"message": "Issue deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)