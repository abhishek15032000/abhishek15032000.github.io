


function delay(color,cell){
    return new Promise((resolve,reject)=>{
      cell.style.backgroundColor=color;
      setTimeout(()=>{
          resolve("done");
      },1000);
    })
  }



async function isGraphCyclicTracePath(graphComponentMatrix,cycleResponse){

    let[sourceRow,sourceCol]=cycleResponse;
    /*
     if true means that the cells in our graph
     is cyclic

     true == 
     false ==

    */

     /*
        we will use dfsVisited matrix to keep record of stack
        
        we will create a visited matrix to keep track of visited cells 

        if dfs visited [cell] == true and visited [cell] == true means there is cycle 

        so we would return true

        else we woudl continue .
        when all the childs have been explored of a cell then we will mark it univisted in dfs visited matrix 
     */
     

    /*
       node visit trace
    */    
    let visited=[];
    /*
       start visit trace
    */
    let dfsVisited=[];
    for(let i=0;i<rows;i++){
        let visitedRow=[];
        let dfsVisitedRow=[];
        for(let j=0;j<cols;j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    } 
    
    
   /*
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
        if(visited[i][j]===false){
            let response= dfsCycleDetectionTracePath(graphComponentMatrix,i,j,visited,dfsVisited); 
            if(response === true){
               return true;
            }
          }
        }
    }
    */
    
    /*
      here we will not re run the cycle detection algorithm in order to find the point where the cycle starts 

      we would receive the cell location from the 
      isCyclic function 

      and from this cell we would colour out the path where the cycle is 

      hence optimizing time complexity as we do not have to run from scratch 


    */
    
    let response=await dfsCycleDetectionTracePath(graphComponentMatrix,sourceRow,sourceCol,visited,dfsVisited);

    if(response===true){
        return Promise.resolve(true)
    }
    /*
     
     promise and waiting logic

    */

    return Promise.resolve(false);

} 
/* 
  recursive work

   Start => visited (True) , dfsVisit (True)
   End => dfsVis(false)

   if(visited[cell]===true){
    already explored path
    no use to explore again 
    return;
   }
   Cycle detection condition => if(visited[cell] && dfsVisited[cell]){
    return true;
   }

*/

/* 
srcr = source row
srcc = source col
*/

/*
 
coloring cell for tracking 
we iterate over children of the source cell
and colour them and add delay so that it is visible to the user and not disappear within fractions of seconds.


let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

for grabing the cell with its col and row

*/




async function dfsCycleDetectionTracePath(graphComponentMatrix,srcr,srcc,visited,dfsVisited){
   visited[srcr][srcc]=true;
   dfsVisited[srcr][srcc]=true;
   
   // A1 ->[ [0,1] , [1,0] ,[5,10] ,....]

   let cell=document.querySelector(`.cell[rid="${srcr}"][cid="${srcc}"]`);

   /*
     adding background color to the cell
   */
   
    await delay("lightblue",cell);
    // here there will be 1 sec pause. because after resolving the execution will start of the below code.
   
   for(let children=0;children<graphComponentMatrix[srcr][srcc].length;children++){
    // crid == child row id 
    // ccid == child col id
  let [crid,ccid]=graphComponentMatrix[srcr][srcc][children]

       if(visited[crid][ccid] === false){
            let response= await dfsCycleDetectionTracePath(graphComponentMatrix,crid,ccid,visited,dfsVisited); 
            if(response === true){
                // found cycle in the graph
                // return immediately
                // no need to explain more path
               await delay("transparent",cell);
               return Promise.resolve(true);
            }
       }else if(visited[crid][ccid] === true  && dfsVisited[crid][ccid]===true){
        // condition to check if cycle is present or not 
        let cyclicCell=document.querySelector(`.cell[rid="${crid}"][cid="${ccid}"]`);

       await delay("lightsalmon",cyclicCell);
       await delay("transparent",cyclicCell);
       await delay("transparent",cell);
       return Promise.resolve(true);
       }
   }
   dfsVisited[srcr][srcc]=false;
   return Promise.resolve(false);
}