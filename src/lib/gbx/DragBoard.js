import React from 'react'
import { useDrag, useDrop } from 'react-dnd';

export const Tool = ({ name, style = {}, children }) => {
  const [{isDragging}, drag] = useDrag({
    item: { name, type: 'tool' },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const toolStyle = {
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    ...style
  };

  return (
    <div
      ref={drag}
      style={toolStyle}
      className='tool'
    >
      {children}
    </div>
  )
}

export const Board = ({ addTool, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'tool',
    drop: (item, monitor) => {
      const getItem = monitor.getItem();
      addTool(getItem.name);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      className='board'
      ref={drop}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {children}
      {isOver && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: '#49c9ff',
          }}
        />
      )}
    </div>
  )
}
