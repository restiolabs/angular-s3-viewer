import { Component } from '@angular/core';
import { FileService } from './file.service';
import * as moment from 'moment';
import isEqual from 'lodash-es/isEqual';
import orderBy from 'lodash-es/orderBy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  listView:boolean = false;
  displayFileActions:boolean = false;
  switchingView:boolean = false;
  displayPath:any = [];
  fileList:any = [];
  displayList:any = [];
  bucket:string;

  constructor(private fileService: FileService) {}

  ngOnInit() {
    // get files from server and initialise display to root path
    this.loadFiles()
    .then(() => this.setDisplay([]));
  }

  loadFiles() {
    function fileSizeFormatter(input) {
      if(input) {
        let sizeInMB = input / 1024 / 1024;
        if(sizeInMB.toFixed(2) === '0.00') return '0.01 MB';
        return `${sizeInMB.toFixed(2)} MB`
      }
    }

    return this.fileService.getFiles().toPromise()
    .then(res => {
      this.fileList = res['files'];
      this.bucket = res['bucket'];
      
      this.fileList.forEach(file => {
        if(!file.isFolder) file.formattedSize = fileSizeFormatter(file.Size);
        file.formattedDate = moment(file.LastModified).format('YYYY-MM-DD HH:mm');
      })
    })
    .catch(console.log);
  }

  setDisplay(path) {
    let newDepth = path.length;
    this.displayList = this.fileList.filter(file => file.Path.length === newDepth && isEqual(file.Path.slice(0, newDepth), path));
    this.displayList = orderBy(this.displayList, ['isFolder', 'Name'], ['desc', 'asc']);
    this.displayPath = [this.bucket, ...path];
  }

  resetSelected() {
    this.displayList.forEach(item => {item.selected = false})
    this.displayFileActions = false;
  }

  fileClicked(file) {
    this.resetSelected()
    file.selected = true;
    if(!file.isFolder) this.displayFileActions = true;
  }

  fileDoubleClicked(file) {
    if(file.isFolder) {
      this.resetSelected();
      let path = [...file.Path, file.Name];
      this.setDisplay(path);
    }
  }

  displayPathClicked(index) {
    this.resetSelected();
    let path = this.displayPath.slice(1,index+1);
    this.setDisplay(path);
  }

}
