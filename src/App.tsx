import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ContactForm from './components/ContactForm';
import ContactCard from './components/ContactCard';
import NfcWriter from './components/NfcWriter';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <h1>NFC Contact PWA</h1>
        <Switch>
          <Route path="/" exact component={ContactForm} />
          <Route path="/contact" component={ContactCard} />
          <Route path="/nfc" component={NfcWriter} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;