import { useState, useEffect } from "react";
import supabase from "/src/config/supabaseClient.jsx";
import "./App.css";
import Header from "./Header/Header.jsx";

function App() {
  // State to store the contacts and the new contact input value
  const [contacts, setContacts] = useState([]); 
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  // UseEffect hook to run fetchContacts function when the component mounts
  useEffect(() => {
    fetchContacts();
  }, []);

  // Define a fetchContacts function
  const fetchContacts = async () => {
    const {data, error} = await supabase.from("contacts").select();
    if (error) {
      console.log(error);
    }
    setContacts(data);
  };

  // Define an addContact function
  const addContact = async () => { 
    if(!newName ||!newNumber) return;
    const { error } = await supabase
      .from('contacts')
      .insert({ name: newName, phone_number: newNumber })
      setNewName("");
      setNewNumber("");
      fetchContacts();

  };

  // Define a deleteContact function
  const deleteContact = async (id) => {
    const {error} = await supabase.from("contacts").delete().eq("id", id);
    if (error) {
      console.log("error");
    }
    setContacts(contacts.filter((contact) => contact.id !== id ));
    // Delete logic here
  };

  return (
    <div className="App">
      <Header />
      <form>
      <input
          type="text"
          placeholder="Add a new contact name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
         <input
          type="text"
          placeholder="Add a phone number"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
        <button onClick={addContact}>Add Contact</button>
      </form>
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id}>
              <img src="https://www.zeasn.com/static/kindeditor/attached/image/20220712/20220712100226_24273.png" id="contactIcon" alt="default contact icon" />
                <div className="contactInfo">
                  <span id="displayedName">{contact.name}</span>
                  <span id="displayedNumber">{contact.phone_number}</span> 
                </div>
                <button onClick={() => deleteContact(contact.id)}>Delete</button>
              </li>
            ))}
          </ul>
      </div>
  );
}

export default App;
