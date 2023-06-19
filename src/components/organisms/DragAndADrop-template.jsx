import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  styled,
  IconButton,
} from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import DeleteIcon from "@mui/icons-material/Delete";

const DragAndDrop = () => {
  const [cards, setCards] = React.useState([
    { id: "1", content: "Card 1" },
    { id: "2", content: "Card 2" },
    { id: "3", content: "Card 3" },
  ]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCards(items);

    console.log("items->>", items);
  };

  const DraggableCard = styled(Card)(({ isDragging }) => ({
    cursor: "move",
    transition: "transform 0.2s ease-in-out",
    transform: isDragging ? "scale(1.05)" : "none",
  }));

  const HoverableCard = styled(DraggableCard)(({ bgcolor }) => ({
    "&:hover": {
      opacity: 0.6,
    },
  }));

  const handleDeleteCard = (cardId) => {
    const updatedCards = cards.filter((card) => card.id !== cardId);
    setCards(updatedCards);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="cards">
        {(provided) => (
          <Grid
            container
            direction="column"
            spacing={3}
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided, snapshot) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}>
                    <HoverableCard isDragging={snapshot.isDragging}>
                      <CardContent>
                        <Typography variant="h6">{card.content}</Typography>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteCard(card.id)}
                          // sx={{ position: "absolute", top: 5, right: 5 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardContent>
                    </HoverableCard>
                  </Grid>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Grid>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragAndDrop;
