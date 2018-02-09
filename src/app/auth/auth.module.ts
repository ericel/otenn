import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from 'app/auth/state/auth.reducer';
import { AuthEffects } from 'app/auth/state/auth.effects';
import { reducers } from '@collections/state';
@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [

  ]

})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootAuthModule,
     // providers: [AuthService, AuthGuard],
    };
  }
 }


@NgModule({
  imports: [
    AuthModule,
    StoreModule.forFeature('auth', reducers),
    EffectsModule.forFeature([AuthEffects]),
  ],
})
export class RootAuthModule {}
