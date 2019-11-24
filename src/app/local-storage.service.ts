import { Injectable, Inject } from "@angular/core";
import { LOCAL_STORAGE, StorageService } from "ngx-webstorage-service";

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {
  //anotherTodolist = [];

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {}

  public storeOnLocalStorage(key: string, location: string): void {
    // get array of tasks from local storage
    const currentTodoList = this.storage.get(key) || [];
    // push new task to array
    currentTodoList.push({
      location: location
    });
    // insert updated array to local storage
    this.storage.set(key, currentTodoList);
    console.log(this.storage.get(key) || "LocaL storage is empty");
  }

  remove(STORAGE_KEY) {
    this.storage.remove(STORAGE_KEY);
  }

  getAllList() {
    var temp = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = JSON.parse(localStorage.getItem(key)).pop();
      temp[i] = { key: key, location: value.location };
    }
    return temp;
  }
}
