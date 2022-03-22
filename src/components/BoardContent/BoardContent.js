import { useState, useEffect } from "react";
import { initData } from "../../actions/initData";
import Column from "../Column/Column";
import './BoardContent.scss';
import _ from 'lodash';
import { mapOrder } from "../../utils/sorts";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "../../utils/dragDrop";


const BoardContent = () => {
    const [board,setBoard] = useState({});
    const [columns,setColumns] = useState([]);

    useEffect(()=> {
        const boardInitData = initData.boards.find(item => item.id === 'board-1');
        if(boardInitData){
            setBoard(boardInitData);
            // boardInitData.columns.sort((a,b) => 
            // boardInitData.columnOrder.indexOf(a.id) - boardInitData.columnOrder.indexOf(b.id))
            setColumns(mapOrder( boardInitData.columns,boardInitData.columnOrder,'id'));
        }
    },[]);

    const onColumnDrop = (dropResult) => {
        let newColumns = [...columns];
        newColumns = applyDrag(newColumns, dropResult);

        let newBoard = {...board};
        newBoard.columnOrder = newColumns.map(columns => columns.id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
    }

    const onCardDrop = (dropResult, columnId) => {
        if(dropResult.removedIndex !== null || dropResult.addedIndex !== null ){
            console.log(">>> inside onCardDrop:", dropResult, "with column id=", columnId);
            let newColumns = [...columns];
            let currentColumn = newColumns.find(column => column.id === columnId);
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
            currentColumn.cardOrder = currentColumn.cards.map(card => card.id);
            
            setColumns(newColumns);
        }   
    }

    if(_.isEmpty(board)){
        return(
            <>
                <div className="not-found">Board not found</div>
            </>
        )
    }
    return (
        <div className="board-columns">
            <Container
            orientation="horizontal"
            onDrop={onColumnDrop}
            getChildPayload={index => columns[index]}
            dragHandleSelector=".column-drap-handle"
            dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className:'column-drop-preview'
            }}
            >
            {columns && columns.length > 0 && columns.map((column, index)=>{
                return(
                    <Draggable key={column.id}>
                    <Column 
                        column={column}
                        onCardDrop={onCardDrop}
                    />
                    </Draggable>
                )
            })}
            <div className='add-new-column'>
                <i className='fa fa-plus icon'></i> Add a new column
            </div>
            </Container> 
        </div>
    )
}

export default BoardContent;
