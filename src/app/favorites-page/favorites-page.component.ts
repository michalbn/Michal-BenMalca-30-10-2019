import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "../local-storage.service";
import { templateJitUrl } from "@angular/compiler";
import { HttpClient } from "@angular/common/http";
import { temporaryAllocator } from "@angular/compiler/src/render3/view/util";
import { Router } from "@angular/router";

@Component({
  selector: "app-favorites-page",
  templateUrl: "./favorites-page.component.html",
  styleUrls: ["./favorites-page.component.css"]
})
export class FavoritesPageComponent implements OnInit {
  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient,
    private router: Router
  ) {}

  information: any = []; //Api response
  myFavoritesList: any = []; //my favorites list from local storage

  ngOnInit() {
    this.myFavoritesList = this.localStorageService.getAllList();
    this.information = [];

    return new Promise(resolve => {
      for (let i = 0; i < this.myFavoritesList.length; i++) {
        this.http
          .get(
            //1 Hour of Hourly Forecasts
            "http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/" +
              this.myFavoritesList[i].key +
              "?apikey=%09xtYjouqFGSNTAJEWVQoZ3zZ0IXAs1rEk"
          )
          .subscribe(data => {
            resolve(data);
            this.information.push(data[0]);
          });
      }
    });
  }

  removeCity(city) {
    this.localStorageService.remove(city);
    this.ngOnInit();
  }

  openAtHome(key, location) {
    this.router.navigate(["home/" + key + "/" + location]); //go to home-page
  }
}
