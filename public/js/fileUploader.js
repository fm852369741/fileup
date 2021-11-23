window.document.body.onload = () => {
   const dragArea = document.querySelector('.drag-area');
   const uploadButton = dragArea.querySelector('button');
   const uploader = document.createElement('input');
   
   uploader.setAttribute('type', 'file');
   uploader.setAttribute('multiple', '');

   uploader.addEventListener('change', (e) => {
      const files = e.path[0].files;
      
      [...files].map(async (file) => {
         const formData = new FormData();
         formData.append('file', file);

         await fetch('/ajax/upload', {
            method: 'POST',
            body: formData
         });
      });


   });

   uploadButton.addEventListener('click', () => {
      uploader.click();
   });
};