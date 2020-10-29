import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { demoConfig, DemoIdpAccount } from 'src/app/services/demo-state.service';
import { Candidate, ElectionCommitteeService, Poll, PollResult } from 'src/app/services/election-committee.service';
import { InputDialogComponent } from '../dialogs/input-dialog/input-dialog.component';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {

  public pollId: number;
  public poll: Poll;
  public displayedColumns = ["candidateId", "name", "assetId"]
  public displayedColumnsResults = ["candidateId", "name", "votes"]
  public pollState: string;
  public oldPollState: string;
  public candidatesDataSource: MatTableDataSource<Candidate>;
  public pollResultsDataSource: MatTableDataSource<PollResult>;
  public idpAccounts = demoConfig.idpAccounts;
  public selectedIdP: string;
  public updating = false;

  constructor(
    private ecService: ElectionCommitteeService,
    private dialog: MatDialog
  ) {
    this.pollId = parseInt(sessionStorage.getItem("pollId"));
    this.candidatesDataSource = new MatTableDataSource<Candidate>();
    this.pollResultsDataSource = new MatTableDataSource<PollResult>();
  }

  ngOnInit(): void {
    this.ecService.getPoll(this.pollId).subscribe(r => {
      this.poll = r;
      this.pollState = r.state.toString();
      this.oldPollState = r.state.toString();
      this.candidatesDataSource.data = this.poll.candidates;
    });

    this.ecService.getPollResults(this.pollId).subscribe(r => {
      this.pollResultsDataSource.data = r;
    });
  }

  onAddCandiate() {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: '250px',
      data: {
        title: "New Candidate",
        invitation: "Please provide a name for the new Candidate",
        placeholder: "Candidate name"
      }
    });

    const that = this;
    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        that.ecService.addCandidate(this.pollId, r).subscribe(p => {
          that.ecService.getPoll(this.pollId).subscribe(r => {
            that.poll = r;
            this.candidatesDataSource.data = this.poll.candidates;
            that.pollState = r.state.toString();
            this.oldPollState = r.state.toString();
          });
        })
      }
    });
  }

  onPollStateChanged(evt: MatSelectChange) {
    this.selectedIdP = null;
  }

  onUpdateState() {
    this.updating = true;
    var sourceAccountId: number = 0;

    this.oldPollState = this.pollState;

    if(this.selectedIdP) {
      sourceAccountId = parseInt(this.selectedIdP)
    }
    this.ecService.setPollState(this.pollId, parseInt(this.pollState), sourceAccountId).subscribe(r => {
      this.poll = r;
      this.updating = false;
    });
  }
}
