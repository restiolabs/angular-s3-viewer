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
    this.loadFiles();
  }

  loadFiles() {
    this.fileService.getFiles().toPromise()
    .then(res => {
      this.fileList = res['files'];
      this.bucket = res['bucket'];
      
      this.fileList.forEach(file => {
        if(!file.isFolder) file.formattedSize = this.fileSizeFormatter(file.Size);
        file.formattedDate = moment(file.LastModified).format('YYYY-MM-DD HH:mm');
      })

      this.displayList = this.fileList.filter(file => file.Path.length === 0)
      this.displayPath = [this.bucket];
    })
    .catch(console.log);
  }

  fileSizeFormatter(input) {
    if(input) {
      let sizeInMB = input / 1024 / 1024;
      if(sizeInMB.toFixed(2) === '0.00') return '0.01 MB';
      return `${sizeInMB.toFixed(2)} MB`
    }
  }

  resetSelected() {
    this.displayList.forEach(item => {
      item.selected = false;
    })
    this.displayFileActions = false;
  }

  selectFile(file) {
    this.resetSelected()
    file.selected = true;
    if(!file.isFolder) this.displayFileActions = true;
  }

  openFile(file) {
    if(file.isFolder) {
      this.resetSelected();
      let path = [...file.Path, file.Name];
      this.displayList = this.fileList.filter(file => file.Path.length === path.length && isEqual(file.Path.slice(0,path.length), path));
      this.displayList = orderBy(this.displayList, ['isFolder', 'Name'], ['desc', 'asc']);
      this.displayPath = [this.bucket, ...path];
    }
  }

  setDisplayPath(index) {
    this.resetSelected();
    let path = this.displayPath.slice(1,index+1);
    this.displayList = this.fileList.filter(file => file.Path.length === path.length && isEqual(file.Path.slice(0,path.length), path));
    this.displayList = orderBy(this.displayList, ['isFolder', 'Name'], ['desc', 'asc']);
    this.displayPath = [this.bucket, ...path];
  }

}
