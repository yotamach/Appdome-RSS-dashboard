import { Component, OnInit } from '@angular/core';
import { RSSFeed } from '../../../models/rssFeed';
import { Subscription } from 'rxjs';
import { RssFeedsService } from 'src/app/services/rss-feeds.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'ap-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public newFeed = new RSSFeed();
  public feedsSub: Subscription;
  public feeds: RSSFeed[] = [];
  public errorMessage: String = '';
  public selectedFeeds: RSSFeed[] = [];

  constructor(private rssFeedsService: RssFeedsService) { }
  
  ngOnInit() {
    this.feedsSub = this.rssFeedsService.getFeedUpdateListener()
    .subscribe(updatedFeeds => {
      this.feeds = updatedFeeds;
    });
  }

  removeFeed(feed: RSSFeed) {
    this.rssFeedsService.removeFeed(feed);
    if(this.checkIfFeedExist(this.selectedFeeds,feed)) {
      this.selectedFeeds = this.selectedFeeds.filter(feedItem => feedItem !== feed);
    }
    this.rssFeedsService.removeResult(feed.url);
  }

  submit(f: NgForm) {
    this.errorMessage = '';
    if(this.checkIfFeedExist(this.feeds,f.value)) {
      this.errorMessage = 'This item is already exist in feeds list';
      f.reset();
      return;
    }
    if(f.invalid) {
      this.errorMessage = 'One or more fields is empty or url is incorrect';
      f.reset();
      return;
    }
    this.rssFeedsService.addFeed(f.value);
    f.reset();
  }

  checkIfFeedExist(feeds: RSSFeed[], feed: RSSFeed) {
    return feeds.some(el => (el.name === feed.name) && (el.url === feed.url));
  }

  onSelectFeed(feed: RSSFeed) {
    if(this.checkIfFeedExist(this.selectedFeeds,feed)) {
      this.selectedFeeds = this.selectedFeeds.filter(feedItem => feedItem !== feed);
    }
    else {
      this.selectedFeeds.push(feed);
    }
    this.rssFeedsService.clearResults();
    this.selectedFeeds.forEach(selectedFeed => this.rssFeedsService.getResults(selectedFeed.url));
  }
}
