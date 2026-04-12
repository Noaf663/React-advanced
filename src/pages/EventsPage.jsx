import { Heading, Button, Input, Checkbox, Dialog, Portal, Box, Image, Text, Skeleton, SkeletonText } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { EventsContext } from './EventsContext';
import { toaster } from '../components/ui/toaster';

export const EventsPage = () => {

    const { events, setEvents, categories } = useContext(EventsContext);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        image: "",
        location: "",
        startTime: "",
        endTime: "",
        categoryIds: [],
    });

  
    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:3000/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEvent),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error('Failed to add event');
            }
            return res.json();
    })
          .then((createdEvent) => {
            setEvents((prevEvents) => [...prevEvents, createdEvent]);
            setOpen(false);
            setNewEvent({
                title: "",
                description: "",
                image: "",
                location: "",
                startTime: "",
                endTime: "",
                categoryIds: [],
            });

              toaster.create({
                title: 'Success',
                description: 'Event added successfully.',
                type: 'success',
                duration: 3000,
                closable: true,
              });
          })
          .catch(() => {
            toaster.create({
              title: 'Error',
              description: 'Failed to add event.',
              type: 'error',
              duration: 3000,
              closable: true,
            });
          });
    };

      const searchedEvents = events.filter((event) => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

    const visibleEvents = searchedEvents.filter((event) => {
    if (selectedCategories.length === 0) {
      return true;

    }


    return selectedCategories.some((id) =>
    event.categoryIds.includes(id)
    );
   });
    

    if (events.length === 0 || categories.length === 0) {
  
   return (
     <>
        <Heading mb="4">List of events</Heading>
        <Box borderWidth="1px" borderRadius="lg" p="4" mb="4">
          <Skeleton height="24px" mb="4" />
          <Skeleton height="200px" mb="4" />
          <SkeletonText noOfLines={3} gap="4" />
        </Box>

         <Box borderWidth="1px" borderRadius="lg" p="4" mb="4">
          <Skeleton height="24px" mb="4" />
          <Skeleton height="200px" mb="4" />
          <SkeletonText noOfLines={3} gap="4" />
        </Box>
      </>
   );
    }
    return (
      <>
      <Heading mb="4">List of events</Heading>
        <Button onClick={() => setOpen(true)}>
            Add Event
         </Button>
        <Input 
        type="text"
        placeholder="Search events"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        
        />
      
         {categories.map((category) => (
          <label key={category.id}>
            <input
            type="checkbox"
            checked={selectedCategories.includes(category.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedCategories([...selectedCategories, category.id]);

              } else {
                setSelectedCategories(
                  selectedCategories.filter((id) => id !== category.id)
                );
              }
            }}
            />
            {category.name}
          </label>
         ))}
        
        <Dialog.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
        <Portal> 
        <Dialog.Backdrop />
        <Dialog.Positioner>
        <Dialog.Content>
        <Dialog.Header>
         <Dialog.Title>Add Event </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <form onSubmit={handleSubmit}>
    
       
            
                <Input
                type="text"
                placeholder="Title"
                value={newEvent.title}
                onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                }
                required
                />
                <Input 
                type="text"
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value})
                }
                required
                />
                <Input 
                type="text"
                placeholder="Image URL"
                value={newEvent.image}
                onChange={(e) =>
                  setNewEvent({...newEvent, image: e.target.value})
                  }
                required
                />
                <Input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({...newEvent, location: e.target.value })
                }
                required
                />
                <Input
                type="datetime-local"
                value={newEvent.startTime}
                onChange={(e) =>
                    setNewEvent({...newEvent, startTime: e.target.value})
                }
                required
                />
                <Input
                type="datetime-local"
                value={newEvent.endTime}
                onChange={(e) =>
                    setNewEvent({...newEvent, endTime: e.target.value})
                }
                required
               
               />
             
               {categories.map((category) => (
                <Checkbox
                    key={category.id}
                    checked={newEvent.categoryIds.includes(category.id)}
                    onCheckedChange={() => {
                        if (newEvent.categoryIds.includes(category.id)) {
                        setNewEvent({
                          ...newEvent,
                          categoryIds: newEvent.categoryIds.filter(
                            (id) => id !== category.id
                          ),
                        });
                     } else {
                          setNewEvent({
                            ...newEvent,
                            categoryIds: [...newEvent.categoryIds, category.id],                    
                          });
                        }
                      }}
                  
                    >
                    {category.name}
                    </Checkbox>
                ))}
               <Button type="submit">Save</Button>

            
               <Button type="button" onClick={() => setOpen(false)}>Cancel</Button>
               </form>
            </Dialog.Body>
            </Dialog.Content>
            </Dialog.Positioner>
            </Portal>
            </Dialog.Root>
            
         
        {visibleEvents.map((event) => {
            const categoryNames = event.categoryIds
            .map((categoryId) => {
                const foundCategory = categories.find(
                    (category) => category.id === categoryId
                );
                return foundCategory?.name;
            })
            .join(", ");
          return (
            <Box key={event.id} borderWidth="1px" borderRadius="lg" p="4" mb="4">
              <Heading size="md">{event.title}</Heading>
              <Text>{event.description}</Text>
              <Image src={event.image} alt={event.title} mt="3" mb="3" borderRadius="md" />
              <Text>Start: {event.startTime}</Text>
              <Text>End: {event.endTime}</Text>
              <Text>Categories: {categoryNames}</Text>

         <Button as={Link} to={`/event/${event.id}`} mt="3">
            Event
         </Button>
     </Box>
        );
        })}
        </>
   );
  }
  
 
