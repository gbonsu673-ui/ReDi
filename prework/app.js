"use strict";

// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const groceryContainer = document.querySelector(".grocery-container");
const groceryList = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editId = "";

// ****** LOCAL STORAGE **********
// We use the localStorage API in Javascript
const getLocalStorage = function () {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};
// Add new item to local storage
const addToLocalStorage = function (id, value) {
  const groceryItem = { id: id, value: value }; // We can use a short-hand {id, value} since the name associations are the same
  let items = getLocalStorage();
  items.push(groceryItem);
  localStorage.setItem("list", JSON.stringify(items));
};

// Remove item from local storage by id
const removeFromLocalStorage = function (id) {
  let items = getLocalStorage();
  items = items.filter(function (groceryItem) {
    if (groceryItem.id !== id) {
      return groceryItem;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
};

// Update item in local storage by id
const editLocalStorage = function (id, newValue) {
  let items = getLocalStorage();
  items = items.map(function (groceryItem) {
    if (groceryItem.id === id) {
      groceryItem.value = newValue;
    }
    return groceryItem;
  });
  localStorage.setItem("list", JSON.stringify(items));
};

// ****** FUNCTIONS **********
// create a grocery list item
const createListItem = function (id, value) {
  const element = document.createElement("article"); // create an HTML element
  element.classList.add("grocery-item"); //add 'grocery-item'class to element
  const attribute = document.createAttribute("data-id"); // create an attribute called "data-id"
  attribute.value = id; // set the value of the attribute to the random id
  element.setAttributeNode(attribute); // add the attribute to the HTML element
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;

  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  // add the HTML element (an item) as a child element of the grocery container div
  groceryList.appendChild(element);
};

// add items to or edit existing ones in the list
const addItem = function (e) {
  e.preventDefault(); //prevent form from being sent to a server by default
  const formInputValue = grocery.value;
  const id = new Date().getTime().toString();

  // adding new item to the list
  if (formInputValue && editFlag === false) {
    // create new item
    createListItem(id, formInputValue);
    // display alert
    displayAlert("item added to the list", "success");
    groceryContainer.classList.add("show-container"); //show the list of current items
    // add to local storage
    addToLocalStorage(id, formInputValue);
    // set back to default
    setBackToDefault();

    // editting an available item in the list
  } else if (formInputValue && editFlag === true) {
    editElement.innerHTML = formInputValue;
    displayAlert("value changed", "success");
    // update local storage
    editLocalStorage(editId, formInputValue);
    setBackToDefault();

    // handling an empty form input
  } else {
    displayAlert("please enter value", "danger");
  }
};

// display alert
const displayAlert = function (text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000); // alert shows on screen for 5 seconds
};

// set placeholder, form input, & edit flag back to default
const setBackToDefault = function () {
  grocery.value = "";
  editFlag = false;
  editId = "";
  submitBtn.textContent = "submit";
};

// clear items in the list
const clearItems = function () {
  const allItems = document.querySelectorAll(".grocery-item");
  if (allItems.length > 0) {
    allItems.forEach(function (item) {
      groceryList.removeChild(item);
    });
  }
  groceryContainer.classList.remove("show-container"); // hide the items container since it's empty
  displayAlert("Items removed", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
};

// delete an item from the list
const deleteItem = function (e) {
  const groceryListElement = e.currentTarget.parentElement.parentElement;
  const articleId = groceryListElement.dataset.id;
  groceryList.removeChild(groceryListElement);

  // hide container if there are no more items after deletion
  if (groceryList.children.length === 0) {
    groceryContainer.classList.remove("show-container");
  }
  // display alert
  displayAlert("item removed", "danger");

  // remove item from local storage
  removeFromLocalStorage(articleId);
  setBackToDefault();
};

// edit an item that's available in the list
const editItem = function (e) {
  editFlag = true;
  const groceryListElement = e.currentTarget.parentElement.parentElement;
  editId = groceryListElement.dataset.id;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // set form value
  grocery.value = editElement.innerHTML;
  // change button name to reflect the fact that text is being editted
  submitBtn.textContent = "edit";
};

// ****** SETUP ITEMS **********
const setupItems = function () {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    groceryContainer.classList.add("show-container"); // make grocery container visible
  }
};

// ****** EVENT LISTENERS **********
//load items
window.addEventListener("DOMContentLoaded", setupItems);

//submit button on form
form.addEventListener("submit", addItem);

//clear button
clearBtn.addEventListener("click", clearItems);
