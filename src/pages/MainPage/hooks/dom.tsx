import { insertPageContent } from "$src/stores/modules/pageSlice";
import React from "react";
import { useDispatch } from "react-redux";

export const handleDragStartElement = (e: DragEvent) => {
  const currentTarget = e.target as HTMLElement;
  console.log("currentTarget", currentTarget);
  currentTarget.setAttribute("id", 'clicked');
}

export const handleDragOverElement = (e: DragEvent | React.DragEvent<HTMLElement>) => {
  const target = e.target as HTMLElement;
  const firstChild = target.querySelector('input') as HTMLInputElement;
  console.log(target.tagName);
  if (target && target.tagName === 'DIV' && !firstChild.placeholder) {
    e.preventDefault();
    target.style.borderBottom = '2px solid #0000005f';
  }
}

export const handleDragLeaveElement = (e: DragEvent | React.DragEvent<HTMLElement>) => {
  const target = e.target as HTMLElement;
  target.style.borderBottom = 'none';
}

export const handleDragEndElement = (e: DragEvent | React.DragEvent<HTMLElement>) => {
  const target = e.target as HTMLElement;
  target.style.borderBottom = 'none';
}

export const handleDropElement = (e: DragEvent | React.DragEvent<HTMLElement>, handleInputKeyUp: (e: KeyboardEvent | React.KeyboardEvent<HTMLElement>) => void,
  currentPageId: number, saveInputAllContent: Function) => {
  const target = e.target as HTMLElement;
  const firstChild = target.querySelector('input') as HTMLInputElement;
  const wrapper = document.getElementById('wrapper');
  if (target && target.tagName === 'DIV' && !firstChild.placeholder) {
    e.preventDefault();
    target.style.borderBottom = '2px solid #0000005f';
  }
  const dragDiv = document.getElementById('clicked');
  const dragCloneDiv = dragDiv?.cloneNode(true) as HTMLElement;
  const targetCloneDiv = target?.cloneNode(true) as HTMLElement;
  if (wrapper) {
    addDragEventListener(dragCloneDiv, handleInputKeyUp, wrapper, currentPageId, saveInputAllContent)
    addDragEventListener(targetCloneDiv, handleInputKeyUp, wrapper, currentPageId, saveInputAllContent)
  }
  if (dragCloneDiv && dragDiv) {
    dragCloneDiv.querySelector('input')?.addEventListener('keyup', handleInputKeyUp);
    targetCloneDiv.querySelector('input')?.addEventListener('keyup', handleInputKeyUp);
    dragDiv.replaceWith(targetCloneDiv);
    target.replaceWith(dragCloneDiv);
    targetCloneDiv.style.borderBottom = 'none';
    dragCloneDiv.removeAttribute('id');
  }
}

export const addDragEventListener = (divEl: HTMLElement, handleInputKeyUp: (e: KeyboardEvent | React.KeyboardEvent<HTMLElement>) => void, 
    wrapper: HTMLElement, currentPageId: number, saveInputAllContent: Function) => {
  divEl.className = 'new-div'
  divEl.style.display = 'flex';
  divEl.style.zIndex = '200';
  divEl.addEventListener('dragstart', handleDragStartElement);
  divEl.addEventListener('dragover', handleDragOverElement);
  divEl.addEventListener('dragend', handleDragEndElement);
  divEl.addEventListener('dragleave', handleDragLeaveElement);
  divEl.addEventListener('drop', (e: DragEvent) => {
    handleDropElement(e, handleInputKeyUp, currentPageId, saveInputAllContent);
    if (wrapper && currentPageId) {
      saveInputAllContent(wrapper, currentPageId);
    }
    console.log("실행중");
  });
}

const useDom = () => {
  const dispatch = useDispatch();
  const createInputEl = (handleInputKeyUp: (e: KeyboardEvent | React.KeyboardEvent<HTMLElement>) => void, wrapper?: HTMLDivElement, currentPageId?: number, text?: string) => {
    const divEl = document.createElement('div');

    if (wrapper && currentPageId) {
      addDragEventListener(divEl, handleInputKeyUp, wrapper, currentPageId, saveInputAllContent)
    }
    const imageEl = document.createElement('img');
    imageEl.src = '../../images/move_bar.svg';
    imageEl.style.width = '20px';
    imageEl.style.height = '20px';
    imageEl.style.zIndex = '100';
    imageEl.draggable = false;
    divEl.appendChild(imageEl);
    divEl.style.display = 'flex';
    divEl.style.zIndex = '50';
    divEl.draggable = true;
    const inputEl = document.createElement('input');
    inputEl.addEventListener('keyup', handleInputKeyUp);
    inputEl.style.display = 'block';
    inputEl.style.height = '30px';
    inputEl.style.width = '93%';
    inputEl.style.margin = '0 auto';
    inputEl.style.border = 'none';
    inputEl.style.fontSize = '15px';
    inputEl.style.fontFamily = '"nanum"';
    inputEl.value = text ?? '';
    divEl.appendChild(inputEl);
    return divEl;
  }

  const insertInpulElToMiddleInput = (handleInputKeyUp: (e: KeyboardEvent | React.KeyboardEvent<HTMLElement>) => void, parentNode: HTMLElement) => {
    const divEl = createInputEl(handleInputKeyUp);
    divEl.style.display = 'flex';
    divEl.draggable = true;
    parentNode.after(divEl);
    const divFirstChild = divEl.querySelector('input') as HTMLElement;
    divFirstChild.focus();
  }

  const insertInputElToLastInput = (handleInputKeyUp: (e: KeyboardEvent | React.KeyboardEvent<HTMLElement>) => void,
    inputWrapperRef: React.RefObject<HTMLDivElement>,
    styleObject: any,
    divRef: React.RefObject<HTMLDivElement>,
    currentPageId: number) => {
    const wrapper = document.getElementById('wrapper');
    const divEl = createInputEl(handleInputKeyUp);
    if (wrapper) {
      addDragEventListener(divEl, handleInputKeyUp, wrapper, currentPageId, saveInputAllContent);
    }
    let newInputEl = divEl.querySelector('input') as HTMLInputElement
    let oldInputEl = inputWrapperRef.current?.querySelector('input') as HTMLInputElement;
    newInputEl.value = oldInputEl.value;
    oldInputEl.value = '';
    const changeStyleList = Object.keys(styleObject) as Array<string>;
    const newInputElStyle = newInputEl.style as { [key: string]: any };
    changeStyleList.forEach(style => {
      newInputElStyle[style] = styleObject[`${style}`];
      oldInputEl.removeAttribute('style');
    })
    divRef.current?.insertBefore(divEl, inputWrapperRef.current);
  }

  const saveInputAllContent = (wrapper: HTMLDivElement, currentPageId: number) => {
    const inputElNodeList = wrapper?.querySelectorAll('input') as NodeList;
    if (inputElNodeList) {
      const inputElList = Array.from(inputElNodeList);
      const textList = inputElList.map(input => (input as HTMLInputElement).value);
      if (!textList[textList.length - 1]) {
        textList.pop();
      }
      dispatch(insertPageContent({ currentPageId, textList }));
    }
  }

  return {
    createInputEl,
    insertInpulElToMiddleInput,
    insertInputElToLastInput,
    saveInputAllContent,
  }
}

export default useDom;