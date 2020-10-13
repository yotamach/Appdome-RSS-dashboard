import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormControl
} from '@angular/forms';
import {
  RssFeedsService
} from 'src/app/services/rss-feeds.service';
import {
  Subscription
} from 'rxjs';

@Component({
  selector: 'ap-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public results: any;
  public filteredResults: any;
  public searchControl = new FormControl();
  public resultsSub: Subscription;
  constructor(private rssFeedsService: RssFeedsService) {}

    ngOnInit() {
      this.resultsSub = this.rssFeedsService.getResultsUpdateListener()
      .subscribe(updateResults => {
          this.results = updateResults.map(feed => feed.items);
          this.results = this.results.flat().sort((a: any, b: any) => {
            const before: Date = new Date(a.pubDate);
            const after: Date = new Date(b.pubDate);
            return before < after ? 1 : -1;
          });
          this.filteredResults = this.results;
        });
    }

    searchResults(searchControl: FormControl) {
      if(searchControl.value) {
        this.filteredResults = this.results.filter(feedItem => feedItem.content.includes(searchControl.value));
      } else {
        this.filteredResults = this.results;
      }
    }
  }
