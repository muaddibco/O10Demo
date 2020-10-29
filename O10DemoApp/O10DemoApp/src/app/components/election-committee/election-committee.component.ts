import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ElectionCommitteeService, Poll } from 'src/app/services/election-committee.service';
import { InputDialogComponent } from '../dialogs/input-dialog/input-dialog.component';

@Component({
  selector: 'app-election-committee',
  templateUrl: './election-committee.component.html',
  styleUrls: ['./election-committee.component.scss']
})
export class ElectionCommitteeComponent implements OnInit {

  public polls: Poll[] = [];
  public displayedColumns = ["pollId", "name", "state"];

  constructor(
    private ecService: ElectionCommitteeService,
    private dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ecService.getPolls().subscribe(p => {
      this.polls = p;
      this.changeDetectorRefs.detectChanges();
    });
  }

  onOpenPoll(pollId: number) {
    sessionStorage.setItem("pollId", pollId.toString());
    this.router.navigate(['/poll']);
  }

  onAddPoll() {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: '250px', 
      data: {
        title: "New Poll",
        invitation: "Please provide a name for the new Poll",
        placeholder: "Poll name"
      }
    });

    const that = this;
    dialogRef.afterClosed().subscribe(r => {
      if(r) {
        this.ecService.registerPoll(r).subscribe(p => {
          if(p) {
            that.polls.push(p);
          }
        })
      }
    });
  }
}
