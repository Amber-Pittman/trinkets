import React, { useState, useEffect } from 'react';
//import ReactDOM from "react-dom";
import { BrowserRouter as Route, NavLink } from "react-router-dom";
import axios from "axios";

import Home from "./components/Home";
import ItemsList from "./components/ItemsList";
import Item from "./components/Item";
import ItemForm from "./components/ItemForm";
import UpdateForm from "./components/UpdateForm";

import './styles.css';

const App = () => {
  // this const is called "derived state"
  const [items, setItems] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3333/items")
      .then(res => setItems(res.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div className="App">
      <nav>
        <h1 className="store-header">Dustin's Trinkets</h1>
        <div className="nav-links">
          <NavLink exact to="/item-form">
            Add Item
          </NavLink>
          <NavLink exact to="/">
            Home
          </NavLink>
          <NavLink to="/item-list">
            Shop
          </NavLink>
        </div>
      </nav>

      <Route exact path="/" component={Home} />
      <Route
        exact
        path="/item-list"
        render={props => <ItemsList {...props} items={items} />}
      />
      <Route
        path="/item-list/:id"
        render={props => (
          <Item {...props} items={items} updateItems={setItems} />
        )}
      />
      <Route path="/item-form" component={ItemForm} />      
      
      {/* #4 We need to add a route for the Update form with an :id param */}
      <Route
        path="/update-item/:id"
        render={props => (
          // Our update form receives our itemsList as a prop
          <UpdateForm {...props} items={items} updateItems={setItems} />
        )}
      />
    </div>
  );
}

export default App;
