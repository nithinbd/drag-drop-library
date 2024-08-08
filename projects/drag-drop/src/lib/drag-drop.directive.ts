import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[libDragDrop]'
})
export class DragDropDirective {
  @Input() dragDropEnabled = true;
  @Input() dragDropClass = 'drag-drop-item';
  @Input() dragDropMultipleClass = 'drag-drop-multiple';
  @Input() dragDropDraggingClass = 'drag-drop-dragging';
  @Output() itemMoved = new EventEmitter<{ oldIndex: number, newIndex: number, items: any[] }>();

  private draggedElement: HTMLElement | null = null;
  private draggedElements: HTMLElement[] = [];
  private placeholder: HTMLElement | null = null;
  private isDragging = false;
  private startY = 0;
  private list: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.list = this.el.nativeElement;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (!this.dragDropEnabled) return;

    const target = event.target as HTMLElement;
    const item = target.closest(`.${this.dragDropClass}`) as HTMLElement;

    if (!item) return;

    event.preventDefault();

    this.startY = event.clientY;
    this.isDragging = true;

    if (event.ctrlKey || event.metaKey) {
      item.classList.toggle(this.dragDropMultipleClass);
    }

    this.draggedElements = Array.from(this.list.querySelectorAll(`.${this.dragDropMultipleClass}`));

    if (this.draggedElements.length === 0 || !this.draggedElements.includes(item)) {
      this.draggedElements = [item];
    }

    this.draggedElement = item;
    this.placeholder = this.createPlaceholder();
    this.list.insertBefore(this.placeholder, item);

    this.draggedElements.forEach(el => {
      this.renderer.setStyle(el, 'position', 'absolute');
      this.renderer.setStyle(el, 'z-index', '1000');
      this.renderer.setStyle(el, 'width', `${el.offsetWidth}px`);
      this.renderer.addClass(el, this.dragDropDraggingClass);
    });

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private onMouseMove = (event: MouseEvent): void => {
    if (!this.isDragging || !this.draggedElement) return;

    const deltaY = event.clientY - this.startY;

    this.draggedElements.forEach((el, index) => {
      this.renderer.setStyle(el, 'top', `${el.offsetTop + deltaY}px`);
    });

    this.startY = event.clientY;

    const siblings = Array.from(this.list.children).filter(child => 
      !this.draggedElements.includes(child as HTMLElement) && child !== this.placeholder
    );

    let closestSibling: any= null;
    let minDistance = Infinity;

    siblings.forEach(sibling => {
      const rect = sibling.getBoundingClientRect();
      const distance = Math.abs(event.clientY - (rect.top + rect.height / 2));
      if (distance < minDistance) {
        minDistance = distance;
        closestSibling = sibling;
      }
    });

    if (closestSibling) {
      const rect = closestSibling.getBoundingClientRect();
      const insertBefore = event.clientY < rect.top + rect.height / 2;
      if (insertBefore) {
        this.list.insertBefore(this.placeholder!, closestSibling);
      } else {
        this.list.insertBefore(this.placeholder!, closestSibling.nextSibling);
      }
    }
  };

  private onMouseUp = (): void => {
    if (!this.isDragging || !this.draggedElement || !this.placeholder) return;

    const oldIndex = Array.from(this.list.children).indexOf(this.draggedElement);
    const newIndex = Array.from(this.list.children).indexOf(this.placeholder);

    this.draggedElements.forEach(el => {
      this.renderer.removeStyle(el, 'position');
      this.renderer.removeStyle(el, 'z-index');
      this.renderer.removeStyle(el, 'top');
      this.renderer.removeStyle(el, 'width');
      el.classList.remove(this.dragDropMultipleClass);
      this.renderer.removeClass(el, this.dragDropDraggingClass);
    });

    this.list.insertBefore(this.draggedElement, this.placeholder);
    this.list.removeChild(this.placeholder);

    this.itemMoved.emit({
      oldIndex,
      newIndex,
      items: this.draggedElements.map(el => el.textContent)
    });

    this.isDragging = false;
    this.draggedElement = null;
    this.draggedElements = [];
    this.placeholder = null;

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  private createPlaceholder(): HTMLElement {
    const placeholder = this.renderer.createElement('div');
    this.renderer.setStyle(placeholder, 'height', `${this.draggedElement!.offsetHeight * this.draggedElements.length}px`);
    this.renderer.setStyle(placeholder, 'background-color', '#f0f0f0');
    this.renderer.setStyle(placeholder, 'border', '2px dashed #ccc');
    return placeholder;
  }
}