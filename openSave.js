/*

 this file is for uploading the excel sheet 

 and for also the downloading the excel sheet we created.

*/


let downloadBtn=document.querySelector(".download");

let uploadBtn=document.querySelector(".upload");

/*
  
  when we will be clicking on the download icon ,
  we get the sheet in JSON format because JSON is fast
  and convenient to do our work as well as 
  for sending a copy of the data to the local machine


  JSON DATA is in the form of objects
  where objects contain their properties in the form of key and value pair.

*/

/*
   download task done here
*/

downloadBtn.addEventListener('click',(e)=>{
 let data=[sheetDB,graphComponentMatrix];
 // we need to convert this data to JSON
 // so we use JSON.stringify to convert this data to JSON


 /*
   
 Blob is a file like object of immutable ,raw data,they  can be read a s text or binary data.


 */

 let jsonData=JSON.stringify(data);
 let file=new Blob([jsonData],{type:"application/json"});

 // type can also be text/plain
  
 let anchorElement=document.createElement('a');

 anchorElement.href=URL.createObjectURL(file);
// when downloaded the name will be sheetData.json
 anchorElement.download="SheetData.json";

 anchorElement.click();

})


/*
 
 upload task

*/

/*
  
read a file using javascript 
where input is json

File reader is an api provided by the browser
GFG as a source for file reader
*/

uploadBtn.addEventListener('click',(e)=>{
   /*
   here we are creating an input element
   and we have set its attribute to file
   which means it will take a file as an input 
   now we are clicking this input element using javascript internally so 
   it will open the file explorer for the user to select the json file which he wants to upload.
   */
   let inputElement=document.createElement('input');
   inputElement.setAttribute("type","file");
   inputElement.click();

   /* 
   when we select the file from the input tag we trigger an event change 
   */

   inputElement.addEventListener("change",(e)=>{
      let fr=new FileReader();
      // it will return a list of files as we can select multiple files in one go to upload 
      let fileUploaded=inputElement.files;
      // here since we are uploading a single file so the array will contain a single file object so the file uploaded will be present in the array at index 0
      let fileObj=fileUploaded[0];

      fr.readAsText(fileObj);
      // since we encoded the data into JSON FORMAT then send for download so in order to extract data we need to first convert it again to the normal matrix which is sheetDB and graphComponentMatrix in order to render it on the UI.
      
      fr.addEventListener('load',(e)=>{
       let sheetData=JSON.parse(fr.result);
       // so here we will create new sheet and then add all the data from the sheetData which is sheetDB and graphComponentMatrix data.
       
       //Basic sheet with default data will be created as we click addSheetBtn which is present in sheetHandling.js
       addSheetBtn.click();

       // sheetDB , graphComponentMatrix
       // sheetData store the two matrix in its array [ sheetDB, graphComponentMatrix]
       sheetDB=sheetData[0];
       graphComponentMatrix=sheetData[1];

       // we will be adding to collectedSheetDB
       collectedSheetDB[collectedSheetDB.length-1]=sheetData;
       collectedGraphComponent[collectedGraphComponent.length-1]=graphComponentMatrix;

       handleSheetProperties();
      })

   })
})