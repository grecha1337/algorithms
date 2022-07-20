import { Node } from "./node";

interface ILinkedList<T> {
  appendTail: (element: T) => void;
  appendHead: (element: T) => void;
  addByIndex: (element: T, position: number) => void;
  getSize: () => number;
  print: () => void;
}

interface ILinkedList<T> {
  appendTail: (element: T) => void;
  appendHead: (element: T) => void;
  deleteHead: () => void;
  deleteTail: () => void;
  addByIndex: (element: T, position: number) => void;
  deleteByIndex: (position: number) => void;
  getSize: () => number;
  print: () => void;
  toArray: () => T[];
}

export class LinkedList<T> implements ILinkedList<T> {
  private head: Node<T> | null;
  private size: number;
  constructor() {
    this.head = null;
    this.size = 0;
  }

  addByIndex(element: T, index: number) {
    if (index < 0 || index > this.size) {
      console.log("Enter a valid index");
      return;
    } else {
      const node: Node<T> | null = new Node(element);

      // добавить элемент в начало списка
      if (index === 0) {
        if (this.head) {
          node.next = this.head;
        }
        this.head = node;
      } else {
        let curr: Node<T> | null = this.head;
        let currIndex = 0;
        if (!curr) {
          return;
        }
        while (currIndex < index - 1) {
          curr = curr!.next;
          currIndex++;
        }
        node.next = curr!.next;
        curr!.next = node;

        console.log(curr!.value);

        // добавить элемент
        // ваш код ...
      }

      this.size++;
    }
  }

  deleteByIndex(index: number) {
    console.log(this.size)
    if (index < 0 || index >= this.size) {
      console.log("Enter a valid index");
      return;
    } else {
      // удлаяем элемент сначала списка
      if (index === 0) {
        this.deleteHead();
      } else {
        let curr: Node<T> | null = this.head;
        let prev: Node<T> | null = null;
        let currIndex = 0;
        if (!curr) {
          return;
        }
        while (currIndex <= index - 1) {
          prev = curr;
          curr = curr?.next!;
          currIndex++;
        }
        console.log("prev", prev);
        console.log("curr", curr);
  
        if (curr && curr.next === null) {
          prev!.next = null;
        } else {
          prev!.next = curr.next;
        }
       
      }

      this.size--;
    }
  }

  appendTail(element: T) {
    const node = new Node(element);
    let current;

    if (this.head === null) {
      this.head = node;
    } else {
      current = this.head;
      while (current.next) {
        current = current.next;
      }

      current.next = node;
    }
    this.size++;
  }

  appendHead(element: T) {
    const node = new Node(element);
    let current;

    if (this.head === null) {
      this.head = node;
    } else {
      current = this.head;
      this.head = node;
      this.head.next = current;
    }
    this.size++;
  }

  deleteHead() {
    if (!this.head) return;
    if (this.head.next === null) {
      this.head = null;
    } else {
      this.head = this.head.next;
    }
    this.size--;
    console.log(this.head)
  }

  deleteTail() {
    console.log(this.head);
    if (!this.head) return;
    let curr: Node<T> | null = this.head;
    let prev: Node<T> | null = null;
    if (this.head.next === null) {
      this.head = null;
    }

    while (curr) {
      if (curr && curr.next != null) {
        prev = curr;
      }
      curr = curr.next;
    }
    if (prev && prev.next) {
      prev.next = null;
    }
    this.size--;
  }

  getSize() {
    return this.size;
  }

  toArray() {
    let res: T[] = [];
    if (!this.head) {
      return [];
    }
    let curr: Node<T> | null = this.head;
    while (curr) {
      res.push(curr.value);
      curr = curr.next;
    }
    return res;
  }

  print() {
    let curr = this.head;
    let res = "";
    while (curr) {
      res += `${curr.value} `;
      curr = curr.next;
    }
    console.log(res);
  }
}