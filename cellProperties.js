

// storage 

/*
 
we would be storing information regarding each
cell on the grid as an object in a 2d matrix 
where data of each cell can be mapped from this 2d matrix to the cell to which it belongs

we would be storing the data in the javascript objects 

*/


// color properties for cell properties when applied on the cell and when not applied on the cell
let activeColorProp="#d1d8e0";
let inactiveColorProp="#ecf0f1";


/*
  this collected sheet DB would contain all the
  sheetDB of the sheets created .

  sheet1 - sheetDB1 
  sheet2 - sheetDB2

  collectedSheetDB=[sheetDB1,sheetDB2]

*/

let collectedSheetDB=[]

let sheetDB=[];

{   /* here we are trying to as soon as we open the site we need to create 
       a sheet by clicking on it and then handling its sheet properties

       since addSheetBtn takes case of the creation of sheetDB as well as GraphComponentMatrix 
       and the UI setup for each sheet.
    */
    let addSheetBtn=document.querySelector(".sheet-add-icon");
    addSheetBtn.click();

}

/*

for(let i=0;i<rows;i++){
    let sheetRow=[];
    for(let j=0;j<cols;j++){
        let cellProp={
             bold:false,
             italic:false,
             underline:false,
             alignment:"left",
             fontFamily:"monospace",
             fontSize:"14",
             // default value of font color and background color
             fontColor:"#000000",
             BGcolor:"#000000",
             value:"",// value inside the cell
             formula:"",// formula for the cell if any 
             children:[],// to establish parent child relationship
        }
        sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
}

*/

/*
  address bar 
*/



// selectors for cell properties
let bold=document.querySelector('.bold');
let italic=document.querySelector('.italic');
let underline=document.querySelector('.underline');
let fontSize=document.querySelector('.font-size-prop');
let fontFamily=document.querySelector('.font-family-prop');
let fontColor=document.querySelector('.font-color-prop');
let BGcolor=document.querySelector('.BGcolor-prop');
let alignment=document.querySelectorAll('.alignment');
let leftAlign=alignment[0];
let centerAlign=alignment[1];
let rightAlign=alignment[2];


// attach property listener

/* we would attach event listeners to all these cell properties
 we would be accessing cells adress using the adress being display on the adress bar A10 :- like this , 
 we would decode it and find cells row and col
 now we would query select the cell based on row and col we got
 and then apply the respective changes in its object values
*/


// application of 2 - way binding  , changes in ui and data will be refelected
bold.addEventListener('click',(e)=>{
  let [cell,cellProp]=getActiveCell(addressBar.value);
  // Modification
  
  /* DATA CHANGE */
  cellProp.bold=!cellProp.bold;
  /* DATA CHANGE */

   /* UI CHANGE */
  cell.style.fontWeight=cellProp.bold?"bold":"normal";
  bold.style.backgroundColor=cellProp.bold? activeColorProp:inactiveColorProp;
  /* UI CHANGE */

})

italic.addEventListener('click',(e)=>{
    let [cell,cellProp]=getActiveCell(addressBar.value);
    // Modification
    
    /* DATA CHANGE */
    cellProp.italic=!cellProp.italic;
    /* DATA CHANGE */
  
     /* UI CHANGE */
    cell.style.fontStyle=cellProp.italic?"italic":"normal";
    italic.style.backgroundColor=cellProp.italic? activeColorProp:inactiveColorProp;
    /* UI CHANGE */
    
})

underline.addEventListener('click',(e)=>{
    let [cell,cellProp]=getActiveCell(addressBar.value);
    // Modification
    
    /* DATA CHANGE */
    cellProp.underline=!cellProp.underline;
    /* DATA CHANGE */
  
     /* UI CHANGE */
    cell.style["text-decoration"]=cellProp.underline?"underline":"none";
    underline.style.backgroundColor=cellProp.underline? activeColorProp:inactiveColorProp;
    /* UI CHANGE */
    
})  

/*
   font size is getting selected from a drop down column so the event is change 

*/

fontSize.addEventListener('change',(e)=>{
    let [cell,cellProp]=getActiveCell(addressBar.value);
    
    /* DATA CHANGE */
    cellProp.fontSize=fontSize.value;
    /* DATA CHANGE */
    
    /* UI CHANGE */
    cell.style.fontSize=cellProp.fontSize+"px"; 
    fontSize.value=cellProp.fontSize;
     /* UI CHANGE */
})


fontFamily.addEventListener('change',(e)=>{
    let [cell,cellProp]=getActiveCell(addressBar.value);
    
    /* DATA CHANGE */
    cellProp.fontFamily=fontFamily.value;
    /* DATA CHANGE */
    
    /* UI CHANGE */
    cell.style.fontFamily=cellProp.fontFamily; 
    fontFamily.value=cellProp.fontFamily;
     /* UI CHANGE */ 
})

fontColor.addEventListener('change', (e) => {
    let [cell, cellProp] = getActiveCell(addressBar.value);
    /* DATA CHANGE */
    cellProp.fontColor = fontColor.value; 
    /* DATA CHANGE*/
    /* UI CHANGE */
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
    /* UI CHANGE */
})

BGcolor.addEventListener('change',(e)=>{
    let [cell,cellProp]=getActiveCell(addressBar.value);
    
    /* DATA CHANGE */
    cellProp.BGcolor=BGcolor.value;
    /* DATA CHANGE */
    
    /* UI CHANGE */
    cell.style.backgroundColor=cellProp.BGcolor; 
    BGcolor.value=cellProp.BGcolor;
     /* UI CHANGE */
})


/* for alignment*/
alignment.forEach((alignment)=>{
    alignment.addEventListener("click",(e)=>{
        let [cell,cellProp]=getActiveCell(addressBar.value);
        
        
        let alignValue=e.target.classList[0];
        
        /* Data CHANGE*/
        cellProp.alignment=alignValue;
        /* Data CHANGE*/

        /* UI CHANGE */
        cell.style.textAlign=cellProp.alignment;
        
        switch(alignValue){
            case "left":{
                leftAlign.style.backgroundColor=activeColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            }   
            case "center":{
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=activeColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            }
            case "right":{
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=activeColorProp;
                break;
            }
        }

        /* UI CHANGE  */
    })
})


/*
 here we are attaching event listener on every cell 
 such that as soon as we click on the cell then we will 
 be loading the styles upon the cell as well as updating the
 styles on the cell prop with respect to the cell on which 
 it is applied 
*/ 
let allCells=document.querySelectorAll('.cell');
for(let i=0;i<allCells.length;i++){
    // sending each row to this function 
    addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell){
    // work
    cell.addEventListener("click",(e)=>{

      let [cell,cellProp]=getActiveCell(addressBar.value);
   

        // apply cell properties 
        cell.style.fontWeight=cellProp.bold?"bold":"normal";
        cell.style.fontStyle=cellProp.italic?"italic":"normal";
        cell.style["text-decoration"]=cellProp.underline?"underline":"none";
        cell.style.fontSize=cellProp.fontSize+"px"; 
        cell.style.color = cellProp.fontColor;
        cell.style.fontFamily=cellProp.fontFamily;
        cell.style.backgroundColor=cellProp.BGcolor === "#000000" ? "transparent":cellProp.BGcolor;
        cell.style.textAlign=cellProp.alignment;

        // apply properties on the icons 
        bold.style.backgroundColor=cellProp.bold? activeColorProp:inactiveColorProp;
        italic.style.backgroundColor=cellProp.italic? activeColorProp:inactiveColorProp;
        underline.style.backgroundColor=cellProp.underline? activeColorProp:inactiveColorProp;
        fontColor.value = cellProp.fontColor;
        BGcolor.value=cellProp.BGcolor;
        fontSize.value=cellProp.fontSize;
        fontFamily.value=cellProp.fontFamily;
        switch(cellProp.alignment){
            case "left":{
                leftAlign.style.backgroundColor=activeColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            }   
            case "center":{
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=activeColorProp;
                rightAlign.style.backgroundColor=inactiveColorProp;
                break;
            }
            case "right":{
                leftAlign.style.backgroundColor=inactiveColorProp;
                centerAlign.style.backgroundColor=inactiveColorProp;
                rightAlign.style.backgroundColor=activeColorProp;
                break;
            }
        }

        let formulaBar=document.querySelector('.formula-bar');
        formulaBar.value=cellProp.formula;
        //
        cell.value=cellProp.value;
        cell.innerText=cellProp.value;
    })
}




function getActiveCell(address){
   // first decoding the adress into row id and col id
   /*
    destructuring - means no of variable passed in the [rid,cid]
    we will get those many values only from the assigned array
    and rest of the values are ignored
   */
  let [rid,cid]=decodeRIDCIDFromAddress(address);
  // Access cell and storage object
  let cell=document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  // getting data from the sheet db of the cell on which this propertie is applied
  let cellProp=sheetDB[rid][cid];
  return [cell,cellProp];
}

function decodeRIDCIDFromAddress(address){
    //eg: A1 
    // 1 is row id , A-col id
    // slice(1) would bring the string from index 1 in the address string
    let rid=Number(address.slice(1))-1;// making it 0 index based
    let cid=Number(address.charCodeAt(0))-65;// make it 0 index based
    return [rid,cid];
}