import { Component, Output, EventEmitter } from '@angular/core';
import { IssueCreate, IssueStatus, IssuePriority } from '../../models/issue.model';
import { IssueService } from '../../services/issue.service';

@Component({
  selector: 'app-issue-form',
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.css']
})
export class IssueFormComponent {
  @Output() issueCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  newIssue: IssueCreate = {
    title: '',
    description: '',
    status: IssueStatus.OPEN,
    priority: IssuePriority.MEDIUM,
    assignee: ''
  };

  statusOptions = Object.values(IssueStatus);
  priorityOptions = Object.values(IssuePriority);

  constructor(private issueService: IssueService) {}

  onSubmit(): void {
    this.issueService.createIssue(this.newIssue).subscribe({
      next: () => {
        this.issueCreated.emit();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating issue:', error);
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.newIssue = {
      title: '',
      description: '',
      status: IssueStatus.OPEN,
      priority: IssuePriority.MEDIUM,
      assignee: ''
    };
  }
}