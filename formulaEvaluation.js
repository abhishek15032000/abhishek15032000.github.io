

/*
   storing the value(data) added by the user in 
   the cell.
*/





for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
        // grabbing cell on the grid
        let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        /*  
        adding event listener blur on each cell
        as soon as we go any other cell from this current cell
        blur event will be triggered 
        */
        cell.addEventListener('blur',(e)=>{
            //getting adress from adress bar
            let address=addressBar.value;
            // will get the cell obj from the sheet db 
              let [activeCell,cellProp]=getActiveCell(address);
              // getting data entered in the cell
              let enteredData=cell.innerText;
              // update data in that cells propertie

               if(enteredData === cellProp.value){
                return;
               }

               

              cellProp.value=enteredData;
              // if data modified directly then update all children
              // dependencies , update children from new hard coded value
              removeChildFromParent(cellProp.formula);
              cellProp.formula="";
              updateChidrenCells(address);
        });

    }
}

let formulaBar=document.querySelector('.formula-bar');


/* 
  
formula evaluation 

*/



/*
  the expression written in this formula bar needs to be evaluated
  the result from this expression needs to be put inside that cells storage as well should show up on the ui.
  we write an expression and then press enter this enter event 
  will lead us to do the following operations 
*/

formulaBar.addEventListener('keydown',async (e)=>{
    /*
    formulaBar.value will give us the expression written inside 
    the formulaBar.
    if nothing is written in the formulaBar it will be an empty string 
    so we are considering that case also before evaluating the expression
    
    ""-empty string is a falsy value in javascript
    */
    let inputFormula=formulaBar.value;
    if(e.key === 'Enter' && formulaBar.value){
        
        /*
            here now we need to change in our database as well
            as change in our ui 
        */
        
        let address=addressBar.value;
        let [cell,cellProp]=getActiveCell(address);
        /*
           making relationship changes if the Inputformula from the adressBar for this cell is different from the previous formula present for this cell in sheet DB 
        */
        if(inputFormula !== cellProp.formula){
            removeChildFromParent(cellProp.formula);
        }
        /*
           after this check we are updating our ui and sheet db
        */
        
        addChildToGraphComponent(inputFormula,address);  
        // check if formula is cyclic or not , then only evaluate.
        let cycleResponse=isGraphCyclic(graphComponentMatrix);
        if(cycleResponse){
         let response=confirm("Your formula is cyclic.Do you want to trace your path ");
            /*
               if graph cyclic then we need to break the relation ship or not
            */
           while(response){
              /*
                    until the confirmation is ok
                    keep on tracking the cycle.

                    we are doing this to make the user realize that where he has made a mistake which led to the formula be cyclic.
              */
              await isGraphCyclicTracePath(graphComponentMatrix,cycleResponse);

              response=confirm("Your formula is cyclic.Do you want to trace your path ");
           }
           removeChildFromGraphComponent(inputFormula,address);
            return;
        }
        let evaluatedValue=evaluateFormula(inputFormula);
        setCellUIAndCellProp(evaluatedValue,inputFormula,address);
        addChildToParent(inputFormula);
        updateChidrenCells(address);
      
        
        
    }
})

/*
  this function will return value of the expression written 

  here javascript provides a function eval() through which will be 
*/


/* 
  here we are establishing a relationship between parent and child 

  B1 uses the formula ( A1 + 10 )
  then if A1 changes we need to change B1 also
  so we add B1 to the child of A1.

*/

function removeChildFromGraphComponent(formula,childAddress){
    let[crid,ccid]=decodeRIDCIDFromAddress(childAddress);
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
           /*
             parent row id 
             parent col id 
           */
          let[prid,pcid]=decodeRIDCIDFromAddress(encodedFormula[i])
          /*
            here we are just popping because 
            this added value will remain at the last of the array so we can pop it to remove it from our graph matrix.
          */
          graphComponentMatrix[prid][pcid].pop();
        }
    }
}


function addChildToGraphComponent(formula,childAddress){
    let[crid,ccid]=decodeRIDCIDFromAddress(childAddress)
    let encodedFormula=formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
           /*
             parent row id 
             parent col id 
           */
          let[prid,pcid]=decodeRIDCIDFromAddress(encodedFormula[i])
          graphComponentMatrix[prid][pcid].push([crid,ccid]);
        }
    }
}

function addChildToParent(formula){
   let childAddress=addressBar.value;
   let encodedFormula=formula.split(" ");
   for(let i=0;i<encodedFormula.length;i++){
    let asciiValue=encodedFormula[i].charCodeAt(0);
    if(asciiValue>=65 && asciiValue<=90){
        let [parentCell,parentCellProp]=getActiveCell(encodedFormula[i]);
        parentCellProp.children.push(childAddress);
    }
   }
}

/* 
   if the formula for a cell changes then we need to reupdate
   the children array of all the terms present in the old formula
   where we have to remove this cell

   and now with the new formula we need to update its children array
   with this cell

   eg:- earlier formula for B1 = ( A1 + A2 )
   now in A1 child array has [B1] , A2 child array has [B1]

   now B1 = ( C1 + C3 )
   now first we need to remove B1 from child array of A1 and A2
   so we need to update this change by the old formula which is stored
   in B1 object in sheet DB


*/

function removeChildFromParent(formula){
    /*
     here we will be taking input of old formula
     because here we need to break the relationship
     between the old formula and this cell
    */

     let childAddress=addressBar.value;
     let encodedFormula=formula.split(" ");
     for(let i=0;i<encodedFormula.length;i++){
        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [parentCell,parentCellProp]=getActiveCell(encodedFormula[i]);
            let idx=parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx,1);
        }
     }
}

function evaluateFormula(formula){
    /*
         it will return us an array where all the terms in the 
         expression will be there 
         (A1 + A2 ) = we will get
         [A1,+,A2]= we will get on split

         now first we will decode it as it is in encoded format
         for decoding we would be getting values from our sheet Database
         and then creating a new formula which will contain the same expression but with encoded values which can be evaluated by
         eval() function of javascript
    */
    
    /*
       WHILE GIVING INPUT PLEASE GIVE 
       ( A1 + A2 )
       THERE SHOULD SPACE FOR CLARITY
    */
    let encodedFormula=formula.split(" ");

    for(let i=0;i<encodedFormula.length;i++){
        /*
            we need to identify if the current expression is 
            a value(10) or an encoded value(A1) because an expression
            can come where the formula written is (A1 + 10)
            
            ** the user must always provide space seperated formula
            otherwise the formula wont work 
        */

        let asciiValue=encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            /* 
               this means it is a dependency variable 
               and needs to be decoded first.
               charCodeAt() will get ascii value of the character 
            */
             let [cell,cellProp] = getActiveCell(encodedFormula[i]);
             /*
               we are replacing the encoded term with decoded value
             */
             encodedFormula[i]=cellProp.value;
        }
     
    }
    /*
            we are now creating an expression where the all the values(decoded)
            would be joined with space between any two values.
            as eval() expects a string to pass to it as an argument

    */ 
    let decodedFormula=encodedFormula.join(" ");
    return eval(decodedFormula);
}

/*
  we will also be storing formula through which the value comes
*/
function setCellUIAndCellProp(evaluatedValue,formula,address){
   let[cell,cellProp]=getActiveCell(address);
   /* UI UPDATE*/
   cell.innerText=evaluatedValue;
   /* UI UPDATE*/
    
   /* DATA UPDATE IN SHEET DATABASE*/
   cellProp.value=evaluatedValue;
   cellProp.formula=formula;
   /* DATA UPDATE IN SHEET DATABASE*/
}


/*
  if the dependencies value changes then we must also 
  bring the change in the values of its respective children
*/

function updateChidrenCells(parentAddress){
    let [parentCell,parentCellProp]=getActiveCell(parentAddress);
    let children=parentCellProp.children;
    
    // base case children.length if length =0 then we will return 

    for(let i=0;i<children.length;i++){
        let childAddress=children[i];
        let [childCell,childCellProp]=getActiveCell(childAddress);
        let childFormula=childCellProp.formula;
        let evaluatedValue=evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue,childFormula,childAddress);
        updateChidrenCells(childAddress);
    }
}