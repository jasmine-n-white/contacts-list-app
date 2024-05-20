import { useState, useEffect } from "react";
import supabase from "/src/config/supabaseClient.jsx";
import "./App.css";
import Header from "./Header/Header.jsx";

function App() {
  // State to store the contacts and the new contact input value
  const [contacts, setContacts] = useState([]); 
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [formError, setFormError] = useState(null);
  const [numberError, setNumberError] = useState(null);


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
  
  const  validateForm =()=> {
    if(!newName||!newNumber) {
      setFormError("Please fill out all required fields!");
      return true;
    } else if (newName && newNumber){
      setFormError(null);
    } 
    if (!isFinite(newNumber) || newNumber.length!==10) {
      setNumberError("Please enter a 10-digit number!");
      return true;
    } else {
      setNumberError(null);
    }
  }

  // Define an addContact function
  const addContact = async (e) => { 
    e.preventDefault();
    validateForm();
    if (validateForm()) return;
    const { error } = await supabase
      .from('contacts')
      .insert({ name: newName, phone_number: newNumber });
      fetchContacts();
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
  };

  
  return (
   <>
      <Header />
      <div className="App">
      <form>
      <input
          type="text" id="newName"
          placeholder="Add a new contact name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
         <input
          type="text" id="newNumber"
          placeholder="Add a phone number"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
        {numberError && <p className="errorMessage">{numberError}</p>}
        {formError && <h3 className="errorMessage">{formError}</h3>}
        <button onClick={addContact}>Add Contact</button>
      </form>
        <div className="contacts">
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
      </div>
      </>
  );
}

export default App;

