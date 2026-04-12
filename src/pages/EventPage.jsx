import { Heading, 
    Button, 
    Input,
    Dialog, 
    Portal
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


console.log("eventId:", eventId);
console.log("event:", event);
console.log("categories:", categories);
   
        

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
    return <p>Loading...</p>;
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
    <div>
        <Heading>{event.title}</Heading>
        <p>{event.description}</p>
        <img src={event.image} alt={event.title} />
        <p>Location: {event.location}</p>
        <p>Start: {event.startTime}</p>
        <p>End: {event.endTime}</p>
        <p>Categories: {categoryNames.join(', ')}</p>

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
                
        
             <Input 
              name="title"
              value={editedEvent.title}
              onChange={handleChange}
              placeholder="Title"
              required
              />
              <Input
              name="description"
              value={editedEvent.description}
              onChange={handleChange}
              placeholder="Description"
              required
             />
             <Input
             name="image"
             value={editedEvent.image}
             onChange={handleChange}
             placeholder="Image URL"
             required
             />
             <Input
             name="location"
             value={editedEvent.location}
             onChange={handleChange}
             placeholder="Location"
             required
             />
             <Input 
             name="startTime"
             value={editedEvent.startTime}
             onChange={handleChange}
             placeholder="Start time"
             required
             />
              <Input 
             name="endTime"
             value={editedEvent.endTime}
             onChange={handleChange}
             placeholder="End time"
             required
             />

             <p>Categories</p>
             {categories.map((category) => (
                <label key={category.id}>
                    <input
                  type="checkbox"
                  checked={editedEvent.categoryIds.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
            />
            {category.name}
        </label>
             ))}
          </Dialog.Body>


            <div>
            <Button onClick={handleSave}>
                Save
            </Button>
            <Button onClick={() => setOpen(false)}>
                Close
            </Button>
            <Button onClick={handleDelete}>
                Delete Event
            </Button>
            </div>
            </Dialog.Content>
            </Dialog.Positioner>
            </Portal>
            </Dialog.Root>
    </div>
);

};