import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from './state/auth.reducer';
import { AuthEffects } from './state/auth.effects';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature('user', authReducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  declarations: [

  ]
})
export class AuthModule { }
