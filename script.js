// ======================================
// Prototype
// Chunk 3
// Player Modal + Import / Export
// ======================================

// ---------- Selected ----------

let selectedPlayer=null;

// ---------- Modal ----------

function openPlayer(player){

selectedPlayer=player;

modalName.textContent=
player.name;

modalRarity.textContent=
player.rarity;

modalDanger.textContent=
player.danger+"/25";

modalDifficulty.textContent=
player.difficulty+"/25";

modalDescription.value=
player.description||"";

playerModal.classList.remove(
"hidden"
);

}

function closePlayer(){

selectedPlayer=null;

playerModal.classList.add(
"hidden"
);

}

closeModal.onclick=
closePlayer;

playerModal.onclick=e=>{

if(

e.target===playerModal

){

closePlayer();

}

};

// ---------- Save Description ----------

saveDescription.onclick=()=>{

if(

!selectedPlayer

){

return;

}

selectedPlayer.description=

modalDescription.value;

saveEverything();

status.style.color=

"#16a34a";

status.textContent=

"Description saved.";

};

// ---------- Live Save ----------

modalDescription.oninput=()=>{

if(

!selectedPlayer

){

return;

}

selectedPlayer.description=

modalDescription.value;

saveEverything();

};

// ---------- Edit ----------

editPlayerButton.onclick=()=>{

if(

!selectedPlayer

){

return;

}

playerName.value=

selectedPlayer.name;

danger.value=

selectedPlayer.danger;

difficulty.value=

selectedPlayer.difficulty;

rarity.value=

selectedPlayer.rarity;

dangerValue.textContent=

danger.value;

difficultyValue.textContent=

difficulty.value;

deletePlayer(

selectedPlayer.id

);

closePlayer();

status.style.color=

"#0a84ff";

status.textContent=

"Editing player...";

};

// ---------- Delete ----------

deletePlayerButton.onclick=()=>{

deleteModal.classList.remove(

"hidden"

);

};

cancelDelete.onclick=()=>{

deleteModal.classList.add(

"hidden"

);

};

confirmDelete.onclick=()=>{

if(

!selectedPlayer

){

return;

}

deletePlayer(

selectedPlayer.id

);

deleteModal.classList.add(

"hidden"

);

closePlayer();

};

// ---------- Export ----------

exportSaveButton.onclick=()=>{

const data=

JSON.stringify(

saves[currentSave],

null,

2

);

const blob=

new Blob(

[data],

{

type:

"application/json"

}

);

const url=

URL.createObjectURL(

blob

);

const a=

document.createElement(

"a"

);

a.href=url;

a.download=

currentSave+

".json";

a.click();

URL.revokeObjectURL(

url

);

status.style.color=

"#16a34a";

status.textContent=

"Save exported.";

};

// ---------- Import ----------

importSaveButton.onclick=()=>{

importFile.click();

};

importFile.onchange=e=>{

const file=

e.target.files[0];

if(

!file

){

return;

}

const reader=

new FileReader();

reader.onload=event=>{

try{

const imported=

JSON.parse(

event.target.result

);

let saveName=

file.name.replace(

".json",

""

);

let i=2;

while(

saves[saveName]

){

saveName=

file.name.replace(

".json",

"")

+" ("+

i++

+")";

}

if(

imported.players

){

saves[saveName]=

imported;

}else{

saves[saveName]={

players:

imported

};

}

saveEverything();

refreshSaveList();

status.style.color=

"#16a34a";

status.textContent=

"Imported "+saveName;

}catch{

status.style.color=

"#dc2626";

status.textContent=

"Invalid file.";

}

};

reader.readAsText(

file

);

};

// ---------- Escape ----------

document.addEventListener(

"keydown",

e=>{

if(

e.key==="Escape"

){

closePlayer();

deleteModal.classList.add(

"hidden"

);

}

});

// ---------- Statistics ----------

function totalPlayers(){

let total=0;

Object.values(

saves

).forEach(save=>{

total+=

save.players.length;

});

return total;

}

function totalSaves(){

return Object.keys(

saves

).length;

}
// ======================================
// Prototype
// Chunk 4
// Graph + Startup
// ======================================

// ---------- Graph ----------

function drawGraph(displayPlayers){

ctx.clearRect(

0,

0,

canvas.width,

canvas.height

);

const left=90;
const top=50;

const width=

canvas.width-150;

const height=

canvas.height-120;

const style=

getComputedStyle(

document.body

);

const textColor=

style.getPropertyValue(

"--graphText"

).trim();

const gridColor=

style.getPropertyValue(

"--graphGrid"

).trim();

const axisColor=

style.getPropertyValue(

"--graphOutline"

).trim();

// Axes

ctx.strokeStyle=

axisColor;

ctx.lineWidth=2;

ctx.beginPath();

ctx.moveTo(

left,

top

);

ctx.lineTo(

left,

top+height

);

ctx.lineTo(

left+width,

top+height

);

ctx.stroke();

// Grid

ctx.strokeStyle=

gridColor;

for(

let i=1;

i<MAX_VALUE;

i++

){

const x=

left+

width*i/

MAX_VALUE;

const y=

top+

height-

height*i/

MAX_VALUE;

ctx.beginPath();

ctx.moveTo(

x,

top

);

ctx.lineTo(

x,

top+height

);

ctx.stroke();

ctx.beginPath();

ctx.moveTo(

left,

y

);

ctx.lineTo(

left+width,

y

);

ctx.stroke();

}

// Numbers

ctx.fillStyle=

textColor;

ctx.font=

"13px Arial";

for(

let i=0;

i<=MAX_VALUE;

i++

){

ctx.fillText(

i,

left+

width*i/

MAX_VALUE-5,

top+

height+20

);

ctx.fillText(

i,

left-28,

top+

height-

height*i/

MAX_VALUE+5

);

}

// Players

const used={};

(displayPlayers||players)

.forEach(player=>{

const key=

player.danger+

","+

player.difficulty;

if(

!used[key]

){

used[key]=0;

}

const n=

used[key]++;

const angle=

n*Math.PI/4;

const radius=

n*8;

const x=

left+

(player.difficulty/

MAX_VALUE)

*width+

Math.cos(angle)

*radius;

const y=

top+

height-

(player.danger/

MAX_VALUE)

*height+

Math.sin(angle)

*radius;

player.graphX=x;

player.graphY=y;

ctx.beginPath();

ctx.fillStyle=

rarityColors[

player.rarity

];

ctx.arc(

x,

y,

8,

0,

Math.PI*2

);

ctx.fill();

ctx.strokeStyle=

"#ffffff";

ctx.lineWidth=2;

ctx.stroke();

ctx.fillStyle=

textColor;

ctx.font=

"14px Arial";

ctx.fillText(

player.name,

x+12,

y-10

);

});

// Preview

if(

playerName.value.trim()

!==

""

){

const x=

left+

Number(

difficulty.value

)/

MAX_VALUE

*width;

const y=

top+

height-

Number(

danger.value

)/

MAX_VALUE

*height;

ctx.globalAlpha=.35;

ctx.beginPath();

ctx.fillStyle=

rarityColors[

rarity.value

];

ctx.arc(

x,

y,

10,

0,

Math.PI*2

);

ctx.fill();

ctx.globalAlpha=1;

}

// Axis titles

ctx.save();

ctx.fillStyle=

textColor;

ctx.font=

"18px Arial";

ctx.fillText(

"Difficulty",

left+

width/2-40,

canvas.height-25

);

ctx.translate(

25,

canvas.height/2

);

ctx.rotate(

-Math.PI/2

);

ctx.fillText(

"Danger",

0,

0

);

ctx.restore();

}

// ---------- Graph Click ----------

canvas.onclick=e=>{

const rect=

canvas.getBoundingClientRect();

const scaleX=

canvas.width/

rect.width;

const scaleY=

canvas.height/

rect.height;

const x=

(e.clientX-

rect.left)

*scaleX;

const y=

(e.clientY-

rect.top)

*scaleY;

for(

const player

of players

){

const dx=

x-player.graphX;

const dy=

y-player.graphY;

if(

Math.sqrt(

dx*dx+

dy*dy

)<12

){

openPlayer(

player

);

return;

}

}

};

// ---------- Startup ----------

refreshSaveList();

saveManager.classList.remove(

"hidden"

);

app.classList.add(

"hidden"

);

console.log(

"Prototype Save Manager loaded."

);
// ======================================
// Prototype
// Chunk 5
// Utility + Statistics + Final Startup
// ======================================

// ---------- Statistics ----------

function getAverageDanger(){

if(

players.length===0

){

return 0;

}

let total=0;

players.forEach(player=>{

total+=player.danger;

});

return(

total/

players.length

).toFixed(1);

}

function getAverageDifficulty(){

if(

players.length===0

){

return 0;

}

let total=0;

players.forEach(player=>{

total+=player.difficulty;

});

return(

total/

players.length

).toFixed(1);

}

function highestDanger(){

if(

players.length===0

){

return null;

}

return players.reduce(

(a,b)=>

a.danger>

b.danger

?

a

:

b

);

}

function highestDifficulty(){

if(

players.length===0

){

return null;

}

return players.reduce(

(a,b)=>

a.difficulty>

b.difficulty

?

a

:

b

);

}

// ---------- Helpers ----------

function findPlayer(id){

return players.find(

player=>

player.id===id

);

}

const labels={

danger:

"Danger",

difficulty:

"Difficulty",

rarity:

"Rarity",

description:

"Description"

};

// ---------- Future ----------

function duplicateCurrentSave(){

const name=

currentSave+

" Copy";

let finalName=name;

let i=2;

while(

saves[finalName]

){

finalName=

name+

" "+i++;

}

saves[finalName]={

players:

JSON.parse(

JSON.stringify(

players

)

)

};

saveEverything();

refreshSaveList();

}

function renameCurrentSave(){

const name=

prompt(

"Rename save",

currentSave

);

if(

!name||

name===currentSave

){

return;

}

if(

saves[name]

){

alert(

"Save already exists."

);

return;

}

saves[name]=

saves[currentSave];

delete saves[currentSave];

currentSave=name;

saveEverything();

refreshSaveList();

}

// ---------- Debug ----------

window.debug={

players,

saves,

currentSave,

switchSave,

createNewSave,

duplicateCurrentSave,

renameCurrentSave,

deletePlayer,

refresh,

drawGraph

};

// ---------- Startup ----------

normalizePlayers();

refresh();

refreshSaveList();

console.log(

"Entrenched Database Prototype Build Ready"

);

// ======================================
// End of Prototype JS
// ======================================
// ======================================
// Prototype
// Chunk 6
// Save Manager Improvements
// ======================================

// ---------- Save Cards ----------

let selectedSave=currentSave;

function refreshSaveList(){

saveList.innerHTML="";

Object.keys(saves).forEach(name=>{

const card=

document.createElement(

"div"

);

card.className=

"saveCard";

if(

name===selectedSave

){

card.classList.add(

"selected"

);

}

const count=

saves[name].players.length;

card.innerHTML=`

<h3>${name}</h3>

<p>

${count}

Player${count===1?"":"s"}

</p>

`;

card.onclick=()=>{

selectedSave=name;

refreshSaveList();

};

saveList.appendChild(

card

);

});

}

// ---------- Open Save ----------

openSaveButton.onclick=()=>{

currentSave=

selectedSave;

players=

saves[currentSave].players;

normalizePlayers();

saveEverything();

refresh();

saveManager.classList.add(

"hidden"

);

app.classList.remove(

"hidden"

);

status.style.color=

"#16a34a";

status.textContent=

"Opened "+currentSave;

};

// ---------- New Save ----------

newSave.onclick=()=>{

createNewSave();

};

// ---------- Rename ----------

renameSaveButton.onclick=()=>{

renameCurrentSave();

};

// ---------- Delete ----------

deleteSaveButton.onclick=()=>{

removeSave();

};

// ---------- Export ----------

exportSaveButton.onclick=()=>{

const exportData={

name:currentSave,

players:players,

version:"Prototype"

};

const blob=

new Blob(

[

JSON.stringify(

exportData,

null,

2

)

],

{

type:

"application/json"

}

);

const url=

URL.createObjectURL(

blob

);

const a=

document.createElement(

"a"

);

a.href=url;

a.download=

currentSave+".json";

a.click();

URL.revokeObjectURL(

url

);

};

// ---------- Save Counter ----------

function totalPlayersAcrossSaves(){

let total=0;

Object.values(

saves

).forEach(save=>{

total+=

save.players.length;

});

return total;

}

function updateTitle(){

document.title=

"Entrenched Database - "

+

Object.keys(

saves

).length

+

" Saves";

}

updateTitle();

// ---------- Auto Save ----------

setInterval(()=>{

saveEverything();

updateTitle();

},5000);

// ---------- Startup ----------

refreshSaveList();

console.log(

"Prototype Save Manager Ready"

);

// ======================================
// End Prototype
// ======================================
