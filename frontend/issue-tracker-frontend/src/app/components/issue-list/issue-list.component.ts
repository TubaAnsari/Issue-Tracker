import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Issue, IssueStatus, IssuePriority } from '../../models/issue.model';
import { IssueService, GetIssuesParams } from '../../services/issue.service';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit {
  issues: Issue[] = [];
  showCreateForm = false;
  
  // Filter and pagination properties
  selectedIssue: Issue | null = null;
  showDetail = false;
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  searchTerm = '';
  statusFilter = '';
  priorityFilter = '';
  assigneeFilter = '';
  sortBy = 'updated_at';
  sortOrder = 'desc';
  uniqueAssignees: string[] = [];

  // Available options for filters
  statusOptions = Object.values(IssueStatus);
  priorityOptions = Object.values(IssuePriority);

  constructor(
    private issueService: IssueService,
  ) {}

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
        this.totalItems = issues.length;
        this.extractUniqueAssignees(issues);
      },
      error: (error) => {
        console.error('Error loading issues:', error);
      }
    });
  }

  extractUniqueAssignees(issues: Issue[]): void {
    const assignees = new Set<string>();
    issues.forEach(issue => {
      if (issue.assignee) {
        assignees.add(issue.assignee);
      }
    });
    this.uniqueAssignees = Array.from(assignees).sort();
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

  getSortIcon(field: string): string {
    if (this.sortBy !== field) {
      return 'bi-arrow-down-up';
    }
    return this.sortOrder === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadIssues();
  }

    onIssueClick(issue: Issue, event: MouseEvent): void {
  if ((event.target as HTMLElement).closest('.btn-edit')) {
    return;
  }
  console.log('Selected issue:', issue); // Debug log
  this.selectedIssue = { ...issue };
  this.showDetail = true;
}

 onEditIssue(issue: Issue, event: Event): void {
    event.stopPropagation();
    this.selectedIssue = { ...issue }; // Create a copy to avoid reference issues
    this.showDetail = true;
  }

  onCreateIssue(): void {
    this.showCreateForm = true;
  }

  onCloseCreateForm(): void {
    this.showCreateForm = false;
  }

  onIssueCreated(): void {
    this.showCreateForm = false;
    this.loadIssues();
  }

   onCloseDetail(): void {
  this.showDetail = false;
  // Small delay to ensure smooth transition
  setTimeout(() => {
    this.selectedIssue = null;
  }, 300);
}

onIssueUpdated(): void {
  this.loadIssues(); // Reload the list to reflect changes
  // Don't close the detail view automatically - let user decide
}


  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.priorityFilter = '';
    this.assigneeFilter = '';
    this.currentPage = 0;
    this.loadIssues();
  }

  hasActiveFilters(): boolean {
    return !!this.searchTerm || !!this.statusFilter || !!this.priorityFilter || !!this.assigneeFilter;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  getVisiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    
    let range = [];
    for (let i = Math.max(0, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    
    return range;
  }

  getStatusBadgeClass(status: IssueStatus): string {
    switch (status) {
      case IssueStatus.OPEN: return 'bg-warning';
      case IssueStatus.IN_PROGRESS: return 'bg-info';
      case IssueStatus.CLOSED: return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getPriorityBadgeClass(priority: IssuePriority): string {
    switch (priority) {
      case IssuePriority.LOW: return 'bg-success';
      case IssuePriority.MEDIUM: return 'bg-info';
      case IssuePriority.HIGH: return 'bg-warning';
      case IssuePriority.URGENT: return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}