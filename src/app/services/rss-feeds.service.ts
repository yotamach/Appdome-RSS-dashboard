import { Injectable } from '@angular/core';
import { RSSFeed } from '../../models/rssFeed';
import { map } from "rxjs/operators";
import { ResultsInterface } from 'src/models/results.interface';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RssFeedsService {
  private resultsUpdated = new Subject<ResultsInterface[]>();
  private feedsUpdated = new Subject<RSSFeed[]>();
  private results: ResultsInterface[] = [];
  private feeds: RSSFeed[] = [];
  constructor(private httpClient: HttpClient) {}
  getFeedUpdateListener() {
    return this.feedsUpdated.asObservable();
  }

  getResultsUpdateListener() {
    return this.resultsUpdated.asObservable();
  }

  getResults(feedUrl) {
    this.results.forEach(result => {
      if(result.feed.url === feedUrl)
        return;
    });
    this.httpClient.get<any>(`https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`)
    .pipe(
      map(feedResults => feedResults)
    )
    .subscribe((feedResult: ResultsInterface) => {
      this.results.push(feedResult);
      this.resultsUpdated.next(this.results);
      console.log(this.results);
    });
  }

  removeResult(feedUrl) {
    this.results = this.results.filter(result => result.feed.url !== feedUrl);
    this.resultsUpdated.next(this.results);
  }

  clearResults() {
    this.results = [];
    this.resultsUpdated.next(this.results);
  }

  addFeed(feed: RSSFeed) {
    this.feeds.push(feed);
    this.feedsUpdated.next(this.feeds);
  }

  removeFeed(feed: RSSFeed) {
    this.feeds = this.feeds.filter(item => item !== feed);
    this.feedsUpdated.next(this.feeds);
  }
}
