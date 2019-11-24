import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WeatherPageComponent } from "./weather-page/weather-page.component";
import { FavoritesPageComponent } from "./favorites-page/favorites-page.component";

const appRoutes: Routes = [
  {
    path: "home/:key/:location",
    component: WeatherPageComponent
  },
  {
    path: "",
    redirectTo: "home/215854/Tel Aviv",
    pathMatch: "full"
  },
  { path: "favorites-page", component: FavoritesPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
