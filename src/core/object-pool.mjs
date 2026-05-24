export class ObjectPool {
  constructor(createItem, resetItem, initialSize = 0, maxSize = initialSize || Infinity) {
    this.createItem = createItem;
    this.resetItem = resetItem;
    this.maxSize = maxSize;
    this.available = [];
    this.active = [];

    for (let i = 0; i < initialSize; i += 1) {
      this.available.push(this.createItem());
    }
  }

  acquire(config) {
    // Returning null keeps high-frequency effects bounded instead of growing arrays during busy combat.
    if (this.active.length >= this.maxSize && this.available.length === 0) return null;
    const item = this.available.pop() || this.createItem();
    this.resetItem(item, config);
    this.active.push(item);
    return item;
  }

  release(item) {
    const index = this.active.indexOf(item);
    if (index >= 0) this.active.splice(index, 1);
    this.available.push(item);
  }

  releaseWhere(shouldRelease) {
    for (let i = this.active.length - 1; i >= 0; i -= 1) {
      const item = this.active[i];
      if (!shouldRelease(item)) continue;
      this.active.splice(i, 1);
      this.available.push(item);
    }
  }

  clear() {
    while (this.active.length > 0) {
      this.available.push(this.active.pop());
    }
  }

  reset() {
    this.active.length = 0;
    this.available.length = 0;
  }

  syncFrom(activeItems) {
    this.reset();
    this.active = activeItems;
  }
}
