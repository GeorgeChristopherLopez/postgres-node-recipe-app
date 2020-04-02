const express = require("express");
const app = express();

async function deleteRecipe(id) {
  //  alert("deleting id: " + id);
    const deleting = await fetch("http://localhost:8080/delete", {
        method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ "id": id })

    
      

   
})
    window.location.reload(true); 

}
async function editRecipe(id) {
    //  alert("deleting id: " + id);
    const updating = await fetch("http://localhost:8080/delete", {
        method: "GET", headers: { "content-type": "application/json" }, body: JSON.stringify({ "id": id })

    



    })
    alert(id, updating);
    window.location.reload(true);

}
