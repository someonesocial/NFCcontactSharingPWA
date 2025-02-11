import React, { useState } from 'react';

const ContactForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [uniqueUrl, setUniqueUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Generate a unique URL based on the contact information
        const generatedUrl = `https://yourapp.com/contact/${encodeURIComponent(name)}`;
        setUniqueUrl(generatedUrl);
        // Here you would typically also save the contact information to a database
    };

    return (
        <div>
            <h2>Create Contact</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Phone:</label>
                    <input 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Generate Unique URL</button>
            </form>
            {uniqueUrl && (
                <div>
                    <h3>Your Unique URL:</h3>
                    <p>{uniqueUrl}</p>
                </div>
            )}
        </div>
    );
};

export default ContactForm;