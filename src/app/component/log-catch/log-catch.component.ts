import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule, Router } from "@angular/router";
import { ViewChild } from '@angular/core';
import { PictureService } from '../../services/picture.service';
import { GeolocalisationService } from '../../services/geolocalisation.service';
import { Event } from '../../models/event';
import { EventsService } from '../../services/events.service';
import { Detail } from '../../models/detail';

@Component({
  selector: 'app-log-catch',
  templateUrl: './log-catch.component.html',
  styleUrls: ['./log-catch.component.css']
})
export class LogCatchComponent implements OnInit {
  public event: Event;

  public steps = [{ name: 'Step 1/3 Take a photo' }, { name: 'Step 2/3 Confirm Photo' }, { name: 'Step 3/3 Fish Details' }]
  public idx: Number = 0;
  imageData: any;
  isImageSelected = false;
  fileToUpload: File;
  @ViewChild('fileInput') fileInput;

  constructor(private router: Router, private pictureService: PictureService, private eventService: EventsService, private geoService: GeolocalisationService) { }

  ngOnInit() {
    this.event = new Event();
    this.event.type = "catch";
    this.event.details = new Detail();
    this.event.details.date = (Date.now()).toString();
    this.geoService.location$.subscribe(
      location => {
        this.event.location = location;
      });
  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      this.isImageSelected = true;
      const reader = new FileReader();
      this.fileToUpload = event.target.files[0];

      reader.onload = (event: any) => {
        this.imageData = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
      this.idx = 1;
    }
  }

  swipe(id, type) {
    console.log(type);
    switch (type) {
      case "swiperight":
        this.router.navigate(['']);
        return;
    }
  }

  continue() {
    this.idx = 2;
    this.pictureService.upload(this.fileToUpload).subscribe((response) => {
      console.log(response)
      this.event.details.image = response.path;
    });
  }
  submit() {
    console.log(this.event);
    this.eventService.create(this.event).subscribe(() => {
      this.router.navigate(['']);
    })
  }
}
