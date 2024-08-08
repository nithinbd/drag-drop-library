# Angular Drag and Drop Library

This library provides a simple, lightweight drag and drop functionality for Angular applications. It supports both single-item and multi-item drag and drop operations with visual feedback.

## Installation

To install this package, run the following command in your Angular project:

```bash
npm install @bdnithin/angular-drag-drop
```

# Usage

1. Import the DragDropModule in your app.module.ts or any other module where you want to use the drag and drop functionality:

```typescript
import { NgModule } from '@angular/core';
import { DragDropModule } from '@bdnithin/angular-drag-drop';

@NgModule({
  // ...
  imports: [
    // ...
    DragDropModule
  ],
  // ...
})
export class AppModule { }

```

2. Use the libDragDrop directive in your component template:
```html
<ul libDragDrop (itemMoved)="onItemMoved($event)">
  <li *ngFor="let item of items" class="drag-drop-item">{{ item }}</li>
</ul>

```
3. Handle the itemMoved event in your component:

```typescript
@Component({
  // ...
})
export class YourComponent {
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

  onItemMoved(event: { oldIndex: number, newIndex: number, items: any[] }) {
    console.log('Items moved:', event);
    // Update your data model here
  }
}
```
4. Add styling in your component's CSS:

```css
    .drag-drop-item {
  cursor: move;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  transition: transform 0.1s ease-out;
}

.drag-drop-multiple {
  background-color: #e0e0e0;
  border: 2px solid #007bff;
}

.drag-drop-dragging {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  opacity: 0.8;
}

```
# Features

1. Single-item drag and drop: Click and drag any item to reorder.
2. Multi-item selection and drag: Hold Ctrl (or Cmd on Mac) and click to select multiple items. Then drag any selected item to move all selected items together.
3. Visual feedback: Selected items have a distinct style, and items being dragged have a visual effect applied.

# API
## Directive
libDragDrop: Apply this directive to the container element of your draggable items.

## Inputs

dragDropEnabled: Boolean to enable/disable drag and drop functionality. Default is true.
dragDropClass: CSS class for draggable items. Default is 'drag-drop-item'.
dragDropMultipleClass: CSS class for selected items in multi-select mode. Default is 'drag-drop-multiple'.
dragDropDraggingClass: CSS class applied to items while being dragged. Default is 'drag-drop-dragging'.

## Outputs

itemMoved: Emits an event when items are moved. The event contains:

oldIndex: The original index of the moved item(s).
newIndex: The new index of the moved item(s).
items: An array of the moved items

# Example
```typescript
@Component({
  selector: 'app-root',
  template: `
    <ul libDragDrop 
        [dragDropEnabled]="true"
        [dragDropClass]="'my-drag-item'"
        [dragDropMultipleClass]="'my-selected-item'"
        [dragDropDraggingClass]="'my-dragging-item'"
        (itemMoved)="onItemMoved($event)">
      <li *ngFor="let item of items" class="my-drag-item">{{ item }}</li>
    </ul>
  `,
  styles: [`
    .my-drag-item {
      cursor: move;
      padding: 10px;
      border: 1px solid #ddd;
      margin-bottom: 5px;
    }
    .my-selected-item {
      background-color: #e0e0e0;
      border: 2px solid #007bff;
    }
    .my-dragging-item {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      opacity: 0.8;
    }
  `]
})
export class AppComponent {
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

  onItemMoved(event: { oldIndex: number, newIndex: number, items: any[] }) {
    console.log('Items moved:', event);
    // Reorder your items array here based on the new indices
  }
}
```

# Notes
This library does not depend on any external drag and drop libraries.
It's compatible with Angular 17 and should work with future versions as well.
The library uses only HTML, CSS, and TypeScript for its implementation.

# Support
For any issues or feature requests, please open an issue on the GitHub repository.

# License
This project is licensed under the MIT License.
