import React from "react";
import { Route, NavLink } from "react-router-dom";
import axios from "axios";

import ItemDescription from "./ItemDescription";
import ItemShipping from "./ItemShipping";

function Item(props) {
  const item = props.items.find(
    thing => `${thing.id}` === props.match.params.id
  );
    // #14 Add a new function for the delete button
    const deleteItem = e => {
        e.preventDefault();
        // #15 Call axios, go into the server and find where the delete
        // function is. Then add that endpoint into the link (item.id)
        axios
            //Delete is cool because it's kind of like a mix between a
            // get request and a put request in that we don't have to
            // pass in any data. We just pass in the URL with the id of
            // the item we want to delete.
            .delete(`http://localhost:3333/items/${item.id}`)
            // #16 After you call axios and delete, make sure to call
            // then and catch.
            .then(res => {
                console.log(res);
                // #17 Inside the .then, set your new array to the items
                // state in App. We want to call the setItems function in
                // the App file. Go down to the item route. There, you
                // will see the updateItems passed as a prop (setItems).
                props.updateItems(res.data);
                console.log("Going to push to new URL");
                // #18 In order to show that the item is deleted now, 
                // you'll want to reroute the user back to the list for
                // good UX practices.
                // You can do this by using history.push. Here, we don't
                // need an interpolated string because this Route is just
                // "/item-list" - no dynamic properties attached on the end.
                props.history.push("/item-list");
                console.log("Past the push to the new URL");
            });
            .catch(err => {
                console.log(err);
            });
        };

        if (!props.items.length || !item) {
            return <h2>Loading item data...</h2>;
        }

        // #2 Create the function - Continuation of Dustin's version on #1 at
        // the bottom. When the button is clicked, route to the update form
        const handleEditClick = e => {
            e.preventDefault();
            // #3 Use the history object for your route (route to the update form)
            // We use history to create a new page with a new route to that new
            // component
            props.history.push(`/update_item/${item.id}`);
        };

    return (
        <div className="item-wrapper">
        <div className="item-header">
            <div className="image-wrapper">
            <img src={item.imageUrl} alt={item.name} />
            </div>
            <div className="item-title-wrapper">
            <h2>{item.name}</h2>
            <h4>${item.price}</h4>
            </div>
        </div>
        <nav className="item-sub-nav">
            <NavLink exact to={`/item-list/${item.id}`}>
            the story
            </NavLink>
            <NavLink to={`/item-list/${item.id}/shipping`}>shipping</NavLink>
        </nav>
        <Route
            exact
            path="/item-list/:id"
            render={props => <ItemDescription {...props} item={item} />}
        />
        <Route
            path="/item-list/:id/shipping"
            render={props => <ItemShipping {...props} item={item} />}
        />
        <button
            className="md-button"
            // #1 Add onClick handler to the edit button.

            // **** This version will have performance issues if you are
            // **** if you are dynamically creating the "Item" component here
            // onClick={event =>{
            //   event.preventDefault();
            //   props.history.push(`/update-item/${item.id}`)}}

            // Preferred version
            onClick={handleEditClick}
        >
            Edit
        </button>
        {/* #13 Add an onClick that is going to say deleteItem. */}
        <button onClick={deleteItem} className="md-button">
            Delete
        </button>
        </div>
    );
}

export default Item;