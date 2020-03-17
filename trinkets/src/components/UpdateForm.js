import React, { useState, useEffect } from "react";
import axios from "axios";

const initialItem = {
  name: "",
  price: "",
  imageUrl: "",
  description: "",
  shipping: ""
};

const UpdateForm = props => {
  const [item, setItem] = useState(initialItem);

  // #5 Since our update form receives our itemsList as a prop in the
  // index.js file, we could say that when the props.items changes,
  // we want to set item with our item to edit.

  // #5A - We're going to look at our items (props.items) and find  one item
  // (one element) at a time by looping through this array. Then stop the
  // loop and set our value of itemToUpdate when the test comes back truthy
  // So item id equals props.match.params.id. As soon as we find one that
  // matches, we set it to itemToUpdate.
  // Remember, we have to do the interpolated string because the id is a
  // number and props.match.params.id is a string. Therefore, they will
  // never end up matching.
  useEffect(() => {
    const itemToUpdate = props.items.find(item => {
      return `${item.id}` === props.match.params.id;
    });

    console.log("itemToUpdate", itemToUpdate);
    // #5C - if the dependency array changes, we're going to run the side
    // effect. Then we're going to take the item that we find
    // (itemToUpdate) from the array that matches the item that we clicked
    // on and then add that item (itemToUpdate) to state (in the
    // const [item]). When we add that item to state, all of the properties
    // in the initialItem array are going to be populated and added into
    // our input (in the return). For example, item.price (in the value of
    // input) will be added to the price input because the itemToEdit has
    // a price property on it and that's getting updated to the item state
    // again, found here: const [item, setItem].

    // #6 Why would item be undefined when calling name? The useEffect is
    // running too soon (AKA a race condition). The useEffect is running
    // and trying to set an item BEFORE our initial API call has come back
    // from the axios request on Index.js file.
    // Instead of simply `setItem(itemToUpdate);` let's change it. Let's say
    // if itemToUpdate is a thing, then we're going to set the item. We're
    // only going to call setItem if itemToUpdate is a truthy value. In
    // other words, if this is not undefined, go ahead and set our item.
    if (itemToUpdate) {
      setItem(itemToUpdate);
    }
    // #5B -This is a dependency array and anything inside the itemToUpdate
    // const (ths side effect - useEffect), should ALWAYs be put here
    // Right now, it depends on props.items and props.match.params.id
    // When the UpdateForm comp mounts, if props.items or
    // props.match.params.id changes, then we're going to run the
    // useEffect side effect.
  }, [props.items, props.match.params.id]);

  const changeHandler = ev => {
    ev.persist();
    let value = ev.target.value;
    if (ev.target.name === "price") {
      value = parseInt(value, 10);
    }

    setItem({
      ...item,
      [ev.target.name]: value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // #7 make a PUT request to edit the item
    // Put is a lot like Post with one extra element to it.
    // Check the server to see what the endpoints are. So our endpoint
    // is going to be a interpolated string with the id of the item passed
    // to it.
    // #10 We need to pass in a body of data. Luckily, we have our item
    // (the const [item] found above). It is being updated with every
    // change of our inputs. So we're going to pass in our item. When
    // checking the headers in the Network dev tools, you should see your
    // Request Payload display the updated information. You can double
    // check in the Preview section next to Headers.
    axios
      .put(`http://localhost:3333/items/${item.id}`, item)
      // #8 We'll now call our .then to get our response. Console log it
      // res data ==> full array with updated item
      // Most of the time, you are NOT going to get a full array with a
      // list of the items.
      .then(res => {
        console.log(res);
        // #12ish - Usually, APIs return just the updated item or just the id
        // of the updated item. If that's the case, you need to make
        // a new array with all the old items and replace the updated item
        // with the updated item (no that isn't a typo). The idea is you
        // would have to create a newItemsArray from props.items probably
        // by mapping. Map through the items. Find the item you just
        // updated with item (from const [item]) - or res.data (whichever you
        // prefer there) - and then call updateItems with your new array. This
        // part is important to your assigned repo.
        // const newItemsArray = props.items.map;

        //#11 After updating the item, re-render. We want to update our
        // item state and re-render our items with the setter function
        // (const setItems found in index.js). setItems is being passed
        // into the UpdateForm as a prop called updateItems.
        // App is storing the items on state. We're taking the setter
        // function and passing it to the UpdateForm on a prop called
        // updateItems. When we click the update button on the form, we
        // submit our update request & get our data back with the updated
        // item on res.data. so we can call props.updateItems and pass in
        // our updated data (res.data) and that will update our items
        // where they are stored in App.
        props.updateItems(res.data);

        // NOTE: history.push takes you to the route & replaces the URL with
        // whatever you have inside the parens. Then your Route will find
        // whatever it matches that path and render whatever you tell
        // it to.
        props.history.push(`/item-list/${item.id}`);
      })
      // #9 Call .catch and console log the error
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <h2>Update Item</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          onChange={changeHandler}
          placeholder="name"
          value={item.name}
        />
        <div className="baseline" />

        <input
          type="number"
          name="price"
          onChange={changeHandler}
          placeholder="Price"
          value={item.price}
        />
        <div className="baseline" />

        <input
          type="string"
          name="imageUrl"
          onChange={changeHandler}
          placeholder="Image"
          value={item.imageUrl}
        />
        <div className="baseline" />

        <input
          type="string"
          name="description"
          onChange={changeHandler}
          placeholder="Description"
          value={item.description}
        />
        <div className="baseline" />

        <input
          type="string"
          name="shipping"
          onChange={changeHandler}
          placeholder="Shipping"
          value={item.shipping}
        />
        <div className="baseline" />

        <button className="md-button form-button">Update</button>
      </form>
    </div>
  );
};

export default UpdateForm;
