import { ClipService } from './services/clip.service';
import { NotFoundComponent } from './notFound/notFound.component';
import { ClipComponent } from './clip/clip.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'', component:HomeComponent
  },
  {
    path:'about', component:AboutComponent
  },
  {
    path:'clip/:id', component:ClipComponent, resolve: {
      clip: ClipService
    }
  },
  {
    path:'',
    loadChildren: async () => (await import('./video/video.module')).VideoModule

  },
  {
    path:'**', component:NotFoundComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
