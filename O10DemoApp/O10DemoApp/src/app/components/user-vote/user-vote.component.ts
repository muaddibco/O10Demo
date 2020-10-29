import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Candidate, ElectionCommitteeService } from 'src/app/services/election-committee.service';
import { UsersService } from 'src/app/services/users.service';

class CandidateEntry {
  candidate: Candidate;
  selected: boolean;
}

@Component({
  selector: 'app-user-vote',
  templateUrl: './user-vote.component.html',
  styleUrls: ['./user-vote.component.scss']
})
export class UserVoteComponent implements OnInit {

  private accountId: number;
  private pollId: number;
  public candidates: CandidateEntry[] = [];
  public displayedColumns = ["candidateId", "candidateName", "assetId", "selection"];
  public dataSource: MatTableDataSource<CandidateEntry>;

  constructor(
    private ecService: ElectionCommitteeService,
    private userService: UsersService,
    private router: Router
  ) {
    this.accountId = parseInt(sessionStorage.getItem("accountId"));
    this.pollId = parseInt(sessionStorage.getItem("pollId"));
    this.dataSource = new MatTableDataSource<CandidateEntry>();
  }

  ngOnInit(): void {
    var that = this;
    this.ecService.getPoll(this.pollId).subscribe(p => {
      if (p) {
        for (const candidate of p.candidates) {
          that.candidates.push({
            candidate: candidate,
            selected: false
          })
        }
        that.dataSource.data = that.candidates;
      }
    });
  }

  onSelectionChange(evt: MatSlideToggleChange) {
    if (evt.checked) {
      for (const candidate of this.candidates) {
        const selected = candidate.candidate.candidateId.toString() === evt.source.id.toString();
        candidate.selected = selected;
      }
      this.dataSource.data = this.candidates;
    }
  }

  castVote() {
    const assetIds: string[] = [];
    const selectedAssetId = this.candidates.find(c => c.selected).candidate.assetId;

    for (const entry of this.candidates) {
      assetIds.push(entry.candidate.assetId);
    }

    this.userService.castVote(this.accountId, this.pollId, assetIds, selectedAssetId).subscribe(r => { 
      sessionStorage.removeItem("pollId");
      this.router.navigate(['/user-wallet']);  
    });
  }

  cancel() {
    sessionStorage.removeItem("pollId");
    this.router.navigate(['/user-wallet']);
  }
}
