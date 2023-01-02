

/*
 creating a matrix to store dependencies for each cell.

 eg:-
 B1=(A1+10);
 then in A1 's cell 
 we would be adding B1's location in the matrix
 [[i,j]]
 similarly if
 C1 =(A1 +A2 +10)
 A1 would have dependency of C1
 because A1 changes C1 changes

 C1 location is i1,j1
 [[i,j],[i1,j1]] = this is the data format in which A1 would be storing all its dependencies in the graph component matrix 

 we used array here as a choice because on Cell could have multiple dependenceis so we use it 

*/


let collectedGraphComponent=[];


let graphComponentMatrix=[];

/*
for(let i=0;i<rows;i++){
    let row=[];
    for(let j=0;j<cols;j++){
     // we can have multiple dependency for a single cell
       row.push([]);
    }
    graphComponentMatrix.push(row);
}
*/

function isGraphCyclic(){
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
    
    let cellLocation=[];

    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
        if(visited[i][j]===false){
            let response= dfsCycleDetection(graphComponentMatrix,i,j,visited,dfsVisited,cellLocation); 
            if(response === true){
             /*
               returns the cells index where cycle has been detected so that the cycle could be traced out and colored

               Array is an object which has a truthy value so we can return this array.

             */
               return cellLocation;
               //[i,j]
            }
          }
        }
    }
    
    /*
      in case if there is no cycle in the graph
      then Null object would be returned which is a falsy value and will not enter the block where cycle is being coloured.

    */

    return null;

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
function dfsCycleDetection(graphComponentMatrix,srcr,srcc,visited,dfsVisited,cellLocation){
   visited[srcr][srcc]=true;
   dfsVisited[srcr][srcc]=true;
   
   // A1 ->[ [0,1] , [1,0] ,[5,10] ,....]
   
   for(let children=0;children<graphComponentMatrix[srcr][srcc].length;children++){
    // crid == child row id 
    // ccid == child col id
  let [crid,ccid]=graphComponentMatrix[srcr][srcc][children]

       if(visited[crid][ccid] === false){
            let response=  dfsCycleDetection(graphComponentMatrix,crid,ccid,visited,dfsVisited,cellLocation); 
            if(response === true){
                // found cycle in the graph
                // return immediately
                // no need to explain more path
                  return true;
            }
       }else if(visited[crid][ccid] === true  && dfsVisited[crid][ccid]===true){
        // condition to check if cycle is present or not
        cellLocation.push(crid);
        cellLocation.push(ccid); 
        return true;
       }
   }
   dfsVisited[srcr][srcc]=false;
   return false;
}