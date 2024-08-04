import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app/app.component';
import { AppModule } from './app.module';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    AppRoutingModule,
    AppModule, // Đảm bảo rằng chỉ import AppModule một lần
    ServerModule
  ],
  declarations: [],  // Standalone components không khai báo ở đây
  bootstrap: [AppComponent]
})
export class AppServerModule { }
