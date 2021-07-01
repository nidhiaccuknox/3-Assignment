import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from 'uuid';

//item in one columns
const itemsFromBackend = [
  { id: uuid(), content: "Task 1" },
  { id: uuid(), content: "Task 2" },
  { id: uuid(), content: "Task 3" },
  { id: uuid(), content: "Task 4" },
  { id: uuid(), content: "Task 5" }
];

//All columns
const columnsFromBackend = {
  [uuid()]: {
    name: "Ideas",
    items: itemsFromBackend
  },
  [uuid()]: {
    name: "Tasks Proposed",
    items: []
  },
  [uuid()]: {
    name: "Tasks Assigned",
    items: []
  },

};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];

    //remove item if 2nd arrgumment 1 in splice
    const [removed] = sourceItems.splice(source.index, 1);
    //add item if 2nd arrgumment 0 in splice
    destItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      //before drag
      [source.droppableId]: { ...sourceColumn, items: sourceItems },
      //after drag
      [destination.droppableId]: { ...destColumn, items: destItems }
    });

  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({ ...columns, [source.droppableId]: { ...column, items: copiedItems } });
  }
};

function App() {

  const [columns, setColumns] = useState(columnsFromBackend);

  return (

    <div style={{ display: "flex", justifyContent: "center", height: "100%", marginTop: "50px" }}>
      <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([id, column]) => {

          return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} >

              <div style={{ margin: 8, background: "#DDDDDD", borderRadius: "5px"}}>
                <h2 style={{paddingLeft: "10px" }}>{column.name}</h2>
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => {

                    return (

                      <div {...provided.droppableProps} ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver ? "#C2B8A3" : "transparent",
                          opacity: snapshot.isDraggingOver ? .5 : 1, padding: 4, width: 300, minHeight: 500
                        }}>
                        {column.items.map((item, index) => {
                          console.log(item);

                          return (

                            //index: dragging from dragging to
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => {

                                return (

                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none", padding: 16, margin: "0 0 8px 0", minHeight: "50px", borderRadius: "5px",
                                      backgroundColor: snapshot.isDragging ? "#fff" : "#f2fcfb", color: "black", ...provided.draggableProps.style
                                    }}>
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>

            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App
