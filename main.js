const form = document.querySelector('#itemForm'),
  itemInput = document.querySelector('#itemInput'),
  itemList = document.querySelector('.item-list'),
  feedback = document.querySelector('.feedback'),
  addBtn = document.querySelector('#add-item'),
  clearBtn = document.querySelector('#clear-list');

console.log(form, itemInput);

let todoList = [];
console.log('todoList ==>', todoList);

// Get List
const getList = function (todoList) {
  itemList.innerHtml = '';
  todoList?.forEach((item, index) => {
    itemList?.insertAdjacentHTML(
      'beforeend',
      `<div class="item">
            <div class="item-info">
              <h6 class="item-index">${index}</h6>
              <p class="item-name">${item}</p>
            </div>
            <div class="item-icons">
              <i class="far fa-check-circle complete-item"></i>
              <i class="far fa-edit edit-item"></i>
              <i class="far fa-times-circle delete-item"></i>
            </div>
          </div>`
    );
    handleItem(item);
  });
};

// Handle item

const handleItem = function (itemName) {
  const items = itemList.querySelectorAll('.item');

  items.forEach((item) => {
    if (
      item.querySelector('.item-name').textContent.trim().toLowerCase() ===
      itemName.trim().toLowerCase()
    ) {
      // Completed Event
      item
        .querySelector('.complete-item')
        .addEventListener('click', function () {
          let itemIndex = item.querySelector('.item-index');
          let itemName = item.querySelector('.item-name');

          itemIndex.classList.toggle('completed');
          itemName.classList.toggle('completed');
        });
      // Edit Event
      item.querySelector('.edit-item').addEventListener('click', function () {
        addBtn.innerHTML = 'Edit Item';
        itemInput.value = itemName;
        itemList.removeChild(item);

        todoList = todoList.filter((item) => {
          return item !== itemName;
        });
        setLocalStorage(todoList);
      });
      //Delete Event
      item.querySelector('.delete-item').addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this task ?')) {
          itemList.removeChild(item);
          todoList = todoList.filter((item) => item !== itemName);
          setLocalStorage(todoList);
          sendFeedback('Item deleted', 'darkteal');
        }
      });
    }
  });
};

//TODO: Add an item to the List, including to local storage
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const itemName = itemInput.value;

  if (itemName.length === 0) {
    sendFeedback('Please Enter Valid Value', 'darkteal');
  } else {
    console.log('item name', itemName);

    addBtn.innerHTML = 'Add Item';
    todoList.push(itemName);
    setLocalStorage(todoList);
    console.log('todoList', todoList);

    getList(todoList);
    sendFeedback('Item added to the list', 'teal');
  }

  itemInput.value = '';
  window.location.reload();
});

// Save and load to local storage

const setLocalStorage = function (todoList) {
  localStorage.setItem('todoList', JSON.stringify(todoList));
};

const getLocalstorage = function () {
  const todoStorage = localStorage.getItem('todoList');

  if (todoStorage === 'undefined' || todoStorage === null) {
    todoList = [];
  } else {
    todoList = JSON.parse(todoStorage);
    getList(todoList);
  }
};
getLocalstorage();
// Send feedback
function sendFeedback(text, classname) {
  const feedback = document.querySelector('.feedback');
  feedback.classList.add(classname);
  feedback.innerHTML = text;
  setTimeout(() => {
    feedback.classList.remove(classname);
    feedback.innerHTML = 'Write your name';
  }, 3000);
}
// Clear all items
clearBtn.addEventListener('click', function () {
  if (confirm('Are you sure you want to clear the list of tasks?')) {
    todoList = [];
    localStorage.clear();
    getList(todoList);
    sendFeedback('List emptied', 'teal');
  }
  window.location.reload();
});
