import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalStorageService } from "../local-storage.service";
import { ActivatedRoute, Params } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-weather-page",
  templateUrl: "./weather-page.component.html",
  styleUrls: ["./weather-page.component.css"]
})
export class WeatherPageComponent implements OnInit {
  public userForm: FormGroup;

  httpOptions = {
    headers: new HttpHeaders().set(
      "accuweather-API-Key",
      "xtYjouqFGSNTAJEWVQoZ3zZ0IXAs1rEk=israel"
    )
  };

  data: any = {}; //Api response
  myKey: string; //location ID
  tempNow: any = {}; //the temperature right now
  location: string; //location name

  constructor(
    public fb: FormBuilder,
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.useForm();
    this.route.params.subscribe((params: Params) => {
      this.myKey = params["key"]; //default location ID
      this.location = params["location"]; //default location name
    });

    return new Promise(resolve => {
      this.http
        .get(
          //5 Days of Daily Forecasts
          "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" +
            this.myKey +
            "?apikey=%09xtYjouqFGSNTAJEWVQoZ3zZ0IXAs1rEk"
        )
        .subscribe(data => {
          resolve(data);
          this.data = data;
          return new Promise(resolve1 => {
            this.http
              .get(
                //1 Hour of Hourly Forecasts
                "http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/" +
                  this.myKey +
                  "?apikey=%09xtYjouqFGSNTAJEWVQoZ3zZ0IXAs1rEk"
              )
              .subscribe(data1 => {
                resolve1(data1);
                this.tempNow = data1;
              });
          });
        });
    });
  }

  useForm() {
    this.userForm = this.fb.group({
      place: ["", [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]]
    });
  }

  get place() {
    return this.userForm.get("place");
  }

  Serch() {
    //serch city
    var path =
      "http://dataservice.accuweather.com/locations/v1/search?apikey=xtYjouqFGSNTAJEWVQoZ3zZ0IXAs1rEk&q=";
    var userPath = path.concat(encodeURI(this.userForm.value.place));
    return new Promise(resolve => {
      this.http.get(userPath).subscribe(
        data => {
          resolve(data);
          if (data == 0) {
            this.toastr.error("This city does not exist!", "Oops!");
            this.ResetForm();
          } else {
            this.location = data[0].LocalizedName;
            this.myKey = data[0].Key;
            var forecasts =
              "http://dataservice.accuweather.com/forecasts/v1/daily/5day/";
            var forecastsCity = forecasts.concat(data[0].Key);
            var fiveDaysForecasts = forecastsCity.concat(
              "?apikey=xtYjouqFGSNTAJEWVQoZ3zZ0IXAs1rEk"
            );
            return new Promise(resolve1 => {
              this.http.get(fiveDaysForecasts).subscribe(data1 => {
                resolve1(data1);
                this.data = data1;
                var forecastsNow =
                  "http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/";
                var forecastsNowCity = forecastsNow.concat(data[0].Key);
                var hourlyForecasts = forecastsNowCity.concat(
                  "?apikey=xtYjouqFGSNTAJEWVQoZ3zZ0IXAs1rEk"
                );
                return new Promise(resolve2 => {
                  this.http.get(hourlyForecasts).subscribe(data2 => {
                    resolve2(data2);
                    this.tempNow = data2;
                  });
                });
              });
            });
          }
        },
        err => {
          console.log(err);
        }
      );
    });
  }

  addToFavorites() {
    var myFavoritesList = this.localStorageService.getAllList();
    for (let i = 0; i < myFavoritesList.length; i++) {
      if (myFavoritesList[i].key === this.myKey) {
        this.toastr.warning(
          myFavoritesList[i].location + " already in favorites.",
          "Alert!"
        );
        this.ResetForm();
        return;
      }
    }

    this.localStorageService.storeOnLocalStorage(this.myKey, this.location);
    this.toastr.success("The city has been added to favorites!", "Success!");
  }

  ResetForm() {
    //Delete relevant field
    this.userForm.reset();
  }
}
