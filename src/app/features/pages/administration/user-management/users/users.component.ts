import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';
import { apiResultFormat, UserMangementUser, pageSelection } from '../../../../../core/models/models';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../../../../core/services/data/data.service';
import { Router, RouterLink } from '@angular/router';
import { PaginationService, tablePageSize } from '../../../../../shared/custom-pagination/pagination.service';
import { MatSortModule, Sort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';
import { DateRangePickerComponent } from '../../../../../shared/date-range-picker/date-range-picker.component';
import { FormsModule } from '@angular/forms';
import { CustomPaginationComponent } from '../../../../../shared/custom-pagination/custom-pagination.component';
import { MatSelectModule } from '@angular/material/select';
@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
    imports: [RouterLink,CommonModule,CollapseHeaderComponent,DateRangePickerComponent,
      FormsModule,MatSortModule,CustomPaginationComponent,MatSelectModule
    ]
})
export class UsersComponent {
  routes = routes
  initChecked = false;
    // pagination variables
    public pageSize = 10;
    public tableData: UserMangementUser[] = [];
    public tableDataCopy: UserMangementUser[] = [];
    public actualData: UserMangementUser[] = [];
    public currentPage = 1;
    public skip = 0;
    public limit: number = this.pageSize;
    public serialNumberArray: number[] = [];
    public totalData = 0;
    showFilter = false;
    public pageSelection: pageSelection[] = [];
    dataSource!: MatTableDataSource<UserMangementUser>;
    public searchDataValue = '';
    password: boolean[] = [false, false,false,false]; // Add more as needed

    togglePassword(index: number): void {
      this.password[index] = !this.password[index];
    }
    constructor(
      private data: DataService,
      private router: Router,
      private pagination: PaginationService
    ) {

      this.data.getUserManagment().subscribe((apiRes: apiResultFormat) => {
        this.actualData = apiRes.data;
        this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
          if (this.router.url == this.routes.users) {
            this.getTableData({ skip: res.skip, limit: res.limit });
            this.pageSize = res.pageSize;
          }
        });
      });
    }
    private getTableData(pageOption: pageSelection): void {
      this.data.getUserManagment().subscribe((apiRes: apiResultFormat) => {
        this.tableData = [];
        this.tableDataCopy = [];
        this.serialNumberArray = [];
        this.totalData = apiRes.totalData;
        apiRes.data.map((res: UserMangementUser, index: number) => {
          const serialNumber = index + 1;
          if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
            res.sNo = serialNumber;
            this.tableData.push(res);
            this.tableDataCopy.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
        this.dataSource = new MatTableDataSource<UserMangementUser>(this.actualData);
        this.pagination.calculatePageSize.next({
          totalData: this.totalData,
          pageSize: this.pageSize,
          tableData: this.tableData,
          tableDataCopy: this.tableDataCopy,
          serialNumberArray: this.serialNumberArray,
        });
      });
    }

    public row=true;
public searchData(value: string): void {
    this.searchDataValue = value.trim().toLowerCase();
    this.dataSource.filter = this.searchDataValue;
    this.tableData = this.dataSource.filteredData;
    this.row = this.tableData.length > 0;
  
    if (this.searchDataValue !== '') {
      // Handle filtered data
      this.pagination.calculatePageSize.next({
        totalData: this.tableData.length,
        pageSize: this.pageSize,
        tableData: this.tableData,
        serialNumberArray: this.tableData.map((_, i) => i + 1), // Generates serials like [1, 2, 3...]
      });
    } else {
      // Handle reset to full data
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.tableData,
        serialNumberArray: this.serialNumberArray,
      });
    }
  }

    public sortData(sort: Sort) {
      const data = this.tableData.slice();

      if (!sort.active || sort.direction === '') {
        this.tableData = data;
      } else {
        this.tableData = data.sort((a, b) => {
          const aValue = (a as never)[sort.active];

          const bValue = (b as never)[sort.active];
          return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
        });
      }
    }
    public changePageSize(pageSize: number): void {
      this.pageSelection = [];
      this.limit = pageSize;
      this.skip = 0;
      this.currentPage = 1;
      this.pagination.tablePageSize.next({
        skip: this.skip,
        limit: this.limit,
        pageSize: this.pageSize,
      });
    }
    selectAll(initChecked: boolean) {
      if (!initChecked) {
        this.tableData.forEach((f) => {
          f.isSelected = true;
        });
      } else {
        this.tableData.forEach((f) => {
          f.isSelected = false;
        });
      }
    }
}
