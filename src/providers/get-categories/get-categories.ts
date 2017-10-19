import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


@Injectable()
export class GetCategoriesProvider {

  constructor() {
    //console.log('Hello GetCategoriesProvider Provider');
  }

  loadCategories() {
    // https://hackforums.net/api/v1/category
    var jsonObj = JSON.parse('{"success":true,"message":"","result":{"name":null,"description":"","type":"","parent":0,"ficon":"","children":[{"fid":1,"name":"Hack Forums Official Information","description":"","type":"c","ficon":"shim.gif"},{"fid":45,"name":"Hacks, Exploits, and Various Discussions","description":"","type":"c","ficon":"shim.gif"},{"fid":7,"name":"Hack Forums Open Discussion","description":"","type":"c","ficon":"shim.gif"},{"fid":88,"name":"Computing","description":"","type":"c","ficon":"shim.gif"},{"fid":151,"name":"Programming, Coding, and Languages","description":"","type":"c","ficon":"shim.gif"},{"fid":156,"name":"Graphics","description":"","type":"c","ficon":"shim.gif"},{"fid":105,"name":"Marketplace","description":"","type":"c","ficon":"shim.gif"},{"fid":241,"name":"Making Money","description":"","type":"c","ficon":"shim.gif"},{"fid":141,"name":"Webmasters","description":"","type":"c","ficon":"shim.gif"},{"fid":80,"name":"HF Gamers Zone","description":"","type":"c","ficon":"shim.gif"},{"fid":53,"name":"Crews and Clans Private Forums","description":"","type":"c","ficon":"crew_area.png"}]}}');
    if (jsonObj.success){
      return jsonObj.result.children;
    } else{
      console.log("get-categories failed to get data.");
    }
  }

}