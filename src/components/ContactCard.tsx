import React from 'react';

interface ContactCardProps {
    name: string;
    email: string;
    phone: string;
    uniqueUrl: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ name, email, phone, uniqueUrl }) => {
    return (
        <div className="contact-card">
            <h2>{name}</h2>
            <p>Email: {email}</p>
            <p>Phone: {phone}</p>
            <p>Share your contact: <a href={uniqueUrl} target="_blank" rel="noopener noreferrer">{uniqueUrl}</a></p>
        </div>
    );
};

export default ContactCard;