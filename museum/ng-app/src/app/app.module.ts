import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './containers/app/app.component';
import { PeKitService } from './services/pekit/pekit.service';
import { FileInputComponent } from './components/fileinput/fileinput.component';
import { PekitIndexComponent } from './components/pekit-index/pekit-index.component';
import { PekitOutputComponent } from './components/pekit-output/pekit-output.component';
import { PekitHeadersComponent } from './components/pekit-headers/pekit-headers.component';
import { PekitImportsComponent } from './components/pekit-imports/pekit-imports.component';
import { PekitRoutingModule } from './routes/pekit-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule } from '@angular/material';

@NgModule({
	declarations: [
		AppComponent,
		FileInputComponent,
		PekitHeadersComponent,
		PekitOutputComponent,
		PekitImportsComponent,
		PekitIndexComponent,
	],
	imports: [
		PekitRoutingModule,
		BrowserModule,
		FormsModule,
		CommonModule,
		BrowserAnimationsModule,
		LayoutModule,
		MatToolbarModule,
		MatButtonModule,
		MatSidenavModule,
		MatIconModule,
		MatListModule,
		MatCardModule,
	],
	providers: [
		PeKitService
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {}
