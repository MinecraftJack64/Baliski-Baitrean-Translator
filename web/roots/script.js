var serverURL = "http://localhost:8211";
var roots = [];
var rootsElement = document.getElementById("roots");
var formElement = document.getElementById("form");
function showRoot(root){
    console.log(root);
    let div = document.createElement("li");
    let titleSpan = document.createElement("span");
    let id = document.createElement("span");
    id.innerHTML = root.id+". ";
    titleSpan.appendChild(id);
    if(root.form){
        let title = document.createElement("span");
        title.innerHTML = root.form;
        title.style.fontWeight = "bold";
        titleSpan.appendChild(title);
    }
    if(root.form_alternate){
        titleSpan.innerHTML+="<span> or </span>";
        let alt = document.createElement("span");
        alt.innerHTML = root.form_alternate;
        alt.style.fontWeight = "bold";
        titleSpan.appendChild(alt);
    }
    div.appendChild(titleSpan);
    if(root.meanings){
        for(let m of root.meanings){
            div.innerHTML+=`<span><span style="font-weight: bold;">Meaning: </span><span>`+m+`</span></span>`;
        }
    }
    if(root.origin){
        div.innerHTML+=`<span class="small"><span style="font-weight: bold;">Origin: </span><span>`+root.origin+`</span></span>`;
    }
    if(root.category){
        div.innerHTML+=`<span class="small"><span style="font-weight: bold;">Category: </span><span>`+root.category+`</span></span>`;
    }
    let options = document.createElement("span");
    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.style.color = "red";
    options.appendChild(editButton);
    options.appendChild(deleteButton);
    div.appendChild(options);
    div.style.display = "flex";
    div.style.flexDirection = "column";
    rootsElement.appendChild(div);
}
function showAllRoots(){
    rootsElement.innerHTML = "";
    for(let f of roots){
        showRoot(f);
    }
}
function labelRoots(){
    for(let i = 0; i < roots.length; i++){
        roots[i].id = i;
    }
}
function editRoot(f){
    formElement.style.display = "flex";
    formElement.reset();
    document.getElementById("form-add").style.display = "block";
    document.getElementById("form-id").innerHTML = f.id;
}
function showAddRootForm(){
    formElement.style.display = "flex";
    formElement.reset();
    document.getElementById("form-add").style.display = "none";
    document.getElementById("form-id").innerHTML = roots.length;
}
async function load(){
    roots = await ((await fetch(serverURL+"/roots")).json());
    console.log("ROOTS FETCHED");
    console.log(roots);
    labelRoots();
    //roots.sort((a, b)=>a.form>b.form)
    showAllRoots();
}
load();