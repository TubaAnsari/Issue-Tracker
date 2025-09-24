import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Issue, IssueUpdate, IssueStatus, IssuePriority } from '../../models/issue.model';
import { IssueService } from '../../services/issue.service';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css']
})
export class IssueDetailComponent implements OnInit, OnDestroy {
  @Input() issueId?: number;
  @Input() issue?: Issue;
  @Output() issueUpdated = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  
  isEditing = false;
  editForm: IssueUpdate = {};
  loading = true;
  error: string | null = null;

  statusOptions = Object.values(IssueStatus);
  priorityOptions = Object.values(IssuePriority);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private issueService: IssueService,
    private location: Location
  ) {}

  ngOnInit(): void {
    if (this.issue) {
      this.loading = false;
      return;
    }
    
    this.loadIssue();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  loadIssue(): void {
    let id: number;
    
    if (this.issueId) {
      id = this.issueId;
    } else {
      id = Number(this.route.snapshot.paramMap.get('id'));
    }
    
    if (isNaN(id)) {
      this.error = 'Invalid issue ID';
      this.loading = false;
      return;
    }

    this.issueService.getIssue(id).subscribe({
      next: (issue) => {
        this.issue = issue;
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Issue not found';
        this.loading = false;
        console.error('Error loading issue:', error);
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  // Status badge styling
  getStatusBadgeClass(status: IssueStatus): string {
    switch (status) {
      case IssueStatus.OPEN: return 'bg-warning';
      case IssueStatus.IN_PROGRESS: return 'bg-info';
      case IssueStatus.CLOSED: return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  // Priority badge styling
  getPriorityBadgeClass(priority: IssuePriority): string {
    switch (priority) {
      case IssuePriority.LOW: return 'bg-success';
      case IssuePriority.MEDIUM: return 'bg-info';
      case IssuePriority.HIGH: return 'bg-warning';
      case IssuePriority.URGENT: return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  // Status icons
  getStatusIcon(status: IssueStatus): string {
    switch (status) {
      case IssueStatus.OPEN: return 'bi-circle';
      case IssueStatus.IN_PROGRESS: return 'bi-arrow-clockwise';
      case IssueStatus.CLOSED: return 'bi-check-circle';
      default: return 'bi-circle';
    }
  }

  // Priority icons
  getPriorityIcon(priority: IssuePriority): string {
    switch (priority) {
      case IssuePriority.LOW: return 'bi-arrow-down';
      case IssuePriority.MEDIUM: return 'bi-dash';
      case IssuePriority.HIGH: return 'bi-arrow-up';
      case IssuePriority.URGENT: return 'bi-exclamation-triangle';
      default: return 'bi-dash';
    }
  }

  // Copy JSON to clipboard
  copyJson(): void {
    const jsonString = JSON.stringify(this.issue, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      console.log('JSON copied to clipboard');
    });
  }

  // Start editing
  startEdit(): void {
    this.isEditing = true;
    this.editForm = {
      title: this.issue?.title || '',
      description: this.issue?.description,
      status: this.issue?.status || IssueStatus.OPEN,
      priority: this.issue?.priority || IssuePriority.MEDIUM,
      assignee: this.issue?.assignee
    };
  }

  // Cancel editing
  cancelEdit(): void {
    this.isEditing = false;
    this.editForm = {};
  }

  // Save edits
  saveEdit(): void {
    if (!this.issue) return;
    
    this.issueService.updateIssue(this.issue.id, this.editForm).subscribe({
      next: (updatedIssue) => {
        this.issue = updatedIssue;
        this.isEditing = false;
        this.editForm = {};
        this.issueUpdated.emit();
      },
      error: (error) => {
        console.error('Error updating issue:', error);
        this.error = 'Failed to update issue';
      }
    });
  }

  // Reload issue data
  reloadIssue(): void {
    this.loading = true;
    this.error = null;
    this.loadIssue();
  }
}