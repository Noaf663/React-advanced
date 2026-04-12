import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const EventsContext = createContext(null);

export const EventsProvider = ({ children }) => {

const [events, setEvents] = useState([ ]);
const [categories, setCategories] = useState([ ]);

useEffect(() => {
    fetch('http://localhost:3000/events')
    .then((res) => res.json())
    .then((data) => setEvents(data))
    .catch((error) => console.log('Error fetching events:', error));
    fetch('http://localhost:3000/categories')
    .then((res) => res.json())
    .then((data) => setCategories(data))
    .catch((error) => console.log('Error fetching categories:', error));

}, []);

return (
    <EventsContext.Provider value={{ events, setEvents, categories, setCategories }}>
    {children}
    </EventsContext.Provider>
);
};

EventsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};