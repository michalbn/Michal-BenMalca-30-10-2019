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

  information: any = [];
  temp: any = [];

  ngOnInit() {
    this.temp = this.localStorageService.getAllList();
    console.log(this.temp);
    this.information = [];
    // this.information.push({
    //   DateTime: "2019-11-03T00:00:00+02:00",
    //   EpochDateTime: 1572732000,
    //   WeatherIcon: 33,
    //   IconPhrase: "Clear",
    //   HasPrecipitation: false
    // });

    return new Promise(resolve => {
      for (let i = 0; i < this.temp.length; i++) {
        this.http
          .get(
            "http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/" +
              this.temp[i].key +
              "?apikey=%09xtYjouqFGSNTAJEWVQoZ3zZ0IXAs1rEk"
          )
          .subscribe(data => {
            resolve(data);
            console.log(data);
            this.information.push(data[0]);
          });
      }
      console.log(this.information);
    });
  }

  removeCity(city) {
    console.log(city);
    this.localStorageService.remove(city);
    this.ngOnInit();
  }

  openAtHome(key, location) {
    this.router.navigate(["home/" + key + "/" + location]); //go to home-page
  }
}
