import { Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const Navigation = () => {
    return (
        <nav>
            <Flex gap={2}>
                <Link to="/">Events</Link>
                <Link to="/contact">Contact</Link>
            </Flex>
        </nav>
    );
};