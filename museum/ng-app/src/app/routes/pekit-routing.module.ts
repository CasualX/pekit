import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PekitHeadersComponent } from '../components/pekit-headers/pekit-headers.component';
import { PekitImportsComponent } from '../components/pekit-imports/pekit-imports.component';
import { PekitOutputComponent } from '../components/pekit-output/pekit-output.component';
import { PekitIndexComponent } from '../components/pekit-index/pekit-index.component';

const routes: Routes = [
	{ path: '', component: PekitIndexComponent },
	{ path: 'output', component: PekitOutputComponent },
	{ path: 'headers', component: PekitHeadersComponent },
	{ path: 'imports', component: PekitImportsComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class PekitRoutingModule {}
