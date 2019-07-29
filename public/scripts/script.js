$(document).ready(() => {
  const itemsDisplay = $("#itemDisplay");

  //Give specific ids to html elements
  //to help us navigate easier
  const buildIds = item => {
    return {
      listItemId: "ListItem_" + item._id,
      deleteId: "Delete_" + item._id,
      priceId: "Price_" + item._id
    };
  };

  //Template for how items should appear in webpage
  const buildTemplate = (item, id) => {
    return `<li class="list-group-item" id="${id.listItemId}">
                <div class="row">
                    <div class="col-md-2">${item.name}</div>
                    <div class="col-md-2">
                      <img src=${item.img} alt="${
      item.name
    }" height="140" width="140">
                    </div>
                    <div class="col-md-3" id="${id.priceId}">Price: ${
      item.currentPrice
    }</div>
                    <div class="col-md-3">
                        <form action=${item.url}>
                      <input type="submit" value="View Item on Amazon" />
                    </form></div>
                    <div class="col-md-2">
                      <button type="button" id="${
                        id.deleteId
                      }">Delete Item</button>
                    </div>

              </li>`;
  };

  //Display items on webpage
  const displayItems = data => {
    data.forEach(item => {
      const ids = buildIds(item);
      itemsDisplay.append(buildTemplate(item, ids));
      deleteItem(item, ids.listItemId, ids.deleteId);
      updateItems(item, ids.priceId);
    });
  };

  //Delete item from database
  const deleteItem = (item, listItemId, deleteId) => {
    let deleteBtn = $(`#${deleteId}`);
    deleteBtn.click(() => {
      const confirmDelete = confirm("Delete Item?");
      if (confirmDelete) {
        fetch(`items/${item._id}`, {
          method: "delete"
        }).then(response => {
          if (response.status == 200) {
            $(`#${listItemId}`).remove();
          }
          return response.json();
        });
      }
    });
  };

  //Update all items in database
  const updateItems = (item, priceId) => {
    let updateBtn = $(`#update`);
    updateBtn.click(() => {
      fetch(`items/${item._id}`, {
        method: "put",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ _id: item._id, url: item.url })
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          $(`#${priceId}`).html(`Price: ${data.request["updatedPrice"]}`);
        });
    });
  };

  //Get items from database
  const getItems = () => {
    fetch("/items", { method: "GET" })
      .then(response => {
        return response.json();
      })
      .then(data => {
        displayItems(data.items);
      });
  };

  getItems();
});
