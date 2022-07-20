import { Node } from "./node";

interface IStack<T> {
  push: (item: T) => void;
  pop: () => void;
  peak: () => T | null;
}
export class Stack<T> implements IStack<T> {
  private top: Node<T> | null = null;
  private size: number = 0;

  constructor(node: Node<T>) {
    this.top = node;
  }

  push = (item: T): void => {
    const node = new Node(item);
    let currTop = this.top;
    this.top = node
    this.top.next = currTop;
    this.size++
  };

  pop = (): void => {
    if (this.isEmpty()) {
      throw new Error("stack is empty");
    }
    if (this.top && this.top.next === null) {
      this.top = null
    } else {
      this.top = this.top && this.top.next
    }
    this.size--
  };

  peak = (): T | null => {
    if (this.isEmpty()) { 
      throw new Error("stack is empty");
    }
    return this.top && this.top.value;
  };

  isEmpty = (): boolean => {
    return this.top === null;
  };

  getSize = (): number => {
    return this.size
  }

  getTop = (): Node<T> | null => {
    return this.top
  }

  clear = () => {
    this.top = null;
    this.size = 0;
  }
}