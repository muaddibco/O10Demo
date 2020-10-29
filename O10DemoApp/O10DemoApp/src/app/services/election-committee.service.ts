import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MessageService } from './message.service';
import { demoConfig } from "./demo-state.service";

@Injectable({
  providedIn: 'root'
})
export class ElectionCommitteeService {

  private uri: string = demoConfig.baseUri + '/api/ElectionCommittee';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  registerPoll(name: string) {
    return this.http.post<Poll>(this.uri + '/Poll', { name: name })
      .pipe(
        catchError(error => {
          const msg = "Failed to register Poll due to the error: " + error.message;
          this.messageService.error(msg);
          return of(<Poll>null);
        }),
        map(r => r)
      );
  }

  getPolls() {
    return this.http.get<Poll[]>(this.uri + '/Polls')
      .pipe(
        catchError(error => {
          const msg = "Failed to obtain Polls due to the error: " + error.message;
          this.messageService.error(msg);
          return of(<Poll[]>[]);
        }),
        map(r => r)
      );
  }

  getPollsByState(pollState: number) {
    return this.http.get<Poll[]>(this.uri + '/Polls?pollState=' + pollState)
      .pipe(
        catchError(error => {
          const msg = "Failed to obtain Polls due to the error: " + error.message;
          this.messageService.error(msg);
          return of(<Poll[]>[]);
        }),
        map(r => r)
      );
  }

  getPoll(pollId: number) {
    return this.http.get<Poll>(this.uri + '/Poll/' + pollId)
      .pipe(
        catchError(error => {
          const msg = "Failed to obtain the Poll due to the error: " + error.message;
          this.messageService.error(msg);
          return of(<Poll>null);
        }),
        map(r => r)
      );
  }

  addCandidate(pollId: number, name: string) {
    return this.http.post<Candidate>(this.uri + '/Poll/' + pollId + '/Candidate', { name: name })
      .pipe(
        catchError(error => {
          const msg = "Failed to add a new Candidate to the Poll due to the error: " + error.message;
          this.messageService.error(msg);
          return of(<Candidate>null);
        }),
        map(r => r)
      );

  }

  setPollState(pollId: number, pollState: number, sourceAccountId: number) {
    return this.http.put<Poll>(this.uri + '/Poll/' + pollId + '/State', { state: pollState, sourceAccountId: sourceAccountId })
      .pipe(
        catchError(error => {
          const msg = "Failed to set Poll State due to the error: " + error.message;
          this.messageService.error(msg);
          return of(<Poll>null);
        }),
        map(r => r)
      );
  }

  getPollResults(pollId: number) {
    return this.http.get<PollResult[]>(this.uri + '/Poll/' + pollId + '/Votes')
      .pipe(
        catchError(error => {
          const msg = "Failed to obtain Poll Results due to the error: " + error.message;
          this.messageService.error(msg);
          return of(<PollResult[]>[]);
        }),
        map(r => r)
      );
  }
}

export interface Poll {
  pollId: number;
  name: string;
  state: number;
  candidates: Candidate[];
}

export interface Candidate {
  candidateId: number;
  name: string;
  assetId: string;
  isActive: boolean;
}

export interface PollResult {
  candidate: Candidate;
  votes: number;
}