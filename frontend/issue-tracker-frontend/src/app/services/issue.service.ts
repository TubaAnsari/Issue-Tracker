import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue, IssueCreate, IssueUpdate } from '../models/issue.model';

export interface GetIssuesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  sortBy?: string;
  sortOrder?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  getIssues(params: GetIssuesParams): Observable<Issue[]> {
    let httpParams = new HttpParams();
    
    if (params.page !== undefined && params.pageSize !== undefined) {
      const skip = params.page * params.pageSize;
      httpParams = httpParams.set('skip', skip.toString());
      httpParams = httpParams.set('limit', params.pageSize.toString());
    }
    
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    
    if (params.priority) {
      httpParams = httpParams.set('priority', params.priority);
    }
    
    if (params.assignee) {
      httpParams = httpParams.set('assignee', params.assignee);
    }
    
    if (params.sortBy) {
      httpParams = httpParams.set('sort_by', params.sortBy);
    }
    
    if (params.sortOrder) {
      httpParams = httpParams.set('sort_order', params.sortOrder);
    }

    return this.http.get<Issue[]>(`${this.apiUrl}/issues`, { params: httpParams });
  }

  getIssue(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/issues/${id}`);
  }

  createIssue(issue: IssueCreate): Observable<Issue> {
    return this.http.post<Issue>(`${this.apiUrl}/issues`, issue);
  }

  updateIssue(id: number, issue: IssueUpdate): Observable<Issue> {
    return this.http.put<Issue>(`${this.apiUrl}/issues/${id}`, issue);
  }

  deleteIssue(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/issues/${id}`);
  }
}