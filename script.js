let closet = JSON.parse(localStorage.getItem("closet")) || [];
let outfits = JSON.parse(localStorage.getItem("outfits")) || [];
let currentOutfit = [];

function addItem(){

let name=document.getElementById("name").value;
let category=document.getElementById("category").value;
let brand=document.getElementById("brand").value;
let colors=document.getElementById("colors").value.split(",");
let tags=document.getElementById("tags").value.split(",");

let file=document.getElementById("image").files[0];

let reader=new FileReader();

reader.onload=function(){

closet.push({
name,
category,
brand,
colors,
tags,
image:reader.result
});

saveCloset();
displayCloset();
updateStats();

}

if(file) reader.readAsDataURL(file);

}

function saveCloset(){
localStorage.setItem("closet",JSON.stringify(closet));
}

function displayCloset(){

let categoryFilter=document.getElementById("categoryFilter").value.toLowerCase();
let brandFilter=document.getElementById("brandFilter").value.toLowerCase();
let colorFilter=document.getElementById("colorFilter").value.toLowerCase();
let tagFilter=document.getElementById("tagFilter").value.toLowerCase();

let closetDiv=document.getElementById("closet");

closetDiv.innerHTML="";

closet.forEach((item,index)=>{

if(categoryFilter && item.category.toLowerCase()!=categoryFilter) return;

if(brandFilter && !item.brand.toLowerCase().includes(brandFilter)) return;

if(colorFilter){

let match=item.colors.some(c=>c.toLowerCase().includes(colorFilter));
if(!match) return;

}

if(tagFilter){

let match=item.tags.some(t=>t.toLowerCase().includes(tagFilter));
if(!match) return;

}

let div=document.createElement("div");
div.className="item";

div.innerHTML=`
<img src="${item.image}">
<div>${item.name}</div>
`;

div.onclick=()=>showItem(index);

closetDiv.appendChild(div);

});

}

function showItem(index){

let item=closet[index];

document.getElementById("itemModal").style.display="flex";

document.getElementById("itemDetails").innerHTML=`

<img src="${item.image}" style="width:100%;border-radius:6px">

<h3>${item.name}</h3>

<p><b>Category:</b> ${item.category}</p>
<p><b>Brand:</b> ${item.brand}</p>
<p><b>Colors:</b> ${item.colors.join(", ")}</p>
<p><b>Tags:</b> ${item.tags.join(", ")}</p>

<button onclick="editItem(${index})">Edit</button>
<button onclick="deleteItem(${index})">Delete</button>
<button onclick="addToOutfit(${index})">Add To Outfit</button>

`;

}

function closeModal(){
document.getElementById("itemModal").style.display="none";
}

function deleteItem(index){

closet.splice(index,1);

saveCloset();

displayCloset();
updateStats();
closeModal();

}

function editItem(index){

let item=closet[index];

document.getElementById("name").value=item.name;
document.getElementById("brand").value=item.brand;
document.getElementById("category").value=item.category;
document.getElementById("colors").value=item.colors.join(",");
document.getElementById("tags").value=item.tags.join(",");

deleteItem(index);

closeModal();

}

function addToOutfit(index){

if(!currentOutfit.includes(index)){
currentOutfit.push(index);
}

displayOutfitBuilder();

}

function displayOutfitBuilder(){

let builder=document.getElementById("outfitBuilder");

builder.innerHTML="";

currentOutfit.forEach(i=>{

let img=document.createElement("img");
img.src=closet[i].image;

builder.appendChild(img);

});

}

function saveOutfit(){

if(currentOutfit.length===0) return;

outfits.push([...currentOutfit]);

localStorage.setItem("outfits",JSON.stringify(outfits));

currentOutfit=[];

displayOutfitBuilder();
displaySavedOutfits();

}

function displaySavedOutfits(){

let container=document.getElementById("savedOutfits");

container.innerHTML="";

outfits.forEach(outfit=>{

let div=document.createElement("div");
div.className="savedOutfit";

outfit.forEach(i=>{

let img=document.createElement("img");
img.src=closet[i].image;

div.appendChild(img);

});

container.appendChild(div);

});

}

function updateStats(){

let total=closet.length;

let categories={};
let brands={};

closet.forEach(item=>{

categories[item.category]=(categories[item.category]||0)+1;
brands[item.brand]=(brands[item.brand]||0)+1;

});

let statsHTML=`<p><b>Total Items:</b> ${total}</p>`;

statsHTML+="<p><b>By Category:</b></p>";

for(let c in categories){

statsHTML+=`${c}: ${categories[c]}<br>`;

}

statsHTML+="<p><b>Top Brands:</b></p>";

for(let b in brands){

statsHTML+=`${b}: ${brands[b]}<br>`;

}

document.getElementById("stats").innerHTML=statsHTML;

}

displayCloset();
displaySavedOutfits();
updateStats();