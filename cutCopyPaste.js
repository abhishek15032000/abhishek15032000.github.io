
let ctrlKey;

document.addEventListener("keydown",(e)=>{
    // we can select a cell when we press ctrl+click
    ctrlKey=e.ctrlKey;

})
document.addEventListener("keyup",(e)=>{
    ctrlKey=e.ctrlKey;
})

for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
        let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
         handleSelectedCells(cell);
    }
}

/*
    range storage holds the two cells
    through which the subMatrix would
    be defined 

    cell1 =[i1,j1] == location on the grid

    cell2= [i2,j2] == location on the grid

    rangeStorage=[[i1,j1],[i2,j2]]
    in it 

    so we checked if rangeStorage>=2 means there are more than 2 cells selected 

    which we dont want so we return 
    
*/
let rangeStorage=[];

function handleSelectedCells(cell){
    cell.addEventListener('click',(e)=>{
        // select cells range work
        if(!ctrlKey){
            // continue only if ctrl key is still pressed 
            return;
        }
        if(rangeStorage.length >=2 ){
            // if we are selecting more than 2 cells for defining the range of the submatrix then first remove the UI changes made to the original 2 selected cells and then remove the cells location stored in the range storage , so make range storage as empty.
            
            defaultSelectedCellsUI();
            rangeStorage=[];
        }
        
        // UI 
        // setting border for the selected cell
        cell.style.border="3px solid #218c74"
        

        /*
           rid , cid 
           rid = will give us the 
        */
        let rid=Number(cell.getAttribute("rid"));
        let cid=Number(cell.getAttribute("cid"));
        rangeStorage.push([rid,cid]);
    })
}

function defaultSelectedCellsUI(){
       for(let i=0;i<rangeStorage.length;i++){
        let cell=document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border="1px solid lightgrey";

       }
}

let copyBtn=document.querySelector(".copy");
let cutBtn=document.querySelector(".cut");
let pasteBtn=document.querySelector(".paste");

/*

run an event when we click on copy icon
to copy data we need some storage

*/

let copyData=[];
copyBtn.addEventListener('click',(e)=>{
    if(rangeStorage.length<2){
        // do this copying of data when the selected cells identifying the reange of the submatrix to copied is exactly equal to 2
        return;
    }
    // this is done because when we get a new submatrix then we must clear the previous data present so we initalize it back to empty.
    copyData=[];

    let top_left_row=rangeStorage[0][0];
    let top_left_col=rangeStorage[0][1];

    let bottom_right_row=rangeStorage[1][0];
    let bottom_right_col=rangeStorage[1][1];
    
    for(let i=top_left_row;i<=bottom_right_row;i++){
        let copyRow=[];
        for(let j=top_left_col;j<=bottom_right_col;j++){
            let {...cellProp}=sheetDB[i][j];
            copyRow.push(cellProp);
        }
        /*
             here adding data row by row 
             of the selected sub matrix 
        */
        copyData.push(copyRow);
    }
    // to clear the UI changes as well as rangeStorage made on the selected cells after the coping of data has been done
    defaultSelectedCellsUI();
})


/*
   for paste 
*/

pasteBtn.addEventListener('click',(e)=>{
    // paste cells data 

    // we will get the address of the selected cell where we need to paste from the adressBar 

    
    if(rangeStorage.length <2){
        // we are handling the case when a cell is selected for paste but the submatrix on which copy has been done is not selected in this case we simply return.
        return;
    }
   


    let rowDiff=Math.abs(rangeStorage[0][0]-rangeStorage[1][0]);

    let colDiff=Math.abs(rangeStorage[0][1]-rangeStorage[1][1]);




    let address=addressBar.value;
    // strow=row no of the cell which is currently being selected 
    // stcol=col no of the cell which is currently being selected
    let [stRow,stCol]=decodeRIDCIDFromAddress(address);
    // r refers to the row of copyData[] and c refers to col of copyData[]
    for(let i=stRow,r=0;i<=stRow+rowDiff;i++,r++){
        for(let j=stCol,c=0;j<=stCol+colDiff;j++,c++){
            let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            /*
                 since we want to make error free
                 we will be copying data which lies in the range

                 we would paste as much as possible which is within 
                 26*100 matrix

                 if cell exists then we will copy
                 other wise if cell== undefined 
            */
           if(!cell){
               // if not within range move to the other cells which are within range and data can be copied there.
               continue;
           }
           // DATABASE CHANGE
           let data=copyData[r][c];
           let cellProp=sheetDB[i][j];
           cellProp.value=data.value;
           cellProp.bold=data.bold;
           cellProp.italic=data.italic;
           cellProp.underline=data.underline;
           cellProp.fontSize=data.fontSize;
           cellProp.fontFamily=data.fontFamily;
           cellProp.fontColor=data.fontColor;
           cellProp.BGcolor=data.BGcolor;
           cellProp.alignment=data.alignment;


           // here we will not be forming children array and grah relation between different dependencies because here we are just copying the data

           // UI 
           // on cell container in cellProperties.js we had added an event listener to the cell where we click and all the UI changes are mode both on the cell Properties icons used as well on the cell itself.
           cell.click();

        }
    }

})


/*

 cut paste option.

 removing the data from the submatrix 

*/

cutBtn.addEventListener('click',(e)=>{
    
    if(rangeStorage.length<2){
        // do this copying of data when the selected cells identifying the reange of the submatrix to copied is exactly equal to 2
        return;
    }
    
    // to make a copy of data so that paste could work on this data.
    copyBtn.click();

    let top_left_row=rangeStorage[0][0];
    let top_left_col=rangeStorage[0][1];

    let bottom_right_row=rangeStorage[1][0];
    let bottom_right_col=rangeStorage[1][1];
    
    for(let i=top_left_row;i<=bottom_right_row;i++){
        for(let j=top_left_col;j<=bottom_right_col;j++){

            //DB WORK
            

            //UI MANAGEMENT
            let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            // setting the default styles to the region where cut is applied .
            let cellProp=sheetDB[i][j];
            cellProp.value="";
            cellProp.bold=false;
            cellProp.italic=false;
            cellProp.underline=false;
            cellProp.fontSize=14;
            cellProp.fontFamily="monospace";
            cellProp.fontColor="#000000";
            cellProp.BGcolor="#000000";
            cellProp.alignment="left";
            
            // to update the UI present on the sheet of the selected cells for the cut role.
            cell.click();
        }
        
    }

    // clearing out the styles applied on the two ends points identifying the submatrix.

    defaultSelectedCellsUI();
})