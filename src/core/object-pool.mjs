export class ObjectPool {
  constructor(createItem, resetItem, initialSize = 0) {
    this.createItem = createItem;
    this.resetItem = resetItem;
    this.available = [];
    this.active = [];

    for (let i = 0; i < initialSize; i += 1) {
      this.available.push(this.createItem());
    }
  }

  acquire(config) {
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
}

