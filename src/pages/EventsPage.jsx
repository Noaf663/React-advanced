import { Heading, Button, Input, Dialog, Portal, Box, Image, Text, Skeleton, SkeletonText, SimpleGrid } from '@chakra-ui/react';
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
    console.log(events);
    console.log(categories);

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
    
const isLoading = events.length === 0 || categories.length === 0;
    
    return (
      <Box maxW="1100px" mx="auto" px={{ base: "4", md: "6", lg: "8" }} py="6">
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
      <Box md="4" display="flex" gap="4" flexWrap="wrap">
         {categories.map((category) => (
          <label 
          key={category.id}
          style={{ display: "flex", alignItem:"center", gap:"8px" }}
          >
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
        </Box>

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
    
       
                <Text mb="1">Title</Text>
                <Input
                type="text"
                placeholder="Title"
                value={newEvent.title}
                onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                }
                required
                mb="3"
                />
                <Text mb="3">Description</Text>
                <Input 
                type="text"
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value})
                }
                required
                mb="3"
                />
                <Text mb="1">Image</Text>
                <Input 
                type="text"
                placeholder="Image URL"
                value={newEvent.image}
                onChange={(e) =>
                  setNewEvent({...newEvent, image: e.target.value})
                  }
                required
                mb="3"
                />
                <Text mb="1">Location</Text>
                <Input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({...newEvent, location: e.target.value })
                }
                required
                mb="3"
                />
                <Text mb="1">Start time</Text>
                <Input
                type="datetime-local"
                value={newEvent.startTime}
                onChange={(e) =>
                    setNewEvent({...newEvent, startTime: e.target.value})
                }
                required
                mb="3"
                />
                <Text mb="1">End time</Text>
                <Input
                type="datetime-local"
                value={newEvent.endTime}
                onChange={(e) =>
                    setNewEvent({...newEvent, endTime: e.target.value})
                }
                required
               mb="3"
               />
             <Box mb="4" display="flex" gap="4" flexWrap="4">
               {categories.map((category) => (
                <label 
                key={category.id}
                style= {{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <input 
                    type="checkbox"
                    checked={newEvent.categoryIds.includes(category.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewEvent({
                          ...newEvent,
                          categoryIds: [...newEvent.categoryIds, category.id],
                          });
                     } else {
                          setNewEvent({
                            ...newEvent,
                            categoryIds: newEvent.categoryIds.filter((id) => id !== category.id)                    
                          });
                        }
                      }}
                  
                    />
                    {category.name}
                    </label>
                 
                ))}
                    </Box>
               <Box mt="4" display="flex" gap="2">
               <Button type="submit">
                Save
                </Button>

               <Button type="button" onClick={() => setOpen(false)}>
                Cancel
                </Button>
               </Box>
               </form>
            </Dialog.Body>
            </Dialog.Content>
            </Dialog.Positioner>
            </Portal>
            </Dialog.Root>

            {isLoading ? (
              <>
              <Box borderWidth="1px" borderRadius="lg" p="4" mb="4">
                <Skeleton height="24px" mb="4" />
                <Skeleton height="220px" mb="4" borderRadius="md" />
                <SkeletonText noOfLines={3} gap="4" />
              </Box>

              <Box borderWidth="1px" borderRadius="lg" p="4" mb="4">
                <Skeleton height="24px" mb="4" />
                <Skeleton height="220px" mb="4" borderRadius="md" />
                <SkeletonText noOfLines={3} gap="4" />
              </Box>
              </>
           
            
            ) : visibleEvents.length === 0 ? (
          <Text mb="4">No events found.</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="6">
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
              <Heading size="md">
                <Link to={`/event/${event.id}`}>{event.title}</Link>
              </Heading>
              <Text>{event.description}</Text>
              <Text>Location: {event.location}</Text>
              <Image 
              src={event.image} 
              alt={event.title} 
              mt="3" 
              mb="3" 
              borderRadius="md"
              h="220px"
              w="100%"
              objectFit="cover" 
              />
              <Text>Start: {new Date(event.startTime).toLocaleString()}</Text>
              <Text>End: {new Date(event.endTime).toLocaleString()}</Text>
              <Text>Categories: {categoryNames}</Text>

         <Button as={Link} to={`/event/${event.id}`} mt="3">
            View details
         </Button>
     </Box>
        );
        })}
              </SimpleGrid>

      )}
    </Box>
    );
  };
