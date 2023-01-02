

let activeSheetColor="#ced6e0";


 /*
    working up on ui

    whenver we click on add icon 

    we need to add sheets at the bottom in sequence

    here all sheet folders means the no of sheets that are present at that moment;

    we are setting an id on all sheet folders based on the sequence in which they are added.
 */
let sheetsFolderContainer=document.querySelector('.sheets-folder-cont');
let addSheetBtn=document.querySelector(".sheet-add-icon");
addSheetBtn.addEventListener('click',(e)=>{
    let sheet =document.createElement("div");
    sheet.setAttribute("class","sheet-folder");

    let allSheetFolders=document.querySelectorAll('.sheet-folder');
    sheet.setAttribute("id",allSheetFolders.length);

    sheet.innerHTML=`
                    <div class="sheet-content">
                        Sheet ${allSheetFolders.length+1}
                    </div>
                    `;
    /*
       add sheets at the bottom by appending it to the sheets folder container
    */
    sheetsFolderContainer.appendChild(sheet);
    createSheetDB();
    createGraphComponentMatrix();

    /*
       when we add a sheet the below scroll bar will scroll to make the addedShhet visible on the scroll bar .
    */
    sheet.scrollIntoView();
    /*
       to remove sheet from the sheetDB as well remove its corresponding graphComponentMatrix
    */
    handleSheetRemoval(sheet);


    /* 
    whenever user toggles between sheet 
    we need to copy data from that sheetDB to
    the actual grid.
    */
    
    handleSheetActiveness(sheet);

    /*
       this is done so as soon as the sheet gets created mark it active by changing its color and executing sheetHandlingProperties.
    */
    sheet.click();

});

function handleSheetDB(sheetIndex){
   /*
   
   in our cellProperties.js we earlier used 
   sheetDB[] and we performed all our operations on this.
   the same sheetDB[] in that cellProperties.js
   is now being assigned here 
   

   same is being done for the graphComponentMatrix which is created in cycleDetection.js
   we are assigning that here by fetching the graph related to the active sheet from the collectedGraphComponentMatrix.
  */

  sheetDB=collectedSheetDB[sheetIndex];
  graphComponentMatrix=collectedGraphComponent[sheetIndex];
}

function handleSheetProperties(){
    /*
      since we added an event listener to all the cells in the cellProperties.js
      by clicking the cell we would be displaying all the properties of that cell such as
      fontweight,fontfamily..and other stuff on that cell

      similarly for each cell the respective changes in their icons will be displayed
    */

    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            // clicking all the cells present inside the sheetDB.
            let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }

// gets the first cell on the grid 
let firstCell=document.querySelector('.cell');
// clicking on the cell using our dom internally
firstCell.click();
/*
this is done to prevent empty adress bar so that we cannot apply
properties on an non selected cell , which will error out
*/
}


function handleSheetActiveness(sheet){
    /*
       here we are adding event listener on the sheet
       such that when we click on this sheet we are 
       running a function which will copy the data
       from the 
    */
   sheet.addEventListener("click",(e)=>{
        /*
           we are retrieving the sheets with their id because in the collectedSheetDB the data of indiviual sheets lies inside the collectedSheetDB in 0 based indexing.

           getting sheetIndex which is stored as an 
           id attribute.
        */
       let sheetIndex= Number(sheet.getAttribute("id"));
       handleSheetDB(sheetIndex);
       handleSheetProperties();
       handleSheetUI(sheet);
   })
}


/*

whenever we add a new sheet instead of creating 

a new grid for that sheet we would be copying the new sheets data to the original sheet 


*/

/*
  
by default as we open there will be 1 sheet present

rest all other sheets will be created by the user.

*/

function createSheetDB(){
/* 
  whenever we create a sheet by clicking the icon
  this function would run and would create a sheetDB
  and would push inside the collectedSheetDB

*/
let sheetDB=[];

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

collectedSheetDB.push(sheetDB);

}

/*
  
as every sheet has different data as stored in the form of sheetDB 

similary every sheet present will have its own 
graphcComponentMatrix 

so here we will be storing indiviual sheets
graphComponentMatrix.



*/


function createGraphComponentMatrix(){
  let graphComponentMatrix=[];
  for(let i=0;i<rows;i++){
    let row=[];
    for(let j=0;j<cols;j++){
     // we can have multiple dependency for a single cell
       row.push([]);
    }
    graphComponentMatrix.push(row);
   }
   collectedGraphComponent.push(graphComponentMatrix);
}

/*
  here we are making the sheet which is currently in use to look active my adding some color to differentiate from all other sheets which are inactive.
*/


function handleSheetUI(sheet){
    let allSheetFolders=document.querySelectorAll('.sheet-folder');
    for(let i=0;i<allSheetFolders.length;i++){
        allSheetFolders[i].style.backgroundColor="transparent";
    }
    sheet.style.backgroundColor=activeSheetColor;
}


/*
  handling sheet removal 

  we will be using our right click to remove the sheet
  since we use left click on the icon to add a sheet 
*/

function handleSheetRemoval(sheet){
    // mouse down 
    sheet.addEventListener("mousedown",(e)=>{
         /*
        we will be identifying the mouse click using e.button
         0 will be my left click
         1 will be my scroll
         2 will be my right click

         if none of these then we return back instantly
         */

         if(e.button!==2){
            return;
         }

         let allSheetFolders=document.querySelectorAll('.sheet-folder');


         /* 
            we can delete a sheet only when there is more than one sheet.

         */
        
        if(allSheetFolders.length === 1){
            alert("You need to have atleast one sheet");
            return;
        }
        
        let response=confirm("Your sheet will be removed permanently ,Are you sure ");
        if(response === false){
            return;
        }
        let sheetIdx=Number(sheet.getAttribute("id"));

        /*
            removing it from our database
            collectedSheetDB .collectedGraphComponent
        */
        collectedSheetDB.splice(sheetIdx,1);
        collectedGraphComponent.splice(sheetIdx,1);
        //UI
        
        handlingSheetUIRemoval(sheet);
  
        // by default bring sheet 1 to active after removal so load up all the contents of the sheet

        sheetDB=collectedSheetDB[0];
        graphComponentMatrix=collectedGraphComponent[0];
        handleSheetProperties();
    })
}


function handlingSheetUIRemoval(sheet){
    // UI removing it from dom
    sheet.remove();

    /*
     now maintaining the sequence of sheets after deletion
     
     here we would be modifying the sheet name as well as the id present on the sheet folder div
     of the rest of the sheets.
     */

     let allSheetFolders=document.querySelectorAll('.sheet-folder');

     for(let i=0;i<allSheetFolders.length;i++){
        allSheetFolders[i].setAttribute("id",i);
        let sheetContent=allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText=`Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor="transparent";

     }

     allSheetFolders[0].style.backgroundColor=activeSheetColor;
}