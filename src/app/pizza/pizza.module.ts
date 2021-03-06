import { NgModule } from '@angular/core';
import { PizzaOrderComponent } from './pizza-order/pizza-order.component'
import { EffectsModule } from '@ngrx/effects';



import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { pizzaReducer } from './pizza.reducer';
import { PizzaEffects  } from './pizza.effects'
import { SkinModule } from '@shared/skin/skin.module';

@NgModule({
  imports: [
    CommonModule,
    SkinModule,
    StoreModule.forFeature('pizza', pizzaReducer),
    EffectsModule.forFeature([PizzaEffects])
  ],
  exports: [PizzaOrderComponent],
  declarations: [PizzaOrderComponent]
})
export class PizzaModule { }
