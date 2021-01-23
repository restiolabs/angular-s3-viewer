import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  getFiles() {
    const url = 'http://localhost:3000/file';
    return this.http.get(url, { headers: new HttpHeaders({'Accept': 'application/json', 'Content-Type': 'application/json'}) });
  }
}
