import { Heading, 
    Button, 
    Input,
    Dialog, 
    Portal, 
    Box,
    Text, 
    Image,
    Skeleton,
} from '@chakra-ui/react';
import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventsContext } from './EventsContext';
import { toaster } from '../components/ui/toaster';


export const EventPage = () => {
    const { eventId } = useParams();
    const { events, categories, setEvents } = useContext(EventsContext);
    const event = events.find((e) => String(e.id) === String(eventId)); 
    const [open, setOpen] = useState(false);
    const [editedEvent, setEditedEvent] = useState({
        title: '',
        description: '',
        image: '',
        location: '', 
        startTime: '',
        endTime: '',
        categoryIds: [],
    });
    const navigate = useNavigate();



   
        

    useEffect(() => {
  if (event) {
        setEditedEvent({
            title: event.title,
            description: event.description,
            image: event.image,
            location: event.location,
            startTime: event.startTime,
            endTime: event.endTime,
            categoryIds: event.categoryIds,
        });
    }
}, [event]);  
        
 
   
if (!event || categories.length === 0) {
    return(
        <Box maxW="900px" mx="auto" px={{ base: "4", md: "6", lg: "8" }} py="6">
            <Skeleton height="40px" width="140px" mb="4" borderRadius="md" />

            <Skeleton height="36px" width="60%" mb="3" />
            <Skeleton height="20px" width="90%" mb="4" />
            
            <Skeleton height="400px" borderRadius="md" mb="4" />

            <Skeleton height="20px" width="50%" mb="2" />
            <Skeleton height="20px" width="55%" mb="2" />
            <Skeleton height="20px" width="55%" mb="2" />
            <Skeleton height="20px" width="45%" mb="4" />

            <Skeleton height="40px" width="110px" borderRadius="md" />
        </Box>
    );
}
const categoryNames = event.categoryIds
?.map((categoryId) => {
    const foundCategory = categories.find((category) => category.id === categoryId);
    return foundCategory?.name;
})
.filter(Boolean);

const handleChange = (e) => {
    const{ name, value } = e.target;

    setEditedEvent((prev) => ({
        ...prev,
        [name]: value,
    }));
};

const handleDelete = async () => {
   
   
    const confirmed = window.confirm('Are you sure you want to delete the event? ');
    if (!confirmed) return;

    try {
    await fetch(`http://localhost:3000/events/${eventId}`, {
    method: 'DELETE',
    });

    setEvents((prevEvents) => 
        prevEvents.filter((e) => String(e.id) !== String(eventId)) 
);
    
        toaster.create({
        title: 'Success',
        description: 'Event deleted successfully!',
        type: 'success',
        duration: 3000,
        closable: true
        });

        navigate('/');

    } catch {
        toaster.create({
        title: 'Error',
        description: 'Failed to delete event.',
        type: 'error',
        duration: 3000,
        closable: true,
    });
}
};


const handleCategoryChange = (categoryId) => {
    setEditedEvent((prev) => {
    const alreadySelected = prev.categoryIds.includes(categoryId);

        return {
            ...prev,
            categoryIds: alreadySelected
                ? prev.categoryIds.filter((id) => id !== categoryId)
                : [...prev.categoryIds, categoryId],
        };
    });
};

const handleSave = async () => {
    try {
    const updatedEvent = {
        ...event,
        ...editedEvent,
    };
const res = await fetch(`http://localhost:3000/events/${eventId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedEvent),

   
});

if (!res.ok) {
    throw new Error('Failed to update event.');
}
const data = await res.json();
setEvents((prevEvents) =>
    prevEvents.map((e) => (String(e.id) === String(eventId) ? data : e))
);

setEditedEvent(data);
setOpen(false);

 toaster.create({
        title: 'Success',
        description: 'Event updated successfully.',
        type: 'success',
        duration: 3000,
        closable: true,
    });
} catch {
  toaster.create({
        title: 'Error',
        description: 'Failed to update event.',
        type: 'error',
        duration: 3000,
        closable: true,
  });
}
};
return (
    <Box maxW="900px" mx="auto" px={{ base: "4", md: "6", lg: "8" }} py="6">
        <Button onClick={() => navigate("/")} mb="4">
         Back to events
        </Button>
        <Heading mb="3">{event.title}</Heading>
        <Text mb="2">{event.description}</Text>
        <Image 
        src={event.image} 
        alt={event.title}
        w="100%"
        maxH="400px"
        objectFit="cover"
        borderRadius="md"
        my="4"
        />
        <Text mb="2">Location: {event.location}</Text>
        <Text mb="2">Start: {new Date(event.startTime).toLocaleString()}</Text>
        <Text mb="2">End: {new Date(event.endTime).toLocaleString()}</Text>
        <Text mb="4">Categories: {categoryNames.join(', ')}</Text>

        <Button onClick={() => setOpen(true)}>
            Edit event
        </Button>
        <Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
            <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header> 
                        <Dialog.Title>Edit Event</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                
             <Text mb="1">Title</Text>
             <Input 
              name="title"
              value={editedEvent.title}
              onChange={handleChange}
              placeholder="Title"
              required
              mb="3"
              />
              <Text mb="1">Description</Text>
              <Input
              name="description"
              value={editedEvent.description}
              onChange={handleChange}
              placeholder="Description"
              required
              mb="3"
             />
             <Text mb="1">Image</Text>
             <Input
             name="image"
             value={editedEvent.image}
             onChange={handleChange}
             placeholder="Image URL"
             required
             mb="3"
             />
             <Text mb="1">Location</Text>
             <Input
             name="location"
             value={editedEvent.location}
             onChange={handleChange}
             placeholder="Location"
             required
             mb="3"
             />
             <Text mb="1">Start Time</Text>
             <Input 
             type="datetime-local"
             name="startTime"
             value={editedEvent.startTime}
             onChange={handleChange}
             placeholder="Start time"
             required
            mb="3"
             />
           
             <Text mb="1">End Time</Text>
              <Input 
             type="datetime-local"
             name="endTime"
             value={editedEvent.endTime}
             onChange={handleChange}
             placeholder="End time"
             required
             mb="3"
             />

             <Text mb="2">Categories</Text>
             <Box display="flex" flexDirection="column" gap="2">
             {categories.map((category) => (
                <label 
                key={category.id}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                    <input
                  type="checkbox"
                  checked={editedEvent.categoryIds.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
            />
            {category.name}
        </label>
             ))}
             </Box>
          </Dialog.Body>


            <Box mt="4" display="flex" gap="3" flexWrap="wrap">
            <Button onClick={handleSave}>
                Save
            </Button>
            <Button onClick={() => setOpen(false)}>
                Close
            </Button>
            <Button onClick={handleDelete}>
                Delete Event
            </Button>
            </Box>
            </Dialog.Content>
            </Dialog.Positioner>
            </Portal>
            </Dialog.Root>
    </Box>  
    
);

};