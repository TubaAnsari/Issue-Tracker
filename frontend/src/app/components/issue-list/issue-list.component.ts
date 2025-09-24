import { Component, OnInit } from '@angular/core';
import { Issue, IssueStatus, IssuePriority } from '../../models/issue.model';
import { IssueService, GetIssuesParams } from '../../services/issue.service';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {
  issues: Issue[] = [];
  selectedIssue: Issue | null = null;
  showDetail = false;
  showCreateForm = false;
  
  // Filter and pagination properties
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  searchTerm = '';
  statusFilter = '';
  priorityFilter = '';
  assigneeFilter = '';
  sortBy = 'updated_at';
  sortOrder = 'desc';

  // Available options for filters
  statusOptions = Object.values(IssueStatus);
  priorityOptions = Object.values(IssuePriority);

  constructor(private issueService: IssueService) {}

  ngOnInit(): void {
    this.loadIssues();
  }

  loadIssues(): void {
    const params: GetIssuesParams = {
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm,
      status: this.statusFilter,
      priority: this.priorityFilter,
      assignee: this.assigneeFilter,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };

    this.issueService.getIssues(params).subscribe({
      next: (issues) => {
        this.issues = issues;
        // Note: In a real app, you'd get total count from API
        this.totalItems = issues.length;
      },
      error: (error) => {
        console.error('Error loading issues:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadIssues();
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadIssues();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadIssues();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadIssues();
  }

  onIssueClick(issue: Issue, event: MouseEvent): void {
    // Don't open detail if edit button was clicked
    if ((event.target as HTMLElement).closest('.btn-edit')) {
      return;
    }
    this.selectedIssue = issue;
    this.showDetail = true;
  }

  onEditIssue(issue: Issue, event: Event): void {
    event.stopPropagation();
    // For now, we'll just open the detail view
    this.selectedIssue = issue;
    this.showDetail = true;
  }

  onCreateIssue(): void {
    this.showCreateForm = true;
  }

  onCloseDetail(): void {
    this.showDetail = false;
    this.selectedIssue = null;
  }

  onCloseCreateForm(): void {
    this.showCreateForm = false;
  }

  onIssueCreated(): void {
    this.showCreateForm = false;
    this.loadIssues();
  }

  onIssueUpdated(): void {
    this.showDetail = false;
    this.selectedIssue = null;
    this.loadIssues();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  getStatusBadgeClass(status: IssueStatus): string {
  switch (status) {
    case IssueStatus.OPEN: return 'warning';
    case IssueStatus.IN_PROGRESS: return 'info';
    case IssueStatus.CLOSED: return 'success';
    default: return 'secondary';
  }
}

getPriorityBadgeClass(priority: IssuePriority): string {
  switch (priority) {
    case IssuePriority.LOW: return 'success';
    case IssuePriority.MEDIUM: return 'info';
    case IssuePriority.HIGH: return 'warning';
    case IssuePriority.URGENT: return 'danger';
    default: return 'secondary';
  }
}
}

