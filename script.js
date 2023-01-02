
// creating rows dynamically using javascript

let rows=100;
// because no of alphabets are 26 in english dictionary
let cols=26;

// selecting col which will be containing numbering 
// from 1 to 100;
let addressColCont=document.querySelector(".address-col-cont");

// selecting row which will be containing numbering
// for all cols from A - Z

let addressRowCont=document.querySelector('.address-row-cont');

// add cells in the grid 

let cellsCont=document.querySelector('.cells-cont');

// add location of the cell in the address bar 

let addressBar=document.querySelector(".address-bar");


/*
assigning values to the col which will contain numbers 1-100 through which we will be identifying our rows 
*/
for(let i=0;i<rows;i++){
    let addressCol =document.createElement('div');
    // we are giving a class of address-col to each
    // div created here 
    addressCol.setAttribute("class","address-col");
    addressCol.innerText=i+1;
    addressColCont.appendChild(addressCol);
}

/*
assigning values to the row which will contain characters A-Z through which we will be identifying our Cols
*/

for(let i=0;i<cols;i++){
    let addressRow=document.createElement('div');
    addressRow.setAttribute("class","address-row");
    addressRow.innerText=String.fromCharCode(65+i);
    addressRowCont.appendChild(addressRow);
}

/*

we are creating a matrix of size 26*100
in the form of divs and placing in the 
grid area 

we have made the divs created editable to add values
we have added event listener to each cell using the function addListenerForAdressBarDisplay which 
for each cell created ads event listener which 
when the div is clicked it would change the adressBar
with its matrix location 
*/

for(let i=0;i<rows;i++){
    let rowCont=document.createElement('div');
    rowCont.setAttribute("class","row-cont");
    for(let j=0;j<cols;j++){
       let cell=document.createElement("div");
       cell.setAttribute("class","cell");
       // to add data to cell
       cell.setAttribute("contenteditable","true");
       cell.setAttribute("spellcheck",false);
       /*
       for cell identification we are attaching
       i and j to each cell 
       as an attribute rid and cid 
       */
       cell.setAttribute("rid",i);
       cell.setAttribute("cid",j);
       rowCont.appendChild(cell);
       addListenerForAddressBarDisplay(cell,i,j);
    }
    cellsCont.appendChild(rowCont);
}


/*
  
adds an event listener to each cell through which
we will be able to update the adress bar whenever
the focus is on that cell 

*/
function addListenerForAddressBarDisplay(cell,row,col){
    cell.addEventListener("click",(e)=>{
        let rowID=row+1;
        let colID=String.fromCharCode(65+col);
        addressBar.value=`${colID}${rowID}`;
    })
}

