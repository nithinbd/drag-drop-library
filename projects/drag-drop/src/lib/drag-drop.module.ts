import { NgModule } from '@angular/core';
import { DragDropDirective } from './drag-drop.directive';

@NgModule({
  declarations: [DragDropDirective],
  exports: [DragDropDirective]
})
export class DragDropModule { }