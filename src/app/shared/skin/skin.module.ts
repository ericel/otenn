import { NgModule } from '@angular/core';
import {MatToolbarModule, MatRadioModule, MatProgressBarModule, MatExpansionModule, MatDialogModule, MatSelectModule, MatSortModule, MatInputModule, MatFormFieldModule, MatTableModule, MatPaginatorModule,  MatTabsModule, MatChipsModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatSidenavModule, MatListModule, MatGridListModule,MatMenuModule, MatCardModule} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule, MatRadioModule, MatProgressBarModule, MatExpansionModule, MatDialogModule, MatSelectModule, MatSortModule, MatInputModule, MatFormFieldModule, MatTableModule, MatPaginatorModule, MatCheckboxModule, MatChipsModule, MatTabsModule, MatProgressSpinnerModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatGridListModule, MatMenuModule, MatCardModule
  ],
  exports: [  MatChipsModule, MatRadioModule, MatProgressBarModule, MatExpansionModule, MatDialogModule, MatSelectModule, MatSortModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatTableModule, MatButtonModule, MatTabsModule, MatProgressSpinnerModule, MatCheckboxModule, MatIconModule,  MatToolbarModule, MatSidenavModule, MatListModule, MatGridListModule, MatMenuModule, MatCardModule],
  declarations: []
})
export class SkinModule { }
